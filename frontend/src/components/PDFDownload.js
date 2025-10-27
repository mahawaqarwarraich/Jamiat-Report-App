import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Toast from './Toast';

const PDFDownload = () => {
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper function to hide toast
  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      const response = await axios.get('/reports/current');
      setCurrentReport(response.data);
    } catch (error) {
      console.error('Error fetching current report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);

    try {
      if (!currentReport) {
        showToast('No report available for download', 'error');
        return;
      }

      const response = await axios.get(`/reports/pdf/${currentReport.month}/${currentReport.year}`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `islamic-report-${currentReport.month}-${currentReport.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('PDF downloaded successfully!');
      setTimeout(() => hideToast(), 3000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showToast('Error downloading PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const getCompletionStats = () => {
    if (!currentReport) return null;

    const totalDays = currentReport.days.length;
    const namazDays = currentReport.days.filter(day => day.namaz === 'yes').length;
    const hifzDays = currentReport.days.filter(day => day.hifz === 'yes').length;
    const nazraDays = currentReport.days.filter(day => day.nazra === 'yes').length;
    const tafseerDays = currentReport.days.filter(day => day.tafseer === 'yes').length;
    const hadeesDays = currentReport.days.filter(day => day.hadees === 'yes').length;

    return {
      totalDays,
      namazDays,
      hifzDays,
      nazraDays,
      tafseerDays,
      hadeesDays,
      namazRate: Math.round((namazDays / totalDays) * 100),
      hifzRate: Math.round((hifzDays / totalDays) * 100),
      nazraRate: Math.round((nazraDays / totalDays) * 100),
      tafseerRate: Math.round((tafseerDays / totalDays) * 100),
      hadeesRate: Math.round((hadeesDays / totalDays) * 100)
    };
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

  const stats = getCompletionStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Monthly Report</h1>
        <p className="text-gray-600">
          Generate and download your complete report for {getCurrentMonthName()}
        </p>
      </div>

      {/* Message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Report Preview */}
      {currentReport && stats && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900">Namaz</h3>
              <p className="text-2xl font-bold text-green-600">{stats.namazDays}/{stats.totalDays}</p>
              <p className="text-sm text-green-700">{stats.namazRate}% completion</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900">Hifz</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.hifzDays}/{stats.totalDays}</p>
              <p className="text-sm text-blue-700">{stats.hifzRate}% completion</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900">Nazra</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.nazraDays}/{stats.totalDays}</p>
              <p className="text-sm text-purple-700">{stats.nazraRate}% completion</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-orange-900">Tafseer</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.tafseerDays}/{stats.totalDays}</p>
              <p className="text-sm text-orange-700">{stats.tafseerRate}% completion</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-900">Hadees</h3>
              <p className="text-2xl font-bold text-indigo-600">{stats.hadeesDays}/{stats.totalDays}</p>
              <p className="text-sm text-indigo-700">{stats.hadeesRate}% completion</p>
            </div>
          </div>

          {/* Q&A Preview */}
            {currentReport.qa && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Q&A Responses</h3>
              <div className="space-y-3">
                {Object.entries(currentReport.qa)
                  .filter(([key, value]) => key.match(/^q[1-9]$|^q1[0-9]$|^q2[0-8]$/) && value)
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Question {key.replace('q', '')}:
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Download Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generate Complete Report
          </h2>
          
          <p className="text-gray-600 mb-6">
            Download a comprehensive PDF report including all your daily activities, 
            monthly statistics, and Q&A responses for {getCurrentMonthName()}.
          </p>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {downloading ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Included in the PDF</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Complete daily activity tracking for the entire month
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Monthly statistics and completion rates
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            All your Q&A responses and reflections
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Professional formatting suitable for submission
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Ready to print or share with supervisors
          </li>
        </ul>
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
};

export default PDFDownload; 