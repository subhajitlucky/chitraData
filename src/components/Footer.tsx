import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-auto">
      <div className="mx-auto px-4 max-w-7xl text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Built with <span role="img" aria-label="love">❤️</span> by{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">Subhajit</span>
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          © {year} ChitraData. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;