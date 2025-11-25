import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Toast from '../Toast';
import { useAuth } from '../../contexts/AuthContext';

const RuknDailyReport = () => {
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/rukn-reports/current');
      setCurrentReport(response.data);
      setSelectedDate(new Date().getDate());
    } catch (error) {
      console.error('Error fetching current report:', error);
      setCurrentReport(null);
      showToast('Error loading report. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDayData = () => {
    if (!currentReport) return null;
    return currentReport.days.find(day => day.date === selectedDate);
  };

  const handleFieldChange = (field, value) => {
    if (!currentReport) return;

    const updatedDays = currentReport.days.map(day => {
      if (day.date === selectedDate) {
        return { ...day, [field]: value };
      }
      return day;
    });

    setCurrentReport({ ...currentReport, days: updatedDays });
  };

  const validateDayData = (dayData) => {
    const errors = [];

    if (!dayData.date || dayData.date < 1 || dayData.date > 31) {
      errors.push('Date must be between 1 and 31');
    }

    if (!dayData.namaz || !['yes', 'no'].includes(dayData.namaz)) {
      errors.push('Namaz must be either "yes" or "no"');
    }

    const yesNoFields = ['hifz', 'nazra', 'tafseer', 'hadees', 'literature', 'ghrKaKaam', 'darsiKutab'];
    yesNoFields.forEach(field => {
      if (dayData[field] && !['yes', 'no'].includes(dayData[field])) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be either "yes" or "no"`);
      }
    });

    const numericFields = ['karkunaanMulakaat', 'amoomiAfraadMulakaat', 'khatootTadaad'];
    numericFields.forEach(field => {
      if (dayData[field] !== undefined && dayData[field] !== null && dayData[field] !== '') {
        const value = parseInt(dayData[field]);
        if (isNaN(value) || value < 0) {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`);
        }
      }
    });

    return errors;
  };

  const handleSave = async () => {
    setSaving(true);
    showToast('');

    try {
      const selectedDayData = getSelectedDayData();
      if (!selectedDayData) {
        showToast('No data to save', 'error');
        setSaving(false);
        return;
      }

      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear().toString();

      const dayData = {
        date: selectedDate,
        month: currentMonth,
        year: currentYear,
        namaz: selectedDayData.namaz || 'no',
        hifz: selectedDayData.hifz || 'no',
        nazra: selectedDayData.nazra || 'no',
        tafseer: selectedDayData.tafseer || 'no',
        hadees: selectedDayData.hadees || 'no',
        literature: selectedDayData.literature || 'no',
        ghrKaKaam: selectedDayData.ghrKaKaam || 'no',
        karkunaanMulakaat: selectedDayData.karkunaanMulakaat || 0,
        darsiKutab: selectedDayData.darsiKutab || 'no',
        amoomiAfraadMulakaat: selectedDayData.amoomiAfraadMulakaat || 0,
        khatootTadaad: selectedDayData.khatootTadaad || 0
      };

      const validationErrors = validateDayData(dayData);
      if (validationErrors.length > 0) {
        showToast(`Validation errors: ${validationErrors.join(', ')}`, 'error');
        setSaving(false);
        return;
      }

      const response = await axios.post('/rukn-reports/add-day', dayData);

      if (response.data && response.data.success) {
        setCurrentReport(response.data.report);
        showToast(response.data.message || 'Daily report saved successfully!');
        setTimeout(() => hideToast(), 3000);
      } else {
        showToast('Failed to save report', 'error');
      }
    } catch (error) {
      console.error('Error saving daily report:', error);
      showToast(error.response?.data?.message || 'Error saving report. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentMonthName = () => {
    if (!currentReport) return '';
    return `${currentReport.month} ${currentReport.year}`;
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Daily Report</h1>
          <p className="text-gray-600 mt-2">Unable to load report data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    );
  }

  const selectedDayData = getSelectedDayData();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <span>Daily Report</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-300">
                Rukn
              </span>
            </h1>
            <p className="text-gray-600 mt-2">{getCurrentMonthName()}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Select Date:</span>
            </div>
            <select
              value={selectedDate}
              onChange={(e) => {
                const newDate = parseInt(e.target.value);
                if (newDate >= 1 && newDate <= 31) {
                  setSelectedDate(newDate);
                }
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {currentReport?.days.map(day => (
                <option key={day.date} value={day.date}>
                  {day.date}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Daily Activities Form */}
      {selectedDayData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Activities for {selectedDate} {getCurrentMonthName()}
          </h2>

          <div className="space-y-6">
            {/* Namaz */}
            <div className="border-b border-gray-200 pb-4">
              <label className="text-lg font-medium text-gray-900 mb-3 block">Namaz</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFieldChange('namaz', 'yes')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                    (selectedDayData.namaz || 'no') === 'yes'
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>Completed</span>
                </button>
                <button
                  onClick={() => handleFieldChange('namaz', 'no')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                    (selectedDayData.namaz || 'no') === 'no'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span>Missed</span>
                </button>
              </div>
            </div>

            {/* Religious Activities - Rukn Specific */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hifz */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Hifz</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('hifz', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.hifz || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('hifz', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.hifz || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Nazra */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Nazra</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('nazra', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.nazra || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('nazra', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.nazra || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Tafseer */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Tafseer</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('tafseer', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.tafseer || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('tafseer', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.tafseer || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Hadees */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Hadees</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('hadees', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.hadees || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('hadees', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.hadees || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Literature */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Literature</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('literature', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.literature || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('literature', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.literature || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Ghar ka Kaam */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Ghar ka Kaam</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('ghrKaKaam', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ghrKaKaam || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('ghrKaKaam', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ghrKaKaam || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Darsi Kutab - Rukn Specific */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Darsi Kutab</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('darsiKutab', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.darsiKutab || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('darsiKutab', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.darsiKutab || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Numeric Fields - Rukn Specific */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Karkunaan Mulakaat</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={selectedDayData.karkunaanMulakaat || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    handleFieldChange('karkunaanMulakaat', validValue);
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    if (value !== validValue) {
                      handleFieldChange('karkunaanMulakaat', validValue);
                    }
                  }}
                  placeholder="Number of meetings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amoomi Afraad Mulakaat</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={selectedDayData.amoomiAfraadMulakaat || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    handleFieldChange('amoomiAfraadMulakaat', validValue);
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    if (value !== validValue) {
                      handleFieldChange('amoomiAfraadMulakaat', validValue);
                    }
                  }}
                  placeholder="Number of general meetings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khatoot Tadaad</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={selectedDayData.khatootTadaad || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    handleFieldChange('khatootTadaad', validValue);
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    if (value !== validValue) {
                      handleFieldChange('khatootTadaad', validValue);
                    }
                  }}
                  placeholder="Number of letters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Daily Report'}
            </button>
          </div>
        </div>
      )}
      
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default RuknDailyReport;

