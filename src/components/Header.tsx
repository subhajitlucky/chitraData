import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiGithub, FiHome, FiPlusCircle, FiFolder } from 'react-icons/fi';

interface HeaderProps {
  activeTab: 'landing' | 'create' | 'gallery';
  setActiveTab: (tab: 'landing' | 'create' | 'gallery') => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CD</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChitraData
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6">
            <button 
              className={`flex items-center space-x-1 ${activeTab === 'landing' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('landing')}
            >
              <FiHome />
              <span>Home</span>
            </button>
            <button 
              className={`flex items-center space-x-1 ${activeTab === 'create' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('create')}
            >
              <FiPlusCircle />
              <span>Create</span>
            </button>
            <button 
              className={`flex items-center space-x-1 ${activeTab === 'gallery' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              onClick={() => setActiveTab('gallery')}
            >
              <FiFolder />
              <span>Gallery</span>
            </button>
          </nav>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <FiSun className="text-yellow-400 text-xl" />
            ) : (
              <FiMoon className="text-gray-700 text-xl" />
            )}
          </button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="GitHub repository"
          >
            <FiGithub className="text-gray-700 dark:text-gray-300 text-xl" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;