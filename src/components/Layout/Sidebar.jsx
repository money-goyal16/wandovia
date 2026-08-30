import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Map, 
  Package, 
  DollarSign, 
  Cloud, 
 
  CreditCard,
  Sparkles
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/ai-planner', icon: Sparkles, label: 'AI Trip Planner' },
    { to: '/trip-planner', icon: Calendar, label: 'Trip Planner' },

    { to: '/packing', icon: Package, label: 'Packing List' },
    { to: '/budget', icon: DollarSign, label: 'Budget' },
    { to: '/weather', icon: Cloud, label: 'Weather' },

    { to: '/currency', icon: CreditCard, label: 'Currency' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;