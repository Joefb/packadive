import { useAuth } from "../contexts/AuthContext";
import { useList } from "../contexts/ListContext";
import { Progress, Typography } from "@material-tailwind/react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
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
    <div className="flex h-20 items-center justify-between px-6 border-b bg-white dark:bg-gray-900">
      <div className="text-xl font-bold" onClick={() => navigate("/userhome")}><span>Planadive</span></div>

      {/* Login/Register buttons */}
      {!isAuthenticated && (
        <div className="flex h-20 items-center justify-between px-6 border-b bg-white dark:bg-gray-900">
          <div className="flex gap-4">
            <Link to="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
            </Link>
          </div>
        </div>
      )}

      {/* Completion bar */}
      {isAuthenticated && (
        <div className="w-1/2">
          <div className="mb-2 flex items-center justify-between gap-4">
            <Typography color="blue-gray" variant="h6">
              Packed and Ready
            </Typography>
            <Typography color="blue-gray" variant="h6">
              {totalProgress}%
            </Typography>
          </div>
          <Progress value={totalProgress} color="green" />
        </div>
      )}

      {/* Right side - user actions */}
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg text-4xl">
            🤿
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 shadow-lg text-lg font-semibold focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <span>{user.user_name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 z-50">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
