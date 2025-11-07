import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiGithub, FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  activeTab: 'landing' | 'create' | 'gallery' | 'map';
  setActiveTab: (tab: 'landing' | 'create' | 'gallery' | 'map') => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CD</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600">
            ChitraData
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile menu button - visible only on small screens */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <FiX className="text-gray-700 dark:text-gray-300 text-xl" />
              ) : (
                <FiMenu className="text-gray-700 dark:text-gray-300 text-xl" />
              )}
            </button>
          </div>
          
          {/* Desktop navigation - hidden on mobile */}
          <nav className="hidden md:flex space-x-6">
            <button
              className={`${activeTab === 'landing' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('landing')}
            >
              Home
            </button>
            <button
              className={`${activeTab === 'create' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('create')}
            >
              Create
            </button>
            <button
              className={`${activeTab === 'map' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('map')}
            >
              India Map
            </button>
            <button
              className={`${activeTab === 'gallery' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </nav>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <FiSun className="text-yellow-400 text-xl" />
            ) : (
              <FiMoon className="text-gray-700 text-xl" />
            )}
          </button>
          
          <a
            href="https://github.com/subhajitlucky/chitraData"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden md:block"
            aria-label="GitHub repository"
          >
            <FiGithub className="text-gray-700 dark:text-gray-300 text-xl" />
          </a>
        </div>
      </div>
      
      {/* Mobile navigation menu - only visible when mobileMenuOpen is true */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <button
                className={`text-left px-3 py-2 rounded-lg ${activeTab === 'landing' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                onClick={() => {
                  setActiveTab('landing');
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button
                className={`text-left px-3 py-2 rounded-lg ${activeTab === 'create' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                onClick={() => {
                  setActiveTab('create');
                  setMobileMenuOpen(false);
                }}
              >
                Create
              </button>
              <button
                className={`text-left px-3 py-2 rounded-lg ${activeTab === 'map' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                onClick={() => {
                  setActiveTab('map');
                  setMobileMenuOpen(false);
                }}
              >
                India Map
              </button>
              <button
                className={`text-left px-3 py-2 rounded-lg ${activeTab === 'gallery' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                onClick={() => {
                  setActiveTab('gallery');
                  setMobileMenuOpen(false);
                }}
              >
                Gallery
              </button>
            </nav>
            
            <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleDarkMode}
                className="flex-1 text-center py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FiSun className="text-yellow-400 text-lg inline" />
                ) : (
                  <FiMoon className="text-gray-700 dark:text-gray-300 text-lg inline" />
                )}
                <span className="ml-2">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="GitHub repository"
              >
                <FiGithub className="text-gray-700 dark:text-gray-300 text-lg inline" />
                <span className="ml-2">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;