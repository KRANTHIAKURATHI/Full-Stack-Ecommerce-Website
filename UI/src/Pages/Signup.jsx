import React, { useState } from 'react';
import API from '../API';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [fullname, setFullname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post('/user', {
        fullname,
        phonenumber,
        emailID,
        password
      });
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="p-8 rounded-lg shadow-lg w-96 bg-white/10 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Signup</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-2 mb-4 border border-white bg-transparent text-white placeholder-white rounded"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          className="w-full p-2 mb-4 border border-white bg-transparent text-white placeholder-white rounded"
        />

        <input
          type="email"
          placeholder="Email ID"
          value={emailID}
          onChange={(e) => setEmailID(e.target.value)}
          className="w-full p-2 mb-4 border border-white bg-transparent text-white placeholder-white rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-white bg-transparent text-white placeholder-white rounded"
        />

        {error && <p className="text-red-300 mb-2">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Signup
        </button>

        <p className="text-center mt-4 text-sm text-white">
          Already have an account?{' '}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate('/')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
