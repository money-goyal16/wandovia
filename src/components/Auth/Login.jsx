import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(form.email, form.password);
    setSubmitting(false);
    if (success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Compass size={22} />
          <span>TrailMuse</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to see your trips and plan new ones.</p>

        {authError && <div className="auth-error">{authError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={submitting}>
            {submitting && <Loader2 size={18} className="spin" />}
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
