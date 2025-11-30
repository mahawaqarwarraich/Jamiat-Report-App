import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useReport } from '../../contexts/ReportContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const HamiTemplate = () => {
  const { selectedMonth, selectedYear } = useReport();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hide navbar and adjust layout
  useEffect(() => {
    // Hide navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }
    // Remove container padding and margin
    const container = document.querySelector('.container');
    if (container) {
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.maxWidth = '100%';
    }
    // Adjust body padding
    document.body.style.padding = '0';
    document.body.style.margin = '0';

    return () => {
      // Restore on unmount
      if (navbar) {
        navbar.style.display = '';
      }
      if (container) {
        container.style.padding = '';
        container.style.margin = '';
        container.style.maxWidth = '';
      }
      document.body.style.padding = '';
      document.body.style.margin = '';
    };
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/hami-reports/${selectedMonth}/${selectedYear}`);
      if (response.data && response.data.success && response.data.report) {
        setReport(response.data.report);
      }
    } catch (error) {
      console.error('Error fetching Hami report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get days in month
  const getDaysInMonth = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = monthNames.indexOf(selectedMonth);
    return new Date(parseInt(selectedYear), monthIndex + 1, 0).getDate();
  };

  // Hami field labels mapping
  const fieldLabels = {
    namaz: 'Namaz',
    hifz: 'Hifz',
    nazra: 'Nazra',
    tafseer: 'Tafseer',
    hadees: 'Hadees',
    literature: 'Literature',
    ghrKaKaam: 'Ghar Ka Kaam',
    achiBaatBtai: 'Achi Baat Btai',
    quranCircle: 'Quran Circle',
    apnaMuhasibaKiya: 'Apna Muhasiba Kiya',
    karkunaanMulakaat: 'Karkunaan Mulakaat',
    taqseemDawatiMasnuaat: 'Taqseem Dawati Masnuaat'
  };

  // Hami fields in order
  const hamiFields = [
    'namaz', 'hifz', 'nazra', 'tafseer', 'hadees', 'literature', 
    'ghrKaKaam', 'achiBaatBtai', 'quranCircle', 'apnaMuhasibaKiya',
    'karkunaanMulakaat', 'taqseemDawatiMasnuaat'
  ];

  // Get day data for a specific day
  const getDayData = (dayNumber) => {
    if (!report || !report.days) return null;
    return report.days.find(d => d.date === dayNumber);
  };

  // Get field value for a day
  const getFieldValue = (dayNumber, fieldName) => {
    const day = getDayData(dayNumber);
    if (!day) return null;
    return day[fieldName];
  };

  // Render cell content
  const renderCell = (dayNumber, fieldName) => {
    const day = getDayData(dayNumber);
    
    // Check if isMark is false - if so, return empty cell
    if (!day || day.isMark === false) {
      return '';
    }
    
    const value = getFieldValue(dayNumber, fieldName);
    if (value === null || value === undefined) return '';
    
    // For numeric fields
    if (fieldName === 'karkunaanMulakaat' || fieldName === 'taqseemDawatiMasnuaat') {
      return value || '0';
    }
    
    // For yes/no fields
    if (value === 'yes') {
      return <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />;
    } else if (value === 'no') {
      return <XMarkIcon className="h-5 w-5 text-red-600 mx-auto" />;
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white print:bg-white" style={{ margin: 0, padding: '40px 20px' }}>
      {/* Header with three words */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-800 pb-4">
        <div className="text-lg font-semibold text-gray-800" style={{ direction: 'rtl' }}>نحن أنصار الله</div>
        <div className="text-2xl font-bold text-gray-900" style={{ direction: 'rtl' }}>بسم الله الرحمن الرحيم</div>
        <div className="text-lg font-semibold text-gray-800" style={{ direction: 'rtl' }}>كونوا أنصار الله</div>
      </div>

      {/* Organization Name and Logo */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center mb-4">
          <img 
            src="/logo.png" 
            alt="Islami Jamiat Talibat Pakistan Logo" 
            className="h-20 w-auto object-contain"
            onError={(e) => {
              // Hide image if logo file doesn't exist
              e.target.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Islami Jamiat Talibat Pakistan
        </h1>
        <div className="text-lg text-gray-700 font-medium">Monthly Report</div>
      </div>

      {/* User Information */}
      <div className="mb-10 border-2 border-gray-400 p-6 rounded-lg bg-gray-50">
        <div className="grid grid-cols-2 gap-6">
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Name: </span>
            <span className="text-gray-900 text-lg">{user?.name || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Role: </span>
            <span className="text-gray-900 text-lg capitalize">{user?.category || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Institution: </span>
            <span className="text-gray-900 text-lg">{user?.educationalInstitution || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Month of Report: </span>
            <span className="text-gray-900 text-lg">{selectedMonth} {selectedYear}</span>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Address: </span>
            <span className="text-gray-900 text-lg">{user?.address || 'N/A'}</span>
          </div>
          <div className="border-b border-gray-300 pb-2">
            <span className="font-bold text-gray-800 text-lg">Phone Number: </span>
            <span className="text-gray-900 text-lg">{user?.phoneNumber || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-10 overflow-x-auto">
        <table className="min-w-full border-2 border-gray-800" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr className="bg-gray-300">
              <th className="border-2 border-gray-800 px-4 py-3 text-left font-bold text-gray-900 bg-gray-400" style={{ minWidth: '150px' }}>
                Date
              </th>
              {daysArray.map((day) => (
                <th
                  key={day}
                  className="border-2 border-gray-800 px-2 py-2 text-center font-bold text-gray-900 bg-gray-400"
                  style={{ minWidth: '45px', width: '45px' }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Field rows */}
            {hamiFields.map((field, index) => (
              <tr key={field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border-2 border-gray-800 px-4 py-2 font-semibold text-gray-900 bg-gray-200 text-left" style={{ whiteSpace: 'nowrap' }}>
                  {fieldLabels[field]}
                </td>
                {daysArray.map((day) => (
                  <td
                    key={`${field}-${day}`}
                    className="border-2 border-gray-800 px-2 py-2 text-center"
                  >
                    {renderCell(day, field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Q/A Section */}
      {report && report.qa && (
        <div className="mt-12 border-2 border-gray-800 p-8 rounded-lg bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b-2 border-gray-800 pb-4">
            Questions & Answers
          </h2>
          <div className="space-y-8">
            {Object.entries(report.qa).map(([question, answer], index) => (
              <div key={index} className="border-b-2 border-gray-400 pb-6 last:border-b-0">
                <div className="font-bold text-lg text-gray-900 mb-3">
                  Q{index + 1}: {question}
                </div>
                <div className="text-gray-800 pl-6 text-base leading-relaxed" style={{ minHeight: '40px' }}>
                  {answer ? (
                    <div className="whitespace-pre-wrap">{answer}</div>
                  ) : (
                    <span className="text-gray-400 italic">No answer provided</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          nav {
            display: none !important;
          }
          .container {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HamiTemplate;
