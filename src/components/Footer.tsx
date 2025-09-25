const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Built with ❤️ by{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">QWEN 3 CODER &amp; Subhajit</span>
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} ChitraData. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;