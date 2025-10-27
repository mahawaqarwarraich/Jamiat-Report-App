import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import DailyReport from './components/DailyReport';
import MonthlyReport from './components/MonthlyReport';
import QASection from './components/QASection';
import PDFDownload from './components/PDFDownload';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While auth is loading, you can return a spinner or null
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/daily" element={
                <ProtectedRoute>
                  <DailyReport />
                </ProtectedRoute>
              } />
              <Route path="/monthly" element={
                <ProtectedRoute>
                  <MonthlyReport />
                </ProtectedRoute>
              } />
              <Route path="/qa" element={
                <ProtectedRoute>
                  <QASection />
                </ProtectedRoute>
              } />
              <Route path="/download" element={
                <ProtectedRoute>
                  <PDFDownload />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
