import type { StateData } from './types';

type ValueTableProps = {
  mapData: StateData[];
  stateInfo: Record<string, { capital: string; region: string }>;
  getStateFillColor: (stateData: StateData) => string;
  onValueChange: (stateName: string, value: string) => void;
};

export function ValueTable({ mapData, stateInfo, getStateFillColor, onValueChange }: ValueTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">State values</h3>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Scroll through the list and update values inline.</p>
      <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-2">
        {mapData.map((stateData) => {
          const info = stateInfo[stateData.state];
          const color = getStateFillColor(stateData);

          return (
            <div
              key={stateData.state}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{stateData.state}</div>
                  {info && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {info.capital} • {info.region}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={stateData.rawValue}
                onChange={(e) => onValueChange(stateData.state, e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="Value or category"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

