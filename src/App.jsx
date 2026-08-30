import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { TravelPlannerProvider } from './contexts/TravelPlannerContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import TripPlanner from './components/TripPlanner/TripPlanner';
import AITripPlanner from './components/AIPlanner/AITripPlanner';

import PackingList from './components/PackingList/PackingList';
import BudgetCalculator from './components/Budget/BudgetCalculator';
import WeatherWidget from './components/Weather/WeatherWidget';

import CurrencyConverter from './components/Currency/CurrencyConverter';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

// Header + Sidebar shell, only shown once the user is authenticated
const AppLayout = () => (
  <ProtectedRoute>
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TravelPlannerProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trip-planner" element={<TripPlanner />} />
                <Route path="/ai-planner" element={<AITripPlanner />} />

                <Route path="/packing" element={<PackingList />} />
                <Route path="/budget" element={<BudgetCalculator />} />
                <Route path="/weather" element={<WeatherWidget />} />

                <Route path="/currency" element={<CurrencyConverter />} />
              </Route>
            </Routes>
          </Router>
        </TravelPlannerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
