import type { LegendTick } from './types';

type LegendPanelProps = {
  hasNumericValues: boolean;
  legendGradientStops: string;
  legendTickPositions: LegendTick[];
  hasCategoricalValues: boolean;
  categoryLegendItems: { key: string; label: string }[];
  categoryColorLookup: Map<string, string>;
  maxNumericValue: number;
  dataSource: string;
};

export function LegendPanel({
  hasNumericValues,
  legendGradientStops,
  legendTickPositions,
  hasCategoricalValues,
  categoryLegendItems,
  categoryColorLookup,
  maxNumericValue,
  dataSource
}: LegendPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      {hasNumericValues ? (
        <>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
          <div
            className="relative mt-4 h-4 rounded-full shadow-inner"
            style={{ background: `linear-gradient(90deg, ${legendGradientStops})` }}
          >
            {legendTickPositions.map((tick, index) => (
              <div
                key={index}
                className="absolute top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-gray-600 dark:text-gray-400"
                style={{ left: `${tick.position}%` }}
              >
                {tick.label}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Add numeric values to see a continuous legend.
        </div>
      )}

      {hasCategoricalValues && (
        <div className={`mt-${hasNumericValues ? '6' : '4'} space-y-3`}>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Categories
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categoryLegendItems.map(item => (
              <div key={item.key} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span
                  className="inline-block h-3 w-3 rounded-full border border-white/40 shadow"
                  style={{ backgroundColor: categoryColorLookup.get(item.key) ?? '#9ca3af' }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${hasNumericValues || hasCategoricalValues ? 'mt-6' : 'mt-4'} border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400`}>
        {hasNumericValues ? (
          <span>
            <span className="font-semibold">Max value:</span> {maxNumericValue.toLocaleString()}
          </span>
        ) : (
          <span>
            <span className="font-semibold">Numeric data:</span> None yet
          </span>
        )}
        {hasCategoricalValues && (
          <span className="ml-2">
            • <span className="font-semibold">Categories:</span> {categoryLegendItems.length}
          </span>
        )}
        {dataSource && (
          <span className="ml-2">
            • <span className="font-semibold">Source:</span> {dataSource}
          </span>
        )}
      </div>
    </div>
  );
}

