type MapInfoPanelProps = {
  mapTitle: string;
  dataSource: string;
  onTitleChange: (v: string) => void;
  onSourceChange: (v: string) => void;
};

export function MapInfoPanel({ mapTitle, dataSource, onTitleChange, onSourceChange }: MapInfoPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Map information</h3>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Add the title and source that accompany your export.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Map title
          </label>
          <input
            type="text"
            value={mapTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="e.g., GDP by State 2024"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Displayed above the map preview and export.</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Data source
          </label>
          <input
            type="text"
            value={dataSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="e.g., World Bank, 2024 or https://data.gov.in"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Appears below the legend for attribution.</p>
        </div>
      </div>
    </div>
  );
}

