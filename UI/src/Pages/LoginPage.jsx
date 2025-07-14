import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';


function LoginPage() {
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.get('/userlogin', {
        params: { emailID, password }
      });

      if (res.data.success) {
        localStorage.setItem('userID', res.data.user.user_id);
        navigate('/HomePage');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Invalid email or password');
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
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <input
          type="text"
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
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-center mt-4 text-sm text-white">
          Don't have an account?{' '}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
