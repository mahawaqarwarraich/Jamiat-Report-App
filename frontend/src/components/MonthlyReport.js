import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const MonthlyReport = () => {
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reports/current');
      setCurrentReport(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching current report:', error);
      setError('Failed to load monthly report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the data
  const refreshData = () => {
    fetchCurrentReport();
  };

  const getStatusIcon = (value, type = 'yesno') => {
    if (type === 'tickcross') {
      return value === 'tick' ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <XMarkIcon className="h-4 w-4 text-red-600" />
      );
    } else {
      return value === 'yes' ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <XMarkIcon className="h-4 w-4 text-red-600" />
      );
    }
  };

  const getCompletionRate = (day) => {
    const activities = [
      day.namaz === 'yes',
      day.hifz === 'yes',
      day.nazra === 'yes',
      day.tafseer === 'yes',
      day.hadees === 'yes',
      day.literature === 'yes',
      day.darsiKutab === 'yes',
      day.ghrKaKaam === 'yes'
    ];
    
    const completed = activities.filter(Boolean).length;
    return Math.round((completed / activities.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No report found for current month.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Monthly Report - {currentReport.month} {currentReport.year}
            </h1>
            <p className="text-gray-600">
              Overview of your daily activities and spiritual progress
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Monthly Calendar View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Namaz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hifz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tafseer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hadees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Literature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Darsi Kutab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghar ka Kaam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Karkunaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amoomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khatoot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReport.days.map((day) => (
                <tr key={day.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.namaz, 'yesno')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.hifz)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.nazra)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.tafseer)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.hadees)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.literature)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.darsiKutab)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusIcon(day.ghrKaKaam)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.karkunaanMulakaat || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.amoomiAfraadMulakaat || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.khatootTadaad || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${getCompletionRate(day)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{getCompletionRate(day)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Namaz Completion</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-green-600">
              {currentReport.days.filter(day => day.namaz === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {currentReport.days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hifz Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-blue-600">
              {currentReport.days.filter(day => day.hifz === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {currentReport.days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nazra Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-purple-600">
              {currentReport.days.filter(day => day.nazra === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {currentReport.days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tafseer Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-orange-600">
              {currentReport.days.filter(day => day.tafseer === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {currentReport.days.length} days
            </div>
          </div>
        </div>
      </div>

      {/* Total Counts */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Karkunaan Mulakaat</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentReport.days.reduce((sum, day) => sum + (day.karkunaanMulakaat || 0), 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Amoomi Afraad Mulakaat</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentReport.days.reduce((sum, day) => sum + (day.amoomiAfraadMulakaat || 0), 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Khatoot</p>
            <p className="text-2xl font-bold text-gray-900">
              {currentReport.days.reduce((sum, day) => sum + (day.khatootTadaad || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport; 