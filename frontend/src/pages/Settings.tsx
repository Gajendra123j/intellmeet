import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, logout } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("dark");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="bg-dark-800 rounded-xl p-8 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex justify-between items-center p-4 bg-dark-700 rounded-lg">
            <div>
              <h3 className="text-white font-semibold">Email Notifications</h3>
              <p className="text-gray-400 text-sm">Receive meeting updates and summaries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-focus:ring peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:bg-primary-500"></div>
            </label>
          </div>

          {/* Theme Selector */}
          <div className="p-4 bg-dark-700 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Theme</h3>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-dark-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
            <h3 className="text-red-400 font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v3a1 1 0 001 1h2V5a4 4 0 00-4-4H6a4 4 0 00-4 4v3a1 1 0 001 1h2V5zm-2 7a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1zm11.5 2a.5.5 0 00-1 0v2a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2a.5.5 0 00-1 0v1h-1v-1z" clipRule="evenodd" />
              </svg>
              Danger Zone
            </h3>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

