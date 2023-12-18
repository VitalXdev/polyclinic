import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const AadhaarVerification = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isAadhaarValid, setIsAadhaarValid] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(''); // For m2
  const [mobileNumberTxnId, setMobileNumberTxnId] = useState(''); // Transaction ID for mobile number verification
  const [isMobileNumberVerified, setIsMobileNumberVerified] = useState(false);
  const [isResendOtpRequired,setIsResendOtpRequired]=useState(false);

  const handleAadhaarChange = (event) => {
    setAadhaarNumber(event.target.value);
    // Validate Aadhaar Number here if needed
  };

  const handleConsentChange = (event) => {
    setIsConsentGiven(event.target.checked);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post('/generateOTP', { aadhaarNumber });
      if (response.data.success) {
        setIsOtpSent(true);
        setMobileNumberTxnId(response.data.txnId); // Save transaction ID for OTP verification
      } else {
        // Handle failure
      }
    } catch (error) {
      // Handle the error
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/verifyOTP', { aadhaarNumber, otp });
      if (response.data.success) {
        setMobileNumber(response.data.mobileNumber); // Set m1
        setMobileNumberTxnId(response.data.txnId); // Update txnId for mobile number verification
        setIsMobileNumberVerified(false);
        setIsResendOtpRequired(false); // Resetting in case it was set before
      } else {
        // OTP verification failed - provide feedback to the user
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle the error - provide feedback to the user
    }
  };

  const verifyMobileNumber = async () => {
    try {
      const response = await axios.post('/checkandgenerateMobileOTP', { mobileNumber, txnId: mobileNumberTxnId });
      if (response.data.success) {
        if (response.data.check) {
          createHealthIdByAadhaar(response.data.txnId);
          setIsMobileNumberVerified(true);
        } else {
          setIsResendOtpRequired(true); // Mobile number doesn't match, need to re-verify OTP
        }
      } else {
        // Handle failure - provide feedback to the user
      }
    } catch (error) {
      console.error('Error checking mobile number:', error);
      // Handle the error - provide feedback to the user
    }
  };

  const createHealthIdByAadhaar = async (txnId) => {
    try {
      const response = await axios.post('/createHealthIdByAadhaar', { txnId });
      if (response.data.success) {
        // Handle success - ABHA number created
      } else {
        // Handle failure
      }
    } catch (error) {
      // Handle the error
    }
  };

  const resendOtp = async () => {
    setIsOtpSent(false);
    setIsResendOtpRequired(false);
    // Here you would normally trigger the OTP to be resent.
    // This may be another call to '/generateOTP' or a different endpoint, depending on your backend logic.
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Create ABHA Number</h1>
        
        {/* Aadhaar Number Input */}
        {!isOtpSent && (
          <>
            <div className="mb-4">
              <label htmlFor="aadhaarNumber" className="block text-gray-700 text-sm font-bold mb-2">Aadhaar Number</label>
              <input 
                id="aadhaarNumber"
                type="text"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                placeholder="Enter Aadhaar Number"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!isAadhaarValid ? 'border-red-500' : ''}`}
              />
              {!isAadhaarValid && <p className="text-red-500 text-xs italic">Please enter a valid Aadhaar number.</p>}
            </div>
            
            {/* Consent Checkbox */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  checked={isConsentGiven}
                  onChange={handleConsentChange}
                  className="form-checkbox text-indigo-600"
                />
                <span className="ml-2 text-gray-700 text-sm">I agree to the terms and conditions</span>
              </label>
            </div>
            
            {/* Send OTP Button */}
            <button
              onClick={sendOtp}
              disabled={!isAadhaarValid || !isConsentGiven}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            >
              Send OTP
            </button>
          </>
        )}
        
        {/* OTP Verification */}
        {isOtpSent && (
          <>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
              <input 
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            {/* Verify OTP Button */}
            <button
              onClick={verifyOtp}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Verify OTP
            </button>
          </>
        )}
        
        {/* Mobile Number Input and Verification */}
        {isOtpSent && (
          <>
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
              <input
                id="mobileNumber"
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            {/* Verify Mobile Number Button */}
            <button
              onClick={verifyMobileNumber}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isMobileNumberVerified ? 'hidden' : ''}`}
            >
              Verify Mobile Number
            </button>
            
            {/* Resend OTP Button */}
            {!isMobileNumberVerified && (
              <button
                onClick={resendOtp} // You'll need to define this function
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Resend OTP
              </button>
            )}
        </>
      )}

      {/* Conditional rendering based on mobile number verification response */}
      {isMobileNumberVerified && (
        // Display success message or continue to the next step
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Verified!</strong>
          <span className="block sm:inline">Mobile number has been successfully verified.</span>
        </div>
      )}

      {/* Additional steps or messages can be added here based on further process requirements */}

    </div>
  </div>
);
  
};

export default AadhaarVerification;
