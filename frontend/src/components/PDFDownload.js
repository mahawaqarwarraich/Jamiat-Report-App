import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HamiPDFDownload from './pdfDownloads/HamiPDFDownload';
import RafeeqaPDFDownload from './pdfDownloads/RafeeqaPDFDownload';
import RuknPDFDownload from './pdfDownloads/RuknPDFDownload';
import UmeedwarPDFDownload from './pdfDownloads/UmeedwarPDFDownload';

const PDFDownload = () => {
  const { user } = useAuth();
  const category = user?.category?.toLowerCase();

  // Conditionally render category-specific PDFDownload components
  if (category === 'hami') {
    return <HamiPDFDownload />;
  }

  if (category === 'rafeeqa') {
    return <RafeeqaPDFDownload />;
  }

  if (category === 'rukn') {
    return <RuknPDFDownload />;
  }

  if (category === 'umeedwar rukn' || category === 'umeedwar') {
    return <UmeedwarPDFDownload />;
  }

  // Default fallback for unknown categories
  return (
    <div className="text-center py-12">
      <p className="text-gray-600">Unknown user category. Please update your profile.</p>
    </div>
  );
};

export default PDFDownload; 