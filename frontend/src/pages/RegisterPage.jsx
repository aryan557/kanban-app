import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setError('');
    try {
      await axios.post('https://kanban-app-gzj0.onrender.com/api/auth/register', { username, email, password });
      // Auto-login after register
      const res = await axios.post('https://kanban-app-gzj0.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <RegisterForm onRegister={handleRegister} loading={loading} error={error} />
      <div className="switch-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage; 