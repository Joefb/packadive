import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, } = useAuth();

  return (
    <div className="flex h-16 items-center justify-between px-6 border-b bg-white dark:bg-gray-900">
      {/* Left side - logo or app name */}
      <div className="text-xl font-bold">YourApp</div>

      {/* Right side - user actions */}
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            🔔 Notifications
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span>Joe</span>
          </div>
        </div>
      )}
    </div>
  );
}

