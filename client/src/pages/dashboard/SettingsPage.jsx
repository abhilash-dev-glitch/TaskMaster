import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiMoon, FiSun, FiBell, FiSave } from 'react-icons/fi';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Apply theme
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your application settings and preferences.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Appearance</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-700">Theme</h5>
                <p className="text-sm text-gray-500">
                  {settings.theme === 'light' ? 'Light' : 'Dark'} mode
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  settings.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={settings.theme === 'dark'}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {settings.theme === 'dark' ? (
                    <FiMoon className="h-3 w-3 text-indigo-600 m-1" />
                  ) : (
                    <FiSun className="h-3 w-3 text-yellow-500 m-1" />
                  )}
                </span>
              </button>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Notifications</h4>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700">
                    Email notifications
                  </label>
                  <p className="text-gray-500">Get notified about important updates via email.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push-notifications"
                    name="pushNotifications"
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push-notifications" className="font-medium text-gray-700">
                    Push notifications
                  </label>
                  <p className="text-gray-500">Get push notifications on your device.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="weekly-reports"
                    name="weeklyReports"
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="weekly-reports" className="font-medium text-gray-700">
                    Weekly reports
                  </label>
                  <p className="text-gray-500">Receive a weekly summary of your activity.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <FiSave className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
