import { useAuth } from "../contexts/AuthContext";
import { useList } from "../contexts/ListContext";
import { Progress, Typography } from "@material-tailwind/react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onMobileMenuToggle }) {
  const { isAuthenticated, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { totalProgress } = useList();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  }


  return (
    <div className="bg-white dark:bg-gray-900 border-b">
      {/* Mobile Logo - Only visible below md breakpoint */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-center py-4 border-b border-gray-100 dark:border-gray-800">
          <div
            className="font-revalia text-2xl sm:text-3xl cursor-pointer bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
            style={{ lineHeight: '1.5' }}
            onClick={() => navigate("/userhome")}
          >
            Packadive
          </div>
        </div>
      )}

      {/* Main Controls Row */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-20 gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Hamburger Menu - Only visible on mobile when authenticated */}
          {isAuthenticated && (
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Desktop Logo - Only visible at md breakpoint and above */}
          <div
            className="hidden md:block font-revalia text-2xl lg:text-3xl cursor-pointer bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
            style={{ lineHeight: '1.5' }}
            onClick={() => navigate("/userhome")}
          >
            Packadive
          </div>
        </div>

        {/* Center - Progress Bar (only when authenticated) */}
        {isAuthenticated && (
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Packed and Ready
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                {totalProgress}%
              </span>
            </div>
            <Progress
              value={totalProgress}
              color={totalProgress === 100 ? "green" : "blue"}
            />
          </div>
        )}

        {/* Right Side */}
        {isAuthenticated ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <span className="drop-shadow-sm">{user.user_name[0].toUpperCase()}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/diveconditions"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                >
                  Dive Conditions
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Not Authenticated - Login/Register buttons */
          <div className="flex gap-2 sm:gap-4">
            <Link to="/login">
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded text-sm sm:text-base hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded text-sm sm:text-base hover:bg-green-700 transition">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
