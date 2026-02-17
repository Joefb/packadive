import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar - hidden on mobile */}
      {isAuthenticated && (
        <aside className="hidden md:block md:w-72 lg:w-80 shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <Sidebar />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isAuthenticated && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {isAuthenticated && (
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Your Checklists</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <Sidebar onMobileMenuClose={closeMobileMenu} />
        </aside>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Navbar onMobileMenuToggle={toggleMobileMenu} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <footer className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Footer />
        </footer>

      </div>
    </div>
  );
}
