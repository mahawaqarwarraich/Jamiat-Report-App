import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    class: '',
    institutionName: '',
    address: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch and initialize form data with user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${baseURL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('Fetched user data for profile:', userData.category); // Debug log
          
          setFormData({
            name: userData.name || '',
            mobileNumber: userData.mobileNumber || userData.phoneNumber || '',
            class: userData.class || '',
            institutionName: userData.institutionName || userData.educationalInstitution || '',
            address: userData.address || '',
            category: userData.category || 'hami'
          });
          console.log('Form data set:', formData.category); // Debug log
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to context user data
        if (user) {
          setFormData({
            name: user.name || '',
            mobileNumber: user.mobileNumber || user.phoneNumber || '',
            class: user.class || '',
            institutionName: user.institutionName || user.educationalInstitution || '',
            address: user.address || '',
            category: user.category || ''
          });
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.mobileNumber.trim()) {
      setError('Mobile number is required');
      return;
    }

    if (!formData.class.trim()) {
      setError('Class is required');
      return;
    }

    if (!formData.institutionName.trim()) {
      setError('Institution name is required');
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);

    try {
      // Update profile API call
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseURL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess('Profile updated successfully!');
        
        // Update user in AuthContext (which also updates localStorage)
        if (responseData.user) {
          updateUser(responseData.user);
        } else {
          // If backend doesn't return user, fetch it from profile endpoint
          const profileResponse = await fetch(`${baseURL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (profileResponse.ok) {
            const fullUserData = await profileResponse.json();
            updateUser(fullUserData);
          }
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center mb-4">
            <img 
              src="/logo-trans.png" 
              alt="Islami Jamiat Talibat Pakistan Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Update your personal information
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                id="class"
                name="class"
                type="text"
                required
                value={formData.class}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your class"
              />
            </div>

            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                Name of Institution
              </label>
              <input
                id="institutionName"
                name="institutionName"
                type="text"
                required
                value={formData.institutionName}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your institution name"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Select Your Category
              </label>
              <select
                id="category"
                name="category" // var name
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="hami" default>Hami</option>
                <option value="rafeeqa">Rafeeqa</option>
                <option value="umeedwar rukn">Umeedwar Rukn</option>
                <option value="rukn">Rukn</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-special-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-special-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
