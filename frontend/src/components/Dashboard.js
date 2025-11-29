import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HamiDashboard from './dashboards/HamiDashboard';
import RafeeqaDashboard from './dashboards/RafeeqaDashboard';
import RuknDashboard from './dashboards/RuknDashboard';
import UmeedwarDashboard from './dashboards/UmeedwarDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const category = user?.category?.toLowerCase();

  // Conditionally render category-specific Dashboard components
  if (category === 'hami') {
    return <HamiDashboard />;
  }

  if (category === 'rafeeqa') {
    return <RafeeqaDashboard />;
  }

  if (category === 'rukn') {
    return <RuknDashboard />;
  }

  if (category === 'umeedwar rukn' || category === 'umeedwar') {
    return <UmeedwarDashboard />;
  }

  // Default fallback for unknown categories
  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Unknown user category. Please update your profile.</p>
    </div>
  );
};

export default Dashboard; 