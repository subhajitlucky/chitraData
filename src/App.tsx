import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import GraphCreation from './components/GraphCreationNew';
import GraphGallery from './components/GraphGallery';
import IndiaMapPageNew from './components/IndiaMapPageClean';
import Navbar from './components/Navbar';
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
    switch(tab) {
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Routes>
        <Route path="/" element={<LandingPage setActiveTab={setActiveTab} />} />
        <Route path="/create" element={<GraphCreation />} />
        <Route path="/map" element={<IndiaMapPageNew />} />
        <Route path="/gallery" element={<GraphGallery setActiveTab={setActiveTab} />} />
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
