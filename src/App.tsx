import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GraphCreation from './components/GraphCreation';
import GraphGallery from './components/GraphGallery';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'create' | 'gallery'>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {activeTab === 'landing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage setActiveTab={setActiveTab} />
          </motion.div>
        )}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GraphCreation setActiveTab={setActiveTab} />
          </motion.div>
        )}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GraphGallery setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
