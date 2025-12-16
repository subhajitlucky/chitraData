import type { ReactNode } from 'react';

type MapPreviewSectionProps = {
  mapLoaded: boolean;
  svgRef: React.RefObject<SVGSVGElement>;
  children?: ReactNode;
};

export function MapPreviewSection({ mapLoaded, svgRef, children }: MapPreviewSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live preview</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Full SVG render with zoom-friendly detail.</p>
        </div>
        {children}
      </div>

      <div className="relative mt-5 flex min-h-[620px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-950">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Loading map…
          </div>
        )}
        <svg
          ref={svgRef}
          className="w-full max-w-4xl"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>
    </section>
  );
}

