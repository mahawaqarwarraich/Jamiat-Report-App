import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HamiDailyReport from './dailyReports/HamiDailyReport';
import RafeeqaDailyReport from './dailyReports/RafeeqaDailyReport';
import RuknDailyReport from './dailyReports/RuknDailyReport';
import UmeedwarDailyReport from './dailyReports/UmeedwarDailyReport';

const DailyReport = () => {
  const { user } = useAuth();
  const category = user?.category?.toLowerCase();

  // Route to appropriate category-specific component
  if (category === 'hami') {
    return <HamiDailyReport />;
  } else if (category === 'rafeeqa') {
    return <RafeeqaDailyReport />;
  } else if (category === 'rukn') {
    return <RuknDailyReport />;
  } else if (category === 'umeedwar rukn') {
    return <UmeedwarDailyReport />;
  } else {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Daily Report</h1>
          <p className="text-gray-600 mt-2">Unknown user category. Please update your profile.</p>
        </div>
      </div>
    );
  }
};

export default DailyReport;
