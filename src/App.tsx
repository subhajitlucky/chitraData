import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GraphCreation from './components/GraphCreationNew';
import GraphGallery from './components/GraphGallery';
import IndiaMapPageNew from './components/IndiaMapPageClean';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current route
  const getActiveTab = (): 'landing' | 'create' | 'gallery' | 'map' => {
    const path = location.pathname;
    if (path === '/create') return 'create';
    if (path === '/map') return 'map';
    if (path === '/gallery') return 'gallery';
    return 'landing';
  };

  const activeTab = getActiveTab();

  const setActiveTab = (tab: 'landing' | 'create' | 'gallery' | 'map') => {
    switch (tab) {
      case 'create':
        navigate('/create');
        break;
      case 'map':
        navigate('/map');
        break;
      case 'gallery':
        navigate('/gallery');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <Routes>
        <Route path="/create" element={
          <div className="pt-[73px]">
            <GraphCreation />
          </div>
        } />
        
        <Route path="/map" element={
          <div className="pt-[73px]">
            <IndiaMapPageNew />
          </div>
        } />
        
        <Route path="/gallery" element={
          <main className="pt-[73px] container mx-auto px-4 py-8 max-w-7xl flex-grow w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GraphGallery setActiveTab={setActiveTab} />
            </motion.div>
          </main>
        } />
        
        <Route path="/" element={
          <main className="pt-[73px] container mx-auto px-4 py-8 max-w-7xl flex-grow w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage setActiveTab={setActiveTab} />
            </motion.div>
          </main>
        } />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
