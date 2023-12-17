import React from 'react';

const AddPatientModal = ({ isOpen, onClose, onSubmit, name, setName, age, setAge, weight, setWeight, gender, setGender }) => {

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        // Pass the data up to the parent onSubmit handler
        onSubmit({ name, age, weight, gender });
      };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Add Patient</h3>
          <div className="mt-2 px-7 py-3">
            <form className="space-y-6" onSubmit={handleLocalSubmit}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-2 py-1 text-gray-700"/>
              <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required className="w-full border rounded px-2 py-1 text-gray-700"/>
              <input type="number" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} required className="w-full border rounded px-2 py-1 text-gray-700"/>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full border rounded px-2 py-1 text-gray-700">
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <button type="submit" className="w-full bg-blue-500 text-white rounded hover:bg-blue-700 px-4 py-2 focus:outline-none">Add Patient</button>
            </form>
          </div>
          <div className="items-center px-4 py-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
