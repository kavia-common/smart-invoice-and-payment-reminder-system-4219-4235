import { NavLink } from 'react-router-dom';

/** Sidebar navigation with Ocean Professional styling. */
export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">Smart Invoice</div>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">×</button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">Dashboard</NavLink>
        <NavLink to="/invoices" className="nav-item">Invoices</NavLink>
        <NavLink to="/partners" className="nav-item">Partners</NavLink>
        <NavLink to="/templates" className="nav-item">Templates</NavLink>
        <NavLink to="/analytics" className="nav-item">Analytics</NavLink>
        <NavLink to="/settings" className="nav-item">Settings</NavLink>
      </nav>
    </aside>
  );
}
