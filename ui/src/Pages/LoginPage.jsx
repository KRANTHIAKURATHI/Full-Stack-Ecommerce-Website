import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function LoginPage() {
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Manual Login Handler
  const handleLogin = async () => {
    try {
      const res = await API.post('/userlogin', { emailID, password });

      if (res.data.success) {
        // Now storing both Token and UserID
        localStorage.setItem('token', res.data.token); 
        localStorage.setItem('userID', res.data.user.user_id);
        navigate('/HomePage');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = () => {
    // Redirects browser to Node.js which then redirects to Google
    window.location.href = 'http://localhost:5000/api/auth/google';
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
      <div className="p-8 rounded-lg shadow-lg w-96 bg-white/10 backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        
        <input
          type="text"
          placeholder="Email ID"
          value={emailID}
          onChange={(e) => setEmailID(e.target.value)}
          className="w-full p-2 mb-4 border border-white/50 bg-transparent text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-white/50 bg-transparent text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {error && <p className="text-red-400 mb-2 text-sm text-center">{error}</p>}
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
          Login
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="mx-2 text-white/50 text-xs">OR</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition font-medium"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="google" 
            className="w-5 h-5 mr-2" 
          />
          Continue with Google
        </button>


      </div>
    </div>
  );
}

export default LoginPage;