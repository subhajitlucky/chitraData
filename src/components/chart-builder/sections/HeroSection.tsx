import { FiDatabase, FiLayout } from 'react-icons/fi';

interface HeroSectionProps {
  onOpenSamples: () => void;
  onOpenTemplates: () => void;
}

export function HeroSection({ onOpenSamples, onOpenTemplates }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-700/20" aria-hidden />
      <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-purple-200/25 blur-3xl dark:bg-purple-700/15" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-blue-200/70 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              Chart studio
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl">
              Executive-grade charts in seconds.
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Load samples, apply pro templates, and iterate safely with undo/redo. Live preview stays in lockstep while you refine labels, palettes, and exports.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onOpenSamples}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:border-blue-400"
              >
                <FiDatabase className="h-4 w-4" />
                Sample library
              </button>
              <button
                onClick={onOpenTemplates}
                className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-200 dark:hover:border-purple-400"
              >
                <FiLayout className="h-4 w-4" />
                Template gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

