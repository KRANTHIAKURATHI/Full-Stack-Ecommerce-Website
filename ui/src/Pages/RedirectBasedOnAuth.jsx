import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectBasedOnAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    // If both exist, they are "Logged In"
    if (token && userID) {
      navigate('/HomePage');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null; // This component just redirects
}

export default RedirectBasedOnAuth;