import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://kanban-app-gzj0.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
      <div className="switch-link">
        Don&apos;t have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default LoginPage; 