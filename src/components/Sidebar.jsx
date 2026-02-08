import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo or brand at top */}
      <div className="mb-8 text-xl font-bold">Dashboard</div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          🏠 Home
        </Link>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          👥 Users
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          ⚙️ Settings
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          📊
          Analytics
        </a>
      </nav>

      {/* Optional bottom section */}
      <div className="mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg">
          🚪 Logout
        </a>
      </div>
    </div>
  );
}

