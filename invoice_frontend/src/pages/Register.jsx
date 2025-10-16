import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await AuthApi.register(form);
      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) {
        // Some backends may not auto-login; if so, redirect to login
        window.alert('Registration successful. Please log in.');
        nav('/login', { replace: true });
        return;
      }
      login(token);
      nav('/', { replace: true });
    } catch (err) {
      window.alert(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
        />
        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <span className="info">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
