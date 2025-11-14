import { useState } from "react";
import { GraduationCap, Moon, Sun, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../stores/themeStore";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setShowProfileMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white/80 backdrop-blur-md border-gray-200"
      } border-b shadow-sm`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`p-2 rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-600 to-cyan-500"
                : "bg-gradient-to-br from-blue-500 to-cyan-400"
            } shadow-lg`}
          >
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              TeachMate AI
            </h1>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Your intelligent teaching companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } transition-all duration-200`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-8 h-8 rounded-full ${
                isDarkMode ? "bg-blue-600" : "bg-blue-500"
              } flex items-center justify-center text-white font-medium text-sm hover:opacity-90 transition-opacity`}
            >
              {user?.name?.charAt(0) || "T"}
            </button>

            {showProfileMenu && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-lg shadow-lg py-1 z-50`}
              >
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  } transition-colors`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  } transition-colors`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
