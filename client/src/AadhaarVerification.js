import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const AadhaarVerification = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isAadhaarValid, setIsAadhaarValid] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);

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
      const response = await axios.post('/enrollment/request/otp', { aadhaarNumber });
      if(response.data.success) {
        setIsOtpSent(true);
        // You might want to store the transactionId from the response if needed for verifying the OTP
      } else {
        // Handle failure - show message to user
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      // Handle the error - show message to user
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('/enrollment/verify/otp', { aadhaarNumber, otp });
      if(response.data.success) {
        // OTP verified
        // Proceed to next step or show success message
      } else {
        // OTP verification failed - show message to user
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle the error - show message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Create ABHA Number</h1>
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
          {!isAadhaarValid && <p className="text-red-500 text-xs italic">Aadhaar number is invalid.</p>}
        </div>
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
        {isAadhaarValid && isConsentGiven && (
          <button
           onClick={sendOtp} 
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Send OTP</button>
        )}
        {isOtpSent && (
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
            <button 
            onClick={verifyOtp} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4">Verify OTP</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AadhaarVerification;
