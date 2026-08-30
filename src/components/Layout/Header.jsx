import React from 'react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Sun, Moon, Compass, Palette, ChevronDown, LogOut } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Compass size={24} />
            <h1>TrailMuse</h1>
          </div>
        </div>

        <div className="header-right">


          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user && (
            <div className="user-chip">
              <span className="user-chip-name">{user.name}</span>
              <button className="theme-toggle" onClick={logout} aria-label="Log out">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
