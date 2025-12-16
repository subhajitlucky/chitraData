import { FiDownload, FiRotateCcw, FiSave } from 'react-icons/fi';

type ActionBarProps = {
  onRandom: () => void;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
};

export function ActionBar({ onRandom, onReset, onSave, onExport }: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRandom}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          Random data
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400"
        >
          <FiRotateCcw className="h-4 w-4" />
          Reset map
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 ml-auto">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          <FiSave className="h-4 w-4" />
          Save to browser
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <FiDownload className="h-4 w-4" />
          Export map
        </button>
      </div>
    </div>
  );
}

