import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Toast from '../Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useReport } from '../../contexts/ReportContext';

const HamiDailyReport = () => {
  const { user } = useAuth();
  const { updateSelectedMonthYear } = useReport();
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();
  const currentDay = currentDate.getDate();
  
  // Get previous month (same year, or previous year if current month is January)
  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonth = prevDate.toLocaleString('en-US', { month: 'long' });
  const prevYear = prevDate.getFullYear().toString();
  
  // Determine available months (previous first if day <= 7, then current)
  const availableMonths = currentDay <= 7 
    ? [
        { 
          month: prevMonth, 
          year: prevYear, 
          label: `${prevMonth} ${prevYear}`,
          tagline: '(Available for first 7 days)'
        },
        { 
          month: currentMonth, 
          year: currentYear, 
          label: `${currentMonth} ${currentYear}`,
          tagline: null
        }
      ]
    : [
        { 
          month: currentMonth, 
          year: currentYear, 
          label: `${currentMonth} ${currentYear}`,
          tagline: null
        }
      ];
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Update context when component mounts or month/year changes
  useEffect(() => {
    updateSelectedMonthYear(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Fetch day data when month, year, or date changes
  useEffect(() => {
    fetchDayData();
  }, [selectedMonth, selectedYear, selectedDate]);

  const createDefaultDaysArray = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = monthNames.indexOf(selectedMonth);
    const daysInMonth = new Date(parseInt(selectedYear), monthIndex + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month: selectedMonth,
        year: selectedYear,
        namaz: 'no',
        hifz: 'no',
        nazra: 'no',
        tafseer: 'no',
        hadees: 'no',
        literature: 'no',
        ghrKaKaam: 'no',
        karkunaanMulakaat: 0,
        ajKisiKoKoiAchiBaatBtai: 'no',
        quranCircle: 'no',
        ajApnaMuhasibaKiya: 'no',
        taqseemDawatiMasnuaat: 0
      });
    }
    return days;
  };

  const fetchDayData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`/hami-reports/day/${selectedMonth}/${selectedYear}/${selectedDate}`);
      
      // Check if we need to recreate the report structure (month/year changed or doesn't exist)
      const needsNewReport = !currentReport || 
                            currentReport.month !== selectedMonth || 
                            currentReport.year !== selectedYear;
      
      if (response.data && response.data.success && response.data.day) {
        // Day data found - use it
        const day = response.data.day;
        
        if (needsNewReport) {
          // Create new report structure with all days for the month
          const days = createDefaultDaysArray();
          // Replace the selected day with the fetched day data
          const dayIndex = days.findIndex(d => d.date === selectedDate);
          if (dayIndex !== -1) {
            days[dayIndex] = { ...days[dayIndex], ...day };
          } else {
            days.push(day);
          }
          
          setCurrentReport({
            month: selectedMonth,
            year: selectedYear,
            days: days
          });
        } else {
          // Update existing report with the fetched day data
          const updatedDays = currentReport.days.map(d => {
            if (d.date === selectedDate) {
              return { ...d, ...day };
            }
            return d;
          });
          
          // If day doesn't exist in the array, add it
          const dayExists = updatedDays.some(d => d.date === selectedDate);
          if (!dayExists) {
            updatedDays.push(day);
          }
          
          setCurrentReport({ ...currentReport, days: updatedDays });
        }
      } else {
        // No day data found, create default structure
        if (needsNewReport) {
          const days = createDefaultDaysArray();
          setCurrentReport({
            month: selectedMonth,
            year: selectedYear,
            days: days
          });
        }
      }
    } catch (error) {
      console.error('Error fetching day data:', error);
      // Create default structure on error
      if (!currentReport || currentReport.month !== selectedMonth || currentReport.year !== selectedYear) {
        const days = createDefaultDaysArray();
        setCurrentReport({
          month: selectedMonth,
          year: selectedYear,
          days: days
        });
      }
      showToast('Error loading day data. Showing default form.', 'error');
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

    const yesNoFields = ['hifz', 'nazra', 'tafseer', 'hadees', 'literature', 'ghrKaKaam', 'ajKisiKoKoiAchiBaatBtai', 'quranCircle', 'ajApnaMuhasibaKiya'];
    yesNoFields.forEach(field => {
      if (dayData[field] && !['yes', 'no'].includes(dayData[field])) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be either "yes" or "no"`);
      }
    });

    const numericFields = ['karkunaanMulakaat', 'taqseemDawatiMasnuaat'];
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

      const dayData = {
        date: selectedDate,
        month: selectedMonth,
        year: selectedYear,
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
        setSaving(false);
        return;
      }

      const response = await axios.post(`/hami-reports/${selectedMonth}/${selectedYear}/${selectedDate}`, dayData);

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
    return `${selectedMonth} ${selectedYear}`;
  };
  
  const handleMonthChange = (monthOption) => {
    setSelectedMonth(monthOption.month);
    setSelectedYear(monthOption.year);
    updateSelectedMonthYear(monthOption.month, monthOption.year);
    setIsMonthDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-2 sm:space-x-3">
              <span>Daily Report</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-300">
                Hami
              </span>
            </h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Month:</span>
              <div className="relative w-full sm:w-auto" ref={monthDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="w-full sm:w-auto min-w-[200px] flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-left"
                >
                  <span>
                    {availableMonths.find(m => m.month === selectedMonth && m.year === selectedYear)?.label || `${selectedMonth} ${selectedYear}`}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isMonthDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full sm:w-auto min-w-[200px] bg-white border border-gray-300 rounded-md shadow-lg">
                    {availableMonths.map((monthOption) => (
                      <button
                        key={`${monthOption.month}-${monthOption.year}`}
                        type="button"
                        onClick={() => handleMonthChange(monthOption)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                          monthOption.month === selectedMonth && monthOption.year === selectedYear
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-900'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{monthOption.label}</div>
                          {monthOption.tagline && (
                            <div className="text-xs text-gray-500 mt-0.5">{monthOption.tagline}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Date:</span>
            </div>
            <select
              value={selectedDate}
              onChange={(e) => {
                const newDate = parseInt(e.target.value);
                if (newDate >= 1 && newDate <= 31) {
                  setSelectedDate(newDate);
                }
              }}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

            {/* Religious Activities - Hami Specific */}
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

              {/* Aj Kisi Ko Koi Achi Baat Btai? - Hami Specific */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Aj Kisi Ko Koi Achi Baat Btai?</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('ajKisiKoKoiAchiBaatBtai', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ajKisiKoKoiAchiBaatBtai || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('ajKisiKoKoiAchiBaatBtai', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ajKisiKoKoiAchiBaatBtai || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Quran Circle - Hami Specific */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Quran Circle</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('quranCircle', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.quranCircle || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('quranCircle', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.quranCircle || 'no') === 'no'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>No</span>
                  </button>
                </div>
              </div>

              {/* Aj Apna Muhasiba Kiya? - Hami Specific */}
              <div className="border-b border-gray-200 pb-4">
                <label className="text-lg font-medium text-gray-900 mb-3 block">Aj Apna Muhasiba Kiya?</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFieldChange('ajApnaMuhasibaKiya', 'yes')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ajApnaMuhasibaKiya || 'no') === 'yes'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFieldChange('ajApnaMuhasibaKiya', 'no')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                      (selectedDayData.ajApnaMuhasibaKiya || 'no') === 'no'
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

            {/* Numeric Fields - Hami Specific */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Taqseem Dawati Masnuaat</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={selectedDayData.taqseemDawatiMasnuaat || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    handleFieldChange('taqseemDawatiMasnuaat', validValue);
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const validValue = Math.max(0, value);
                    if (value !== validValue) {
                      handleFieldChange('taqseemDawatiMasnuaat', validValue);
                    }
                  }}
                  placeholder="Number of items distributed"
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
              className="bg-special-blue text-white px-6 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-special-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default HamiDailyReport;

