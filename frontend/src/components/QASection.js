import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';
import { useReport } from '../contexts/ReportContext';
import { useAuth } from '../contexts/AuthContext';
import HamiQA from './qa/HamiQA';
import RafeeqaQA from './qa/RafeeqaQA';
import RuknQA from './qa/RuknQA';
import UmeedwarQA from './qa/UmeedwarQA';

const QASection = () => {
  const { user } = useAuth();
  const { selectedMonth, selectedYear } = useReport();
  const category = user?.category?.toLowerCase();
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [qaData, setQaData] = useState({});

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
  }, [selectedMonth, selectedYear, category]);

  const fetchCurrentReport = async () => {
    try {
      setLoading(true);
      
      // Determine API endpoint based on category
      let apiEndpoint = '';
      if (category === 'hami') {
        apiEndpoint = `/hami-reports/${selectedMonth}/${selectedYear}`;
      } else if (category === 'rafeeqa') {
        apiEndpoint = `/rafeeqa-reports/${selectedMonth}/${selectedYear}`;
      } else if (category === 'rukn') {
        apiEndpoint = `/rukn-reports/${selectedMonth}/${selectedYear}`;
      } else if (category === 'umeedwar rukn') {
        apiEndpoint = `/umeedwar-reports/${selectedMonth}/${selectedYear}`;
      } else {
        // Fallback to generic reports endpoint
        apiEndpoint = `/reports/current`;
      }

      const response = await axios.get(apiEndpoint);
      const report = response.data.report || response.data;
      setCurrentReport(report);
      
      // Load existing Q&A data
      if (report && report.qa) {
        setQaData(report.qa);
      } else {
        setQaData({});
      }
    } catch (error) {
      console.error('Error fetching current report:', error);
      // If report doesn't exist, that's okay - user can create new one
      setCurrentReport(null);
      setQaData({});
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Determine API endpoint based on category
      let apiEndpoint = '';
      if (category === 'hami') {
        apiEndpoint = `/hami-reports/${selectedMonth}/${selectedYear}/qa`;
      } else if (category === 'rafeeqa') {
        apiEndpoint = `/rafeeqa-reports/${selectedMonth}/${selectedYear}/qa`;
      } else if (category === 'rukn') {
        apiEndpoint = `/rukn-reports/${selectedMonth}/${selectedYear}/qa`;
      } else if (category === 'umeedwar rukn') {
        apiEndpoint = `/umeedwar-reports/${selectedMonth}/${selectedYear}/qa`;
      } else {
        // Fallback to generic reports endpoint
        apiEndpoint = '/reports/add-answers';
      }

      const requestData = category === 'hami' || category === 'rafeeqa' || category === 'rukn' || category === 'umeedwar rukn'
        ? { qa: qaData }
        : {
            month: selectedMonth,
            year: selectedYear,
            answers: qaData
          };

      console.log('Saving Q&A responses:', requestData);
      
      const response = await axios.post(apiEndpoint, requestData);
      
      if (response.data.success) {
        setCurrentReport(response.data.report);
        showToast('Q&A responses saved successfully!');
        
        // Clear toast after 3 seconds
        setTimeout(() => hideToast(), 3000);
      } else {
        showToast('Failed to save Q&A responses', 'error');
      }
    } catch (error) {
      console.error('Error saving Q&A responses:', error);
      showToast(error.response?.data?.message || 'Error saving Q&A responses. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentMonthName = () => {
    // Use selected month/year from context (from DailyReport component)
    return `${selectedMonth} ${selectedYear}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Q&A</h1>
        <p className="text-gray-600">
          Reflect on your spiritual journey for {getCurrentMonthName()}
        </p>
      </div>

      {/* Q&A Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {category === 'hami' && (
          <HamiQA qaData={qaData} handleInputChange={handleInputChange} />
        )}
        {category === 'rafeeqa' && (
          <RafeeqaQA qaData={qaData} handleInputChange={handleInputChange} />
        )}
        {category === 'rukn' && (
          <RuknQA qaData={qaData} handleInputChange={handleInputChange} />
        )}
        {(category === 'umeedwar rukn' || category === 'umeedwar') && (
          <UmeedwarQA qaData={qaData} handleInputChange={handleInputChange} />
        )}
        {(!category || (category !== 'hami' && category !== 'rafeeqa' && category !== 'rukn' && category !== 'umeedwar rukn' && category !== 'umeedwar')) && (
          <div className="text-center py-8">
            <p className="text-gray-600">Unknown user category. Please update your profile.</p>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-special-blue text-white px-6 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-special-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Q&A Responses'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Reflection</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Take time to reflect deeply on each question
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Be honest about your challenges and achievements
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Set specific, achievable goals for improvement
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Consider how your actions impact your spiritual growth
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Think about ways to help others in their religious journey
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

export default QASection; 