import { useState, useEffect } from 'react';
import type { GraphData } from '../types';
import { motion } from 'framer-motion';
import { 
  FiDownload, 
  FiTrash2, 
  FiBarChart2,
  FiArrowLeft,
  FiTrendingUp,
  FiPieChart,
  FiActivity
} from 'react-icons/fi';

interface GraphGalleryProps {
  setActiveTab: (tab: 'landing' | 'create' | 'gallery') => void;
}

const GraphGallery = ({ setActiveTab }: GraphGalleryProps) => {
  interface DeleteStatus {
    type: 'success' | 'error' | 'info';
    message: string;
  }

  const [savedGraphs, setSavedGraphs] = useState<GraphData[]>([]);
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus | null>(null);

  useEffect(() => {
    // Load graphs from localStorage
    try {
      const savedGraphsData = localStorage.getItem('chitradata_graphs');
      if (savedGraphsData) {
        const graphs = JSON.parse(savedGraphsData);
        setSavedGraphs(Array.isArray(graphs) ? graphs : []);
      }
    } catch (error) {
      console.error('Error loading saved graphs:', error);
      setSavedGraphs([]);
    }
  }, []);

  const deleteGraph = (id: string) => {
    try {
      const updatedGraphs = savedGraphs.filter(graph => graph.id !== id);
      setSavedGraphs(updatedGraphs);
      localStorage.setItem('chitradata_graphs', JSON.stringify(updatedGraphs));
      setDeleteStatus({ type: 'success', message: 'Graph deleted successfully!' });
    } catch {
      setDeleteStatus({ type: 'error', message: 'Failed to delete graph' });
    }
    
    setTimeout(() => setDeleteStatus(null), 3000);
  };

  const downloadGraph = () => {
    setDeleteStatus({ type: 'info', message: 'Graph download functionality would be implemented here!' });
    setTimeout(() => setDeleteStatus(null), 3000);
  };

  const renderChartPreview = (graph: GraphData) => {
    // Simple preview component that shows chart type and data structure
    return (
      <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          {graph.type === 'bar' && <FiBarChart2 className="mx-auto text-gray-400 text-3xl mb-2" />}
          {graph.type === 'line' && <FiTrendingUp className="mx-auto text-gray-400 text-3xl mb-2" />}
          {graph.type === 'pie' && <FiPieChart className="mx-auto text-gray-400 text-3xl mb-2" />}
          {graph.type === 'area' && <FiActivity className="mx-auto text-gray-400 text-3xl mb-2" />}
          {graph.type === 'scatter' && <FiActivity className="mx-auto text-gray-400 text-3xl mb-2" />}
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {graph.type} Chart
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button 
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
          onClick={() => setActiveTab('landing')}
        >
          <FiArrowLeft />
          <span>Back to Home</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Graphs</h2>
        {savedGraphs.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            {savedGraphs.length} graph{savedGraphs.length !== 1 ? 's' : ''} saved
          </p>
        )}
      </div>

      {deleteStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          deleteStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
          deleteStatus.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
        }`}>
          {deleteStatus.message}
        </div>
      )}

      {savedGraphs.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <FiBarChart2 className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No graphs yet</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            You haven't saved any graphs yet. Create your first graph and save it to see it appear here.
          </p>
          <button
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Graph
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {savedGraphs.map((graph, index) => (
            <motion.div
              key={graph.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                    {graph.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadGraph}
                      className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1"
                      aria-label="Download graph"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => deleteGraph(graph.id)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1"
                      aria-label="Delete graph"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                  {graph.type} Chart
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Created: {new Date(graph.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="px-5 pb-5">
                {renderChartPreview(graph)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GraphGallery;