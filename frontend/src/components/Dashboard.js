import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      const response = await axios.get('/reports/current');
      setCurrentReport(response.data);
      
      // Calculate stats
      const totalDays = response.data.days.length;
      const completedDays = response.data.days.filter(day => 
        day.namaz === 'yes' && 
        (day.hifz === 'yes' || day.nazra === 'yes' || day.tafseer === 'yes' || day.hadees === 'yes')
      ).length;
      
      setStats({
        totalDays,
        completedDays,
        completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching current report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    fetchCurrentReport();
  };

  const getTodayProgress = () => {
    if (!currentReport) return null;
    
    const today = new Date().getDate();
    const todayData = currentReport.days.find(day => day.date === today);
    
    if (!todayData) return null;
    
    return {
      namaz: todayData.namaz === 'yes',
      hifz: todayData.hifz === 'yes',
      nazra: todayData.nazra === 'yes',
      tafseer: todayData.tafseer === 'yes',
      hadees: todayData.hadees === 'yes'
    };
  };

  const todayProgress = getTodayProgress();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 
        </h1>
        <p className="text-gray-600">
          Track your daily Islamic duties and spiritual progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      {todayProgress && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`p-3 rounded-lg ${todayProgress.namaz ? 'bg-green-100' : 'bg-red-100'}`}>
                {todayProgress.namaz ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600 mx-auto" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Namaz</p>
            </div>
            
            <div className="text-center">
              <div className={`p-3 rounded-lg ${todayProgress.hifz ? 'bg-green-100' : 'bg-red-100'}`}>
                {todayProgress.hifz ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600 mx-auto" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Hifz</p>
            </div>
            
            <div className="text-center">
              <div className={`p-3 rounded-lg ${todayProgress.nazra ? 'bg-green-100' : 'bg-red-100'}`}>
                {todayProgress.nazra ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600 mx-auto" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Nazra</p>
            </div>
            
            <div className="text-center">
              <div className={`p-3 rounded-lg ${todayProgress.tafseer ? 'bg-green-100' : 'bg-red-100'}`}>
                {todayProgress.tafseer ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600 mx-auto" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Tafseer</p>
            </div>
            
            <div className="text-center">
              <div className={`p-3 rounded-lg ${todayProgress.hadees ? 'bg-green-100' : 'bg-red-100'}`}>
                {todayProgress.hadees ? (
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
                ) : (
                  <XCircleIcon className="h-8 w-8 text-red-600 mx-auto" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Hadees</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/daily"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Report</h3>
              <p className="text-sm text-gray-600">Update today's activities</p>
            </div>
          </div>
        </Link>

        <Link
          to="/monthly"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly View</h3>
              <p className="text-sm text-gray-600">View monthly progress</p>
            </div>
          </div>
        </Link>

        <Link
          to="/qa"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Q&A Section</h3>
              <p className="text-sm text-gray-600">Answer monthly questions</p>
            </div>
          </div>
        </Link>

        <Link
          to="/download"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ArrowDownTrayIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Download PDF</h3>
              <p className="text-sm text-gray-600">Generate monthly report</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 