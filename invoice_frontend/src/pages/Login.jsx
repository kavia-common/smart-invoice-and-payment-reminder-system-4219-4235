import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await AuthApi.login(form);
      const token = data?.token || data?.accessToken || data?.jwt;
      if (!token) throw new Error('No token returned from backend');
      login(token);
      nav('/', { replace: true });
    } catch (err) {
      window.alert(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
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
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <span className="info">
            No account? <Link to="/register">Register</Link>
          </span>
        </div>
      </form>
    </div>
  );
}
