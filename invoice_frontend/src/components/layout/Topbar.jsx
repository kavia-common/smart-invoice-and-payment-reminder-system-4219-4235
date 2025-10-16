import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open sidebar">☰</button>
      <div className="topbar-title">Smart Invoice & Payment Reminder</div>
      <div className="user-menu">
        <button className="user-btn" onClick={() => setOpen((v) => !v)}>
          {user?.name || user?.email || 'User'}
        </button>
        {open && (
          <div className="dropdown">
            <button onClick={() => { setOpen(false); window.location.href = '/settings'; }}>Settings</button>
            <button onClick={() => { setOpen(false); logout(); window.location.href = '/login'; }}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
