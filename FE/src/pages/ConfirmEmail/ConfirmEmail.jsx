import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('mail');
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await axios.get(`https://localhost:7055/api/account/confirm-email?token=${token}&mail=${email}`);
        if (res.status === 200) {
          navigate("/login", { state: { message: "Email confirmed successfully. Please log in." } });
        } else {
          setMessage("Email confirmation failed.");
        }
      } catch (error) {
        setMessage("Email confirmation failed. Please try again or contact support.");
        console.error("Email confirmation failed:", error);
      }
    };
    if (token && email) {
      confirmEmail();
    } else {
      setMessage("Invalid email confirmation request.");
    }
  }, [token, email, navigate]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default ConfirmEmail;
