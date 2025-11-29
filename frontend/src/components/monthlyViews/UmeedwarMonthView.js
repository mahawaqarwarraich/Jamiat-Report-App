import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useReport } from '../../contexts/ReportContext';

const UmeedwarMonthView = () => {
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
      const response = await axios.get(`/umeedwar-reports/${selectedMonth}/${selectedYear}/days`);
      if (response.data && response.data.success) {
        setDays(response.data.days || []);
        setError('');
      } else {
        setDays([]);
        setError('No data found for this month');
      }
    } catch (error) {
      console.error('Error fetching Umeedwar days:', error);
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
    // Count all yes/no fields for Umeedwar
    const umeedwarFields = [
      'namazBarwaqtAdaigi', 'qazaHui', 'nawafalKoshish', 'kashuKoshish',
      'nazraQuran', 'hifzQuran', 'mutaleyaTafseer', 'asoolQuran',
      'amalDaramadQuran', 'mutaleyaHadees', 'asoolHadees', 'amalDaramadHadees',
      'lafziTarjumaKoshish', 'tajweedKoshish', 'mutaleyaLiterature',
      'baadAzRukniyat', 'amalDaramadLiterature', 'karkunaanDiscussionLiterature',
      'khoobiBuraiKoshish', 'ghrIkhlaaqMaamlaat', 'ghrDawat',
      'khidmatDiscussionHadia', 'taleemBehter', 'takseemLiterature',
      'mutaiyanAfraadSargarmi', 'quranClassDiscussion', 'zerTarbiyatKoshish',
      'khatootMulakaatDisTabsara', 'mulakaatKarkunaan', 'mulakaatAmoomiAfraad',
      'khatootArsaal', 'mausoolKhatoot', 'zaatiMuhasiba'
    ];
    
    const activities = umeedwarFields.map(field => day[field] === 'yes');
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

  // Select key fields to display in table (most important ones)
  const keyFields = [
    { key: 'namazBarwaqtAdaigi', label: 'Namaz' },
    { key: 'qazaHui', label: 'Qaza' },
    { key: 'nawafalKoshish', label: 'Nawafal' },
    { key: 'kashuKoshish', label: 'Kashu' },
    { key: 'nazraQuran', label: 'Nazra' },
    { key: 'hifzQuran', label: 'Hifz' },
    { key: 'mutaleyaTafseer', label: 'Tafseer' },
    { key: 'mutaleyaHadees', label: 'Hadees' },
    { key: 'mutaleyaLiterature', label: 'Literature' },
    { key: 'zaatiMuhasiba', label: 'Muhasiba' }
  ];

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                {keyFields.map(field => (
                  <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {days.length === 0 ? (
                <tr>
                  <td colSpan={keyFields.length + 2} className="px-6 py-4 text-center text-gray-500">
                    No data available for this month
                  </td>
                </tr>
              ) : (
                days.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    {keyFields.map(field => (
                      <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getStatusIcon(day[field.key])}
                      </td>
                    ))}
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
              {days.filter(day => day.namazBarwaqtAdaigi === 'yes').length}
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
              {days.filter(day => day.hifzQuran === 'yes').length}
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
              {days.filter(day => day.nazraQuran === 'yes').length}
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
              {days.filter(day => day.mutaleyaTafseer === 'yes').length}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Yes Responses</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.reduce((sum, day) => {
                const umeedwarFields = [
                  'namazBarwaqtAdaigi', 'qazaHui', 'nawafalKoshish', 'kashuKoshish',
                  'nazraQuran', 'hifzQuran', 'mutaleyaTafseer', 'asoolQuran',
                  'amalDaramadQuran', 'mutaleyaHadees', 'asoolHadees', 'amalDaramadHadees',
                  'lafziTarjumaKoshish', 'tajweedKoshish', 'mutaleyaLiterature',
                  'baadAzRukniyat', 'amalDaramadLiterature', 'karkunaanDiscussionLiterature',
                  'khoobiBuraiKoshish', 'ghrIkhlaaqMaamlaat', 'ghrDawat',
                  'khidmatDiscussionHadia', 'taleemBehter', 'takseemLiterature',
                  'mutaiyanAfraadSargarmi', 'quranClassDiscussion', 'zerTarbiyatKoshish',
                  'khatootMulakaatDisTabsara', 'mulakaatKarkunaan', 'mulakaatAmoomiAfraad',
                  'khatootArsaal', 'mausoolKhatoot', 'zaatiMuhasiba'
                ];
                return sum + umeedwarFields.filter(field => day[field] === 'yes').length;
              }, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Days with Activity</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.filter(day => {
                const umeedwarFields = [
                  'namazBarwaqtAdaigi', 'qazaHui', 'nawafalKoshish', 'kashuKoshish',
                  'nazraQuran', 'hifzQuran', 'mutaleyaTafseer', 'asoolQuran',
                  'amalDaramadQuran', 'mutaleyaHadees', 'asoolHadees', 'amalDaramadHadees',
                  'lafziTarjumaKoshish', 'tajweedKoshish', 'mutaleyaLiterature',
                  'baadAzRukniyat', 'amalDaramadLiterature', 'karkunaanDiscussionLiterature',
                  'khoobiBuraiKoshish', 'ghrIkhlaaqMaamlaat', 'ghrDawat',
                  'khidmatDiscussionHadia', 'taleemBehter', 'takseemLiterature',
                  'mutaiyanAfraadSargarmi', 'quranClassDiscussion', 'zerTarbiyatKoshish',
                  'khatootMulakaatDisTabsara', 'mulakaatKarkunaan', 'mulakaatAmoomiAfraad',
                  'khatootArsaal', 'mausoolKhatoot', 'zaatiMuhasiba'
                ];
                return umeedwarFields.some(field => day[field] === 'yes');
              }).length}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Average Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {days.length > 0 
                ? Math.round(days.reduce((sum, day) => sum + getCompletionRate(day), 0) / days.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UmeedwarMonthView;

