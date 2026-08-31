import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  Package,
  DollarSign,
  Cloud,
  CreditCard,
  Sparkles,
  MoreHorizontal,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './BottomNav.css';

// The 4 most-used sections live directly on the bar.
// Everything else sits behind "More" so the bar never overflows on small screens.
const primaryItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/ai-planner', icon: Sparkles, label: 'AI Plan' },
  { to: '/trip-planner', icon: Calendar, label: 'Trips' },
  { to: '/budget', icon: DollarSign, label: 'Budget' }
];

const moreItems = [
  { to: '/packing', icon: Package, label: 'Packing List' },
  { to: '/weather', icon: Cloud, label: 'Weather' },
  { to: '/currency', icon: CreditCard, label: 'Currency' }
];

const BottomNav = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMore = () => setIsMoreOpen(false);

  return (
    <>
      {isMoreOpen && <div className="bottom-nav-overlay" onClick={closeMore} />}

      <div className={`bottom-nav-sheet ${isMoreOpen ? 'open' : ''}`}>
        <div className="bottom-nav-sheet-header">
          <span>More</span>
          <button className="bottom-nav-sheet-close" onClick={closeMore} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <div className="bottom-nav-sheet-links">
          {moreItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMore}
              className={({ isActive }) =>
                `bottom-nav-sheet-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          {user && (
            <button className="bottom-nav-sheet-link bottom-nav-sheet-logout" onClick={logout}>
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        {primaryItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `bottom-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          className={`bottom-nav-link ${isMoreOpen ? 'active' : ''}`}
          onClick={() => setIsMoreOpen(true)}
        >
          <MoreHorizontal size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
