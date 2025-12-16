import { COLOR_PALETTES, type ColorPalette } from '../../utils/colorPalettes';
import type { ChartIssue } from '../../utils/chartDoctor';

interface ChartDoctorPanelProps {
  issues: ChartIssue[];
  onFix: (issueId: string) => void;
  onPaletteSelect?: (palette: ColorPalette) => void;
}

const paletteChoices = ['colorblind-safe', 'corporate-blue', 'vibrant-rainbow'];

export const ChartDoctorPanel = ({ issues, onFix, onPaletteSelect }: ChartDoctorPanelProps) => {
  if (!issues.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-700/60 dark:bg-amber-900/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Chart doctor</h3>
          <p className="text-sm text-amber-800/80 dark:text-amber-200/80">
            We found {issues.length} {issues.length === 1 ? 'note' : 'notes'} to improve readability.
          </p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {issues.map((issue) => {
          const badge =
            issue.severity === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-100'
              : issue.severity === 'warn'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-100'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-100';
          const canFix = [
            'missing-title',
            'pie-slice-count',
            'label-density',
            'dataset-clutter',
            'low-contrast',
            'generic-series-names',
            'missing-units'
          ].includes(issue.id);
          const paletteFixes = issue.id === 'low-contrast';
          return (
            <div
              key={issue.id}
              className="rounded-xl border border-amber-100 bg-white/80 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge}`}>
                  {issue.severity.toUpperCase()}
                </span>
                <span className="font-medium">{issue.message}</span>
                {canFix && (
                  <button
                    onClick={() => onFix(issue.id)}
                    className="ml-auto text-xs font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-200 dark:hover:text-blue-100 underline"
                  >
                    Apply fix
                  </button>
                )}
              </div>
              {issue.suggestion && (
                <div className="mt-1 pl-8 text-xs text-amber-800/80 dark:text-amber-200/80">
                  {issue.suggestion}
                </div>
              )}
              {paletteFixes && onPaletteSelect && (
                <div className="mt-2 flex flex-wrap gap-2 pl-8">
                  {paletteChoices.map((id) => {
                    const palette = COLOR_PALETTES.find((p) => p.id === id);
                    if (!palette) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => onPaletteSelect(palette)}
                        className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-400"
                      >
                        <span className="inline-flex gap-1">
                          {palette.colors.slice(0, 3).map((c) => (
                            <span key={c} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </span>
                        {palette.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

