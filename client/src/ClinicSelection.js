import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ClinicSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const { clinicId } = useParams();

  useEffect(() => {
    // Replace with your actual API call
    fetch(`${process.env.REACT_APP_API_URL}/getDoctors?clinicId=${clinicId}`)
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error('Error:', error));
  }, [clinicId]);

  const handleDoctorSelect = (doctorId) => {
    navigate(`/?doctorId=${doctorId}`);
  };

  return (
    <div>
      {doctors.map((doctor) => (
        <button key={doctor.doctor_id} onClick={() => handleDoctorSelect(doctor.doctor_id)}>
          {doctor.doctor_name}
        </button>
      ))}
    </div>
  );
};

export default ClinicSelection;