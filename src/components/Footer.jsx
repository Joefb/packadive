export default function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-500 border-t bg-white dark:bg-gray-900 dark:text-gray-400">
      © {new Date().getFullYear()} YourApp — Built with React + Tailwind
    </footer>
  );
}

