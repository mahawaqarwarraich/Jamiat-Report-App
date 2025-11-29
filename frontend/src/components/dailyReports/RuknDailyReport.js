import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CheckIcon, XMarkIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Toast from '../Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useReport } from '../../contexts/ReportContext';

const RuknDailyReport = () => {
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
  
  // Determine available months (previous first if day <= 30, then current)
  const availableMonths = currentDay <= 30 
    ? [
        { 
          month: prevMonth, 
          year: prevYear, 
          label: `${prevMonth} ${prevYear}`,
          tagline: '(Available for first 30 days)'
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
        year: selectedYear
      });
    }
    return days;
  };

  const fetchDayData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`/rukn-reports/day/${selectedMonth}/${selectedYear}/${selectedDate}`);
      
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

  const getFieldValue = (fieldName) => {
    const selectedDayData = getSelectedDayData();
    if (!selectedDayData) return 'no';
    return selectedDayData[fieldName] || 'no';
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

      // Build dayData object with all Rukn fields
      const dayData = {
        date: selectedDate,
        month: selectedMonth,
        year: selectedYear
      };

      // Add all Rukn fields
      const ruknFields = [
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

      ruknFields.forEach(field => {
        dayData[field] = selectedDayData[field] || 'no';
      });

      const response = await axios.post(`/rukn-reports/${selectedMonth}/${selectedYear}/${selectedDate}`, dayData);

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

  // Field labels mapping
  const fieldLabels = {
    namazBarwaqtAdaigi: 'Namazon ki barwaqt adaigi ki?',
    qazaHui: 'Qaza hui?',
    nawafalKoshish: 'Nawafal parhy?',
    kashuKoshish: 'Kashu khazu ki koshish ki?',
    nazraQuran: 'Nazra Quran',
    hifzQuran: 'Hifz Quran',
    mutaleyaTafseer: 'Mutaleya Tafseer',
    asoolQuran: 'Asool Quran',
    amalDaramadQuran: 'Amal Daramad (Asool Quran)',
    mutaleyaHadees: 'Mutaleya Hadees',
    asoolHadees: 'Asool Hadees',
    amalDaramadHadees: 'Amal Daramad (Asool Hadees)',
    lafziTarjumaKoshish: 'Lafzi Tarjuma ki koshish',
    tajweedKoshish: 'Tajweed seekhany ki Koshish',
    mutaleyaLiterature: 'Mutaleya Literature',
    baadAzRukniyat: 'Baad Az Rukniyat',
    amalDaramadLiterature: 'Amal Daramad (Literature)',
    karkunaanDiscussionLiterature: 'Karkunaan Discussion (Literature)',
    khoobiBuraiKoshish: 'Khoobi apnaany Burai chorny ki Koshish',
    ghrIkhlaaqMaamlaat: 'Ghr main ikhlaaq o maamlaat ki suratehaal',
    ghrDawat: 'Ghr main dawat ki koshish',
    khidmatDiscussionHadia: 'Khidmat/Discussion/Haddia',
    taleemBehter: 'Taleemi kaarkardagi ki behteri ki koshish',
    takseemLiterature: 'Takseem Literature',
    mutaiyanAfraadSargarmi: 'Mutaiyan Afraad (Sargarmi)',
    quranClassDiscussion: 'Quran Class Discussion',
    zerTarbiyatKoshish: 'Zer e Tarbiyat afraad (Koshish)',
    khatootMulakaatDisTabsara: 'Khatoot/Mulakaat/Discussion/Tabsara',
    mulakaatKarkunaan: 'Mulakaat Karkunaan',
    mulakaatAmoomiAfraad: 'Mulakaat Amoomi Afraad',
    khatootArsaal: 'Khatoot Arsaal',
    mausoolKhatoot: 'Mausool Khatoot',
    zaatiMuhasiba: 'Zaati Muhasiba'
  };

  // All Rukn fields
  const ruknFields = [
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

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-2 sm:space-x-3">
              <span>Daily Report</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-300">
                Rukn
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
            {/* Namaz Barwaqt Adaigi */}
            <div className="border-b border-gray-200 pb-4">
              <label className="text-lg font-medium text-gray-900 mb-3 block">
                {fieldLabels[ruknFields[0]] || ruknFields[0]}
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFieldChange(ruknFields[0], 'yes')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                    getFieldValue(ruknFields[0]) === 'yes'
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => handleFieldChange(ruknFields[0], 'no')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                    getFieldValue(ruknFields[0]) === 'no'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span>No</span>
                </button>
              </div>
            </div>

            {/* Rukn Fields - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ruknFields.slice(1).map((fieldName) => (
                <div key={fieldName} className="border-b border-gray-200 pb-4">
                  <label className="text-lg font-medium text-gray-900 mb-3 block">
                    {fieldLabels[fieldName] || fieldName}
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleFieldChange(fieldName, 'yes')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                        getFieldValue(fieldName) === 'yes'
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>Yes</span>
                    </button>
                    <button
                      onClick={() => handleFieldChange(fieldName, 'no')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${
                        getFieldValue(fieldName) === 'no'
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>No</span>
                    </button>
                  </div>
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

export default RuknDailyReport;

