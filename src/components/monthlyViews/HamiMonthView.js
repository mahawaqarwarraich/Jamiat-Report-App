import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useReport } from '../../contexts/ReportContext';

const HamiMonthView = () => {
  const { selectedMonth, selectedYear } = useReport();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDays();
  }, [selectedMonth, selectedYear]);

  const fetchDays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/hami-reports/${selectedMonth}/${selectedYear}/days`);
      if (response.data && response.data.success) {
        setDays(response.data.days || []);
        setError('');
      } else {
        setDays([]);
        setError('No data found for this month');
      }
    } catch (error) {
      console.error('Error fetching Hami days:', error);
      setError('Failed to load monthly report. Please try again.');
      setDays([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDays();
  };

  const getStatusIcon = (value) => {
    return value === 'yes' ? (
      <CheckIcon className="h-4 w-4 text-green-600" />
    ) : (
      <XMarkIcon className="h-4 w-4 text-red-600" />
    );
  };

  const getCompletionRate = (day) => {
    const activities = [
      day.namaz === 'yes',
      day.hifz === 'yes',
      day.nazra === 'yes',
      day.tafseer === 'yes',
      day.hadees === 'yes',
      day.literature === 'yes',
      day.ghrKaKaam === 'yes',
      day.achiBaatBtai === 'yes',
      day.quranCircle === 'yes',
      day.apnaMuhasibaKiya === 'yes'
    ];
    
    const completed = activities.filter(Boolean).length;
    return activities.length > 0 ? Math.round((completed / activities.length) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
              Monthly Report - {selectedMonth} {selectedYear}
            </h1>
            <p className="text-gray-600">
              Overview of your daily activities and spiritual progress
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-special-blue text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-special-blue focus:ring-offset-2 disabled:opacity-50"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Namaz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hifz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tafseer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hadees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Literature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghar ka Kaam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achi Baat Btai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quran Circle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apna Muhasiba</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karkunaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taqseem Dawati</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {days.length === 0 ? (
                <tr>
                  <td colSpan="14" className="px-6 py-4 text-center text-gray-500">
                    No data available for this month
                  </td>
                </tr>
              ) : (
                days.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusIcon(day.namaz)}
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
                      {getStatusIcon(day.ghrKaKaam)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusIcon(day.achiBaatBtai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusIcon(day.quranCircle)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusIcon(day.apnaMuhasibaKiya)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.karkunaanMulakaat || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.taqseemDawatiMasnuaat || 0}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Namaz Completion</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-green-600">
              {days.filter(day => day.namaz === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hifz Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-blue-600">
              {days.filter(day => day.hifz === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nazra Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-purple-600">
              {days.filter(day => day.nazra === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {days.length} days
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tafseer Days</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-orange-600">
              {days.filter(day => day.tafseer === 'yes').length}
            </div>
            <div className="ml-4 text-sm text-gray-600">
              out of {days.length} days
            </div>
          </div>
        </div>
      </div>

      {/* Total Activities */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Karkunaan Mulakaat</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.reduce((sum, day) => sum + (day.karkunaanMulakaat || 0), 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Taqseem Dawati Masnuaat</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.reduce((sum, day) => sum + (day.taqseemDawatiMasnuaat || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamiMonthView;

