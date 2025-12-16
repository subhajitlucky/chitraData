import { FiBox, FiMaximize2 } from 'react-icons/fi';
import type { LayoutId, PaddingPreset, LayoutOption } from './types';

type PaddingOption = {
  label: string;
  description: string;
  scale: number;
};

type LayoutPaddingPanelProps = {
  layoutId: LayoutId;
  layoutOptions: LayoutOption[];
  onLayoutChange: (id: LayoutId) => void;
  paddingPreset: PaddingPreset;
  paddingOptions: Array<[PaddingPreset, PaddingOption]>;
  onPaddingChange: (id: PaddingPreset) => void;
};

export function LayoutPaddingPanel({
  layoutId,
  layoutOptions,
  onLayoutChange,
  paddingPreset,
  paddingOptions,
  onPaddingChange
}: LayoutPaddingPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <FiMaximize2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Canvas layout</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Switch aspect ratio and padding presets.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          {layoutOptions.map(option => {
            const descriptionParts = option.description.split('•').map(part => part.trim());
            const primaryLine = descriptionParts[0] ?? option.description;
            const secondaryLine = descriptionParts.slice(1).join(' • ');
            return (
              <button
                key={option.id}
                onClick={() => onLayoutChange(option.id)}
                className={`flex h-full flex-col justify-between rounded-xl border px-4 py-3 text-left transition ${
                  layoutId === option.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-400 dark:border-indigo-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <span>{option.label}</span>
                  <span>{option.aspectLabel}</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {primaryLine}
                </div>
                {secondaryLine && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {secondaryLine}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <FiBox className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Map padding</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Control whitespace around the geography.</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {paddingOptions.map(([id, option]) => (
              <button
                key={id}
                onClick={() => onPaddingChange(id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  paddingPreset === id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 ring-2 ring-amber-400 dark:border-amber-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-400'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

