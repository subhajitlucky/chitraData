import type { ChartIssue } from '../../../utils/chartDoctor';
import type { ChartRecommendation } from '../../../utils/chartRecommendations';
import type { GraphType } from '../../../types';
import { ChartDoctorPanel } from '../ChartDoctorPanel';
import ChartRecommendationUI from '../ChartRecommendation';
import type { ColorPalette } from '../../../utils/colorPalettes';

interface InsightsSectionProps {
  chartIssues: ChartIssue[];
  recommendations: ChartRecommendation[];
  currentType: GraphType;
  onFix: (issueId: string) => void;
  onPaletteSelect: (palette: ColorPalette) => void;
  onSelectChartType: (type: GraphType) => void;
}

export function InsightsSection({
  chartIssues,
  recommendations,
  currentType,
  onFix,
  onPaletteSelect,
  onSelectChartType
}: InsightsSectionProps) {
  if (chartIssues.length === 0 && recommendations.length === 0) return null;

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {chartIssues.length > 0 && (
        <div className="w-full">
          <ChartDoctorPanel issues={chartIssues} onFix={onFix} onPaletteSelect={onPaletteSelect} />
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10">
          <ChartRecommendationUI
            recommendations={recommendations}
            onSelect={onSelectChartType}
            currentType={currentType}
          />
        </div>
      )}
    </section>
  );
}

