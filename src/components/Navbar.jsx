import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Task Manager
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Tasks
              </Link>
              <Link
                to="/posts"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/posts')
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Posts
              </Link>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={toggleTheme}
            className="flex items-center space-x-2"
          >
            {theme === 'dark' ? (
              <>
                <span>☀️</span>
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <span>🌙</span>
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

