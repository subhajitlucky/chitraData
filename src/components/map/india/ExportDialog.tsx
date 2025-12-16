import type { ResolutionPreset } from './types';

type ExportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: (preset: ResolutionPreset) => void;
  resolutionButtonStyles: Record<string, { base: string; text: string }>;
  getResolutionDimensions: (preset: ResolutionPreset) => { width: number; height: number };
  RESOLUTION_PRESETS: Record<ResolutionPreset, { label: string; description: string; longEdge: number }>;
};

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  resolutionButtonStyles,
  getResolutionDimensions,
  RESOLUTION_PRESETS
}: ExportDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/60">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export map</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Choose the resolution that matches your presentation or print needs.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <span className="sr-only">Close export dialog</span>
            ×
          </button>
        </div>
        <div className="space-y-3 px-6 py-6">
          {(Object.keys(RESOLUTION_PRESETS) as ResolutionPreset[]).map((preset) => {
            const buttonStyle = resolutionButtonStyles[preset];
            const { width: presetWidth, height: presetHeight } = getResolutionDimensions(preset);
            const info = RESOLUTION_PRESETS[preset];
            return (
              <button
                key={preset}
                onClick={() => onExport(preset)}
                className={`w-full rounded-xl px-4 py-4 text-left text-white shadow-lg transition ${buttonStyle.base}`}
              >
                <div className="text-base font-semibold">
                  {info.label} Quality
                </div>
                <div className={`text-xs ${buttonStyle.text}`}>
                  {`${presetWidth} × ${presetHeight}`} • {info.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

