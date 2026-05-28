import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userID = searchParams.get('userID');

    if (token && userID) {
      // 1. Clear any old, potentially corrupted session data
      localStorage.removeItem('token');
      localStorage.removeItem('userID');

      // 2. Save the fresh credentials
      localStorage.setItem('token', token);
      localStorage.setItem('userID', userID);
      
      // 3. Dispatch a storage event 
      // This is helpful if your Sidebar or Navbar needs to update 
      // its "Logged In" status immediately
      window.dispatchEvent(new Event("storage"));

      // 4. Smooth transition to HomePage
      setTimeout(() => {
        navigate('/HomePage', { replace: true });
      }, 500); // Short delay so the user sees the "Securing Session" feedback
    } else {
      console.error("Authentication failed: Missing token or userID in URL");
      navigate('/', { replace: true }); // Redirect to main login
    }
  }, [searchParams, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        {/* Amazon-style yellow spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-yellow-500">Login Successful!</h2>
        <p className="text-gray-400 mt-2">Setting up your personalized experience...</p>
      </div>
    </div>
  );
}

export default LoginSuccess;