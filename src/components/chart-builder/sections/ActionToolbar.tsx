import {
  FiRotateCcw,
  FiCopy,
  FiSave
} from 'react-icons/fi';

interface ActionToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onDuplicate: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function ActionToolbar({
  onUndo,
  onRedo,
  onDuplicate,
  onSave,
  canUndo,
  canRedo
}: ActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            canUndo
              ? 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200'
              : 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
          }`}
        >
          <FiRotateCcw className="h-4 w-4" />
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            canRedo
              ? 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200'
              : 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
          }`}
        >
          <FiRotateCcw className="h-4 w-4 rotate-180" />
          Redo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onDuplicate}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          <FiCopy className="h-4 w-4" />
          Duplicate
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          <FiSave className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
}

