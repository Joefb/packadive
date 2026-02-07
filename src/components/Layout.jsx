import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {isAuthenticated && (
        <aside className="hidden md:block md:w-72 lg:w-80 shrink-0 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <Sidebar />
        </aside>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <Navbar />
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
