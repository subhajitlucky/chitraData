import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GraphCreationNew from './components/GraphCreationNew';
import GraphGallery from './components/GraphGallery';
import IndiaMapPageClean from './components/IndiaMapPageClean';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />

        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<GraphCreationNew />} />
            <Route path="/map" element={<IndiaMapPageClean />} />
            <Route path="/gallery" element={<GraphGallery />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
