import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiActivity, FiChevronRight, FiMap } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: FiBarChart2,
      title: 'Bar Charts',
      description: 'Create beautiful bar charts to compare data across categories'
    },
    {
      icon: FiPieChart,
      title: 'Pie Charts',
      description: 'Visualize proportions and percentages with pie charts'
    },
    {
      icon: FiTrendingUp,
      title: 'Line Charts',
      description: 'Show trends over time with smooth line graphs'
    },
    {
      icon: FiActivity,
      title: 'Area Charts',
      description: 'Display data with filled areas for better visual impact'
    },
    {
      icon: FiMap,
      title: 'India Map',
      description: 'Visualize state-wise data on accurate geographical map of India'
    }
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <motion.section
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Visualize Your Data
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Create beautiful, interactive charts and graphs without any coding. Free, fast, and easy to use.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/create')}
            className="px-8 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg text-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>Create Your First Chart</span>
            <FiChevronRight />
          </button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Chart Types</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Choose from various chart types to perfectly represent your data
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <feature.icon className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Create Beautiful Charts?</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
          Get started in seconds. No registration required. Free forever.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <button
            onClick={() => navigate('/create')}
            className="px-8 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg text-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <span>Create Chart</span>
            <FiChevronRight />
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-8 py-3 bg-green-600 dark:bg-green-700 text-white font-medium rounded-lg text-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <FiMap className="text-xl" />
            <span>India Map</span>
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
          >
            View Gallery
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;