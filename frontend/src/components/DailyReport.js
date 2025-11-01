import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Toast from './Toast';
import { useAuth } from '../contexts/AuthContext';

const DailyReport = () => {
  const { user } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const getCategoryBadgeClasses = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'hami':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rafeeqa':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'umeedwar rukn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rukn':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get fields configuration based on user category
  const getFieldsForCategory = (category) => {
    const baseFields = {
      yesNoFields: [
        { field: 'hifz', label: 'Hifz' },
        { field: 'nazra', label: 'Nazra' },
        { field: 'tafseer', label: 'Tafseer' },
        { field: 'hadees', label: 'Hadees' },
        { field: 'literature', label: 'Literature' },
        { field: 'ghrKaKaam', label: 'Ghar ka Kaam' }
      ],
      numericFields: [
        { field: 'karkunaanMulakaat', label: 'Karkunaan Mulakaat', placeholder: 'Number of meetings' }
      ]
    };

    switch ((category || '').toLowerCase()) {
      case 'hami':
        return {
          yesNoFields: [
            ...baseFields.yesNoFields,
            { field: 'ajKisiKoKoiAchiBaatBtai', label: 'Aj Kisi Ko Koi Achi Baat Btai?' },
            { field: 'quranCircle', label: 'Quran Circle' },
            { field: 'ajApnaMuhasibaKiya', label: 'Aj Apna Muhasiba Kiya?' }
          ],
          numericFields: [
            { field: 'taqseemDawatiMasnuaat', label: 'Taqseem Dawati Masnuaat', placeholder: 'Number of items distributed' }
          ]
        };
      case 'rafeeqa':
        return {
          yesNoFields: [
            ...baseFields.yesNoFields,
            { field: 'darsiKutab', label: 'Darsi Kutab' }
          ],
          numericFields: [
            ...baseFields.numericFields,
            { field: 'amoomiAfraadMulakaat', label: 'Amoomi Afraad Mulakaat', placeholder: 'Number of general meetings' },
            { field: 'khatootTadaad', label: 'Khatoot Tadaad', placeholder: 'Number of letters' }
          ]
        };
      case 'umeedwar rukn':
        // For now, same as rafeeqa - will be updated when you provide the fields
        return {
          yesNoFields: [
            ...baseFields.yesNoFields,
            { field: 'darsiKutab', label: 'Darsi Kutab' }
          ],
          numericFields: [
            ...baseFields.numericFields,
            { field: 'amoomiAfraadMulakaat', label: 'Amoomi Afraad Mulakaat', placeholder: 'Number of general meetings' },
            { field: 'khatootTadaad', label: 'Khatoot Tadaad', placeholder: 'Number of letters' }
          ]
        };
      case 'rukn':
        // For now, same as rafeeqa - will be updated when you provide the fields
        return {
          yesNoFields: [
            ...baseFields.yesNoFields,
            { field: 'darsiKutab', label: 'Darsi Kutab' }
          ],
          numericFields: [
            ...baseFields.numericFields,
            { field: 'amoomiAfraadMulakaat', label: 'Amoomi Afraad Mulakaat', placeholder: 'Number of general meetings' },
            { field: 'khatootTadaad', label: 'Khatoot Tadaad', placeholder: 'Number of letters' }
          ]
        };
      default:
        // Default to rafeeqa fields
        return {
          yesNoFields: [
            ...baseFields.yesNoFields,
            { field: 'darsiKutab', label: 'Darsi Kutab' }
          ],
          numericFields: [
            ...baseFields.numericFields,
            { field: 'amoomiAfraadMulakaat', label: 'Amoomi Afraad Mulakaat', placeholder: 'Number of general meetings' },
            { field: 'khatootTadaad', label: 'Khatoot Tadaad', placeholder: 'Number of letters' }
          ]
        };
    }
  };

  const formatCategory = (category) => {
    if (!category || typeof category !== 'string') return '';
    return category
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper function to hide toast
  const hideToast = () => {
    setToast(null);
  };

  // Validation functions
  const validateDayData = (dayData) => {
    const errors = [];

    // Validate date
    if (!dayData.date || dayData.date < 1 || dayData.date > 31) {
      errors.push('Date must be between 1 and 31');
    }

    // Validate namaz
    if (!dayData.namaz || !['yes', 'no'].includes(dayData.namaz)) {
      errors.push('Namaz must be either "yes" or "no"');
    }

    // Get fields for current user category
    const categoryFields = getFieldsForCategory(user?.category);
    
    // Validate yes/no fields based on category
    categoryFields.yesNoFields.forEach(({ field }) => {
      if (dayData[field] && !['yes', 'no'].includes(dayData[field])) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be either "yes" or "no"`);
      }
    });

    // Validate numeric fields based on category
    categoryFields.numericFields.forEach(({ field }) => {
      if (dayData[field] !== undefined && dayData[field] !== null && dayData[field] !== '') {
        const value = parseInt(dayData[field]);
        if (isNaN(value) || value < 0) {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a positive number`);
        }
      }
    });

    return errors;
  };

  const validateFormData = (formData) => {
    const errors = [];

    // Check if any required fields are missing
    if (!formData.name || !formData.email || !formData.password) {
      errors.push('Please fill in all required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate password length
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  };

  // Helper function to validate individual field
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'date':
        return value >= 1 && value <= 31 ? null : 'Date must be between 1 and 31';
      case 'namaz':
        return ['yes', 'no'].includes(value) ? null : 'Namaz must be either "yes" or "no"';
      case 'hifz':
      case 'nazra':
      case 'tafseer':
      case 'hadees':
      case 'literature':
      case 'darsiKutab':
      case 'ghrKaKaam':
        return ['yes', 'no'].includes(value) ? null : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be either "yes" or "no"`;
      case 'karkunaanMulakaat':
      case 'amoomiAfraadMulakaat':
      case 'khatootTadaad':
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue >= 0 ? null : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a positive number`;
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reports/current');
      setCurrentReport(response.data);
      setSelectedDate(new Date().getDate());
    } catch (error) {
      console.error('Error fetching current report:', error);
      // Set a default state even if there's an error
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

    console.log(`Updating field ${field} to value ${value} for date ${selectedDate}`);

    const updatedDays = currentReport.days.map(day => {
      if (day.date === selectedDate) {
        return { ...day, [field]: value };
      }
      return day;
    });

    setCurrentReport({ ...currentReport, days: updatedDays });
  };

  // Save function for Hami category
  const saveHamiDay = async (selectedDayData, currentMonth, currentYear) => {
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
      ajKisiKoKoiAchiBaatBtai: selectedDayData.ajKisiKoKoiAchiBaatBtai || 'no',
      quranCircle: selectedDayData.quranCircle || 'no',
      ajApnaMuhasibaKiya: selectedDayData.ajApnaMuhasibaKiya || 'no',
      taqseemDawatiMasnuaat: selectedDayData.taqseemDawatiMasnuaat || 0
    };

    const validationErrors = validateDayData(dayData);
    if (validationErrors.length > 0) {
      showToast(`Validation errors: ${validationErrors.join(', ')}`, 'error');
      return false;
    }

    console.log('Saving Hami daily report data:', dayData);
    const response = await axios.post('/reports/add-day', dayData);
    return response.data;
  };

  // Save function for Rafeeqa category
  const saveRafeeqaDay = async (selectedDayData, currentMonth, currentYear) => {
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
      return false;
    }

    console.log('Saving Rafeeqa daily report data:', dayData);
    const response = await axios.post('/reports/add-day', dayData);
    return response.data;
  };

  // Save function for Umeedwar Rukn category
  const saveUmeedwarRuknDay = async (selectedDayData, currentMonth, currentYear) => {
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
      return false;
    }

    console.log('Saving Umeedwar Rukn daily report data:', dayData);
    const response = await axios.post('/reports/add-day', dayData);
    return response.data;
  };

  // Save function for Rukn category
  const saveRuknDay = async (selectedDayData, currentMonth, currentYear) => {
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
      return false;
    }

    console.log('Saving Rukn daily report data:', dayData);
    const response = await axios.post('/reports/add-day', dayData);
    return response.data;
  };

  // Main save handler that calls the appropriate category-specific function
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

      // Get current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear().toString();

      // Get user category
      const userCategory = (user?.category || '').toLowerCase();
      let result;

      // Call the appropriate category-specific save function
      switch (userCategory) {
        case 'hami':
          result = await saveHamiDay(selectedDayData, currentMonth, currentYear);
          break;
        case 'rafeeqa':
          result = await saveRafeeqaDay(selectedDayData, currentMonth, currentYear);
          break;
        case 'umeedwar rukn':
          result = await saveUmeedwarRuknDay(selectedDayData, currentMonth, currentYear);
          break;
        case 'rukn':
          result = await saveRuknDay(selectedDayData, currentMonth, currentYear);
          break;
        default:
          // Default to hami if category is unknown
          console.warn(`Unknown category: ${userCategory}, defaulting to hami`);
          result = await saveHamiDay(selectedDayData, currentMonth, currentYear);
          break;
      }

      if (result === false) {
        // Validation errors already shown in the category-specific function
        setSaving(false);
        return;
      }

      if (result && result.success) {
        // Update the local state with the response data
        setCurrentReport(result.report);
        
        showToast(result.message);
        console.log('Daily report saved successfully:', result);
        
        // Clear message after 3 seconds
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

  // Handle case when no report data is available
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
              {user?.category && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getCategoryBadgeClasses(user.category)}`}
                  title="User Category"
                >
                  {formatCategory(user.category)}
                </span>
              )}
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
                // Validate date is within range
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
                    (selectedDayData.namaz || (user?.category?.toLowerCase() === 'hami' ? 'no' : 'no')) === 'yes'
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
                    (selectedDayData.namaz || (user?.category?.toLowerCase() === 'hami' ? 'no' : 'no')) === 'no'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span>Missed</span>
                </button>
              </div>
            </div>

            {/* Religious Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFieldsForCategory(user?.category).yesNoFields.map(({ field, label }) => {
                // For hami category, default to 'no' if field is undefined
                const defaultValue = (user?.category?.toLowerCase() === 'hami' && selectedDayData[field] === undefined) ? 'no' : selectedDayData[field];
                
                return (
                  <div key={field} className="border-b border-gray-200 pb-4">
                    <label className="text-lg font-medium text-gray-900 mb-3 block">{label}</label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleFieldChange(field, 'yes')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                          defaultValue === 'yes'
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" />
                        <span>Yes</span>
                      </button>
                      <button
                        onClick={() => handleFieldChange(field, 'no')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                          defaultValue === 'no'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <XMarkIcon className="h-5 w-5" />
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Numeric Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getFieldsForCategory(user?.category).numericFields.map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={selectedDayData[field] || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      // Ensure value is not negative
                      const validValue = Math.max(0, value);
                      handleFieldChange(field, validValue);
                    }}
                    onBlur={(e) => {
                      // Ensure value is not negative on blur
                      const value = parseInt(e.target.value) || 0;
                      const validValue = Math.max(0, value);
                      if (value !== validValue) {
                        handleFieldChange(field, validValue);
                      }
                    }}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}
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

export default DailyReport; 