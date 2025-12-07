import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  ArrowDownTrayIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMobileMenu();
  };

  if (!user) return null;

  return (
    <nav className="bg-special-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="text-white text-xl font-bold">Daily Report</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            <Link
              to="/daily"
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
            >
              <CalendarIcon className="h-5 w-5 mr-1" />
              Daily Report
            </Link>
            <Link
              to="/monthly"
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
            >
              <DocumentTextIcon className="h-5 w-5 mr-1" />
              Monthly View
            </Link>
            <Link
              to="/qa"
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
              Q&A
            </Link>
            <Link
              to="/download"
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
              Download PDF
            </Link>
          </div>

                     {/* User Menu - Hidden on mobile */}
           <div className="hidden md:flex items-center">
             <div className="flex items-center space-x-2 text-white">
               <Link
                 to="/profile"
                 className="flex items-center space-x-2 hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium transition-opacity"
               >
                 <UserIcon className="h-5 w-5" />
                 <span>{user.name}</span>
               </Link>
               <button
                 onClick={handleLogout}
                 className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-opacity"
               >
                 <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                 Logout
               </button>
             </div>
           </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium transition-opacity"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-special-blue opacity-90">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-white hover:opacity-80 block px-3 py-2 rounded-md text-base font-medium transition-opacity"
          >
            Dashboard
          </Link>
          <Link
            to="/daily"
            onClick={closeMobileMenu}
            className="text-white hover:opacity-80 block px-3 py-2 rounded-md text-base font-medium transition-opacity"
          >
            Daily Report
          </Link>
          <Link
            to="/monthly"
            onClick={closeMobileMenu}
            className="text-white hover:opacity-80 block px-3 py-2 rounded-md text-base font-medium transition-opacity"
          >
            Monthly View
          </Link>
          <Link
            to="/qa"
            onClick={closeMobileMenu}
            className="text-white hover:opacity-80 block px-3 py-2 rounded-md text-base font-medium transition-opacity"
          >
            Q&A
          </Link>
                     <Link
             to="/download"
             onClick={closeMobileMenu}
             className="text-white hover:opacity-80 block px-3 py-2 rounded-md text-base font-medium transition-opacity"
           >
             Download PDF
           </Link>
           
           {/* Mobile User Menu */}
           <div className="border-t border-white border-opacity-30 pt-4 mt-4">
             <Link
               to="/profile"
               onClick={closeMobileMenu}
               className="flex items-center px-3 py-2 text-white hover:opacity-80 rounded-md text-base font-medium transition-opacity"
             >
               <UserIcon className="h-5 w-5 mr-2" />
               <span>{user.name}</span>
             </Link>
             <button
               onClick={handleLogout}
               className="text-white hover:opacity-80 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-opacity"
             >
               <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 inline" />
               Logout
             </button>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 