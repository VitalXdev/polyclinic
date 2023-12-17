const axios = require('axios');
const apiBaseURL = 'https://abhasbx.abdm.gov.in/abha/api';

const getAuthToken = () => {
    return process.env.ABDM_KEY;
  };
  
  // Modify axios calls to include the authorization header
  axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

// Retrieve the public key
const getPublicKey = async () => {
  try {
    const response = await axios.get(`${apiBaseURL}/v1/auth/cert`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving public key:', error);
    throw error;
  }
};

// Request OTP for enrollment, update mobile, and update email
const requestOtp = async (data) => {
  try {
    const response = await axios.post(`${apiBaseURL}/v3/enrollment/request/otp`, data);
    return response.data;
  } catch (error) {
    console.error('Error requesting OTP:', error);
    throw error;
  }
};

// Enroll by Aadhaar verification
const enrollByAadhaar = async (data) => {
  try {
    const response = await axios.post(`${apiBaseURL}/v3/enrollment/enrol/byAadhaar`, data);
    return response.data;
  } catch (error) {
    console.error('Error enrolling by Aadhaar verification:', error);
    throw error;
  }
};

// Verify mobile OTP, email, and mobile update
const verifyByAbdm = async (data) => {
  try {
    const response = await axios.post(`${apiBaseURL}/v3/enrollment/auth/byAbdm`, data);
    return response.data;
  } catch (error) {
    console.error('Error verifying by ABDM:', error);
    throw error;
  }
};

// Enroll by document
const enrollByDocument = async (data) => {
  try {
    const response = await axios.post(`${apiBaseURL}/v3/enrollment/enrol/byDocument`, data);
    return response.data;
  } catch (error) {
    console.error('Error enrolling by document:', error);
    throw error;
  }
};

// Get suggestions for ABHA address creation
const getSuggestionForAbhaAddress = async () => {
  try {
    const response = await axios.get(`${apiBaseURL}/v3/enrollment/enrol/suggestion`);
    return response.data;
  } catch (error) {
    console.error('Error getting suggestions for ABHA address:', error);
    throw error;
  }
};

// Create ABHA address
const createAbhaAddress = async (data) => {
  try {
    const response = await axios.post(`${apiBaseURL}/v3/enrollment/enrol/abha-address`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating ABHA address:', error);
    throw error;
  }
};

module.exports = { getPublicKey,requestOtp,enrollByAadhaar, verifyByAbdm,enrollByDocument,getSuggestionForAbhaAddress,createAbhaAddress };

