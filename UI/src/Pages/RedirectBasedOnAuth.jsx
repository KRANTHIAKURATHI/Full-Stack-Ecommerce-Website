// Pages/RedirectBasedOnAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RedirectBasedOnAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (userID) {
      navigate('/HomePage');
    } else {
      navigate('/login');
    }
  }, []);

  return null;
}

export default RedirectBasedOnAuth;
