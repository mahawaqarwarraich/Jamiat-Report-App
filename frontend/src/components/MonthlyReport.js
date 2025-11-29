import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HamiMonthView from './monthlyViews/HamiMonthView';
import RafeeqaMonthView from './monthlyViews/RafeeqaMonthView';
import RuknMonthView from './monthlyViews/RuknMonthView';
import UmeedwarMonthView from './monthlyViews/UmeedwarMonthView';

const MonthlyReport = () => {
  const { user } = useAuth();
  const category = user?.category?.toLowerCase();

  // Conditionally render category-specific MonthView components
  if (category === 'hami') {
    return <HamiMonthView />;
  }

  if (category === 'rafeeqa') {
    return <RafeeqaMonthView />;
  }

  if (category === 'rukn') {
    return <RuknMonthView />;
  }

  if (category === 'umeedwar rukn' || category === 'umeedwar') {
    return <UmeedwarMonthView />;
  }

  // Default fallback for unknown categories
  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Unknown user category. Please update your profile.</p>
    </div>
  );
};

export default MonthlyReport; 