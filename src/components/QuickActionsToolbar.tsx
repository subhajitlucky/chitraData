import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiSave,
  FiCopy,
  FiRefreshCw,
  FiShare2,
  FiEye,
  FiRotateCcw
} from 'react-icons/fi';
import ExportDialog from './chart-builder/ExportDialog';

interface QuickActionsToolbarProps {
  onSave: () => void;
  onExport: (format: 'png' | 'pdf', quality: 'standard' | 'hd' | '2k' | '4k' | '8k', size: string) => void;
  onDuplicate: () => void;
  onReset: () => void;
  onShare?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
}

export default function QuickActionsToolbar({
  onSave,
  onExport,
  onDuplicate,
  onReset,
  onShare,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isSaving = false
}: QuickActionsToolbarProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const primaryActions = [
    {
      id: 'save',
      label: 'Save Chart',
      icon: FiSave,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: onSave,
      shortcut: 'Ctrl+S'
    },
    {
      id: 'export',
      label: 'Export',
      icon: FiDownload,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowExportDialog(true),
      shortcut: 'Ctrl+E'
    }
  ];

  const secondaryActions = [
    {
      id: 'undo',
      label: 'Undo',
      icon: FiRotateCcw,
      color: canUndo ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed',
      onClick: onUndo,
      disabled: !canUndo
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: FiRotateCcw,
      color: canRedo ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed',
      onClick: onRedo,
      disabled: !canRedo
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: FiCopy,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: onDuplicate
    },
    {
      id: 'reset',
      label: 'Reset',
      icon: FiRefreshCw,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: onReset
    }
  ];

  return (
    <div className="sticky top-4 z-10 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Actions</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Primary Actions */}
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${action.color} ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  title={`${action.label} (${action.shortcut})`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{isSaving && action.id === 'save' ? 'Saving...' : action.label}</span>
                </motion.button>
              </div>
            );
          })}

          {/* Divider */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Secondary Actions */}
          {secondaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: action.disabled ? 1 : 1.05 }}
                whileTap={{ scale: action.disabled ? 1 : 0.95 }}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex items-center gap-2 px-3 py-2.5 text-white rounded-lg font-medium transition-colors ${action.color}`}
                title={action.label}
              >
                <Icon size={16} />
              </motion.button>
            );
          })}

          {/* Share Action (if provided) */}
          {onShare && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
              title="Share Chart"
            >
              <FiShare2 size={16} />
            </motion.button>
          )}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiEye size={12} />
            <span>Shortcuts: </span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+S</kbd>
            <span>Save</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+E</kbd>
            <span>Export</span>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={(format: 'png' | 'pdf', quality: 'standard' | 'hd' | '2k' | '4k' | '8k', size: string) =>
          onExport(format, quality, size)
        }
      />
    </div>
  );
}
