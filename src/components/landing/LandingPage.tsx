import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronRight,
  FiLayers,
  FiPenTool,
  FiZap,
  FiClock,
  FiDroplet,
  FiAperture,
  FiShield,
  FiCheckCircle
} from 'react-icons/fi';
import { ChartRenderer } from '../../utils/chartRenderer';

type ChartType = 'bar' | 'line' | 'area';

const heroCharts = [
  {
    id: 'hero-line',
    type: 'line' as ChartType,
    title: 'Revenue vs Target',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { label: 'Revenue', data: [120, 150, 190, 230], color: '#2563eb' },
      { label: 'Target', data: [110, 140, 180, 210], color: '#f59e0b' }
    ]
  },
  {
    id: 'hero-bar',
    type: 'bar' as ChartType,
    title: 'Channel Performance',
    labels: ['Search', 'Email', 'Social', 'Direct'],
    datasets: [{ label: 'Leads', data: [320, 180, 240, 280], color: '#8b5cf6' }]
  },
  {
    id: 'hero-area',
    type: 'area' as ChartType,
    title: 'Engagement Trend',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Active users', data: [900, 1040, 1120, 1320, 1500, 1680], color: '#10b981' }]
  }
];

const templateCards = [
  {
    title: 'Board-ready KPI',
    type: 'bar' as ChartType,
    labels: ['North', 'South', 'East', 'West'],
    datasets: [{ label: 'KPI', data: [88, 76, 93, 81], color: '#2563eb' }]
  },
  {
    title: 'Growth narrative',
    type: 'line' as ChartType,
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [{ label: 'ARR', data: [3.2, 3.9, 5.1, 6.8, 8.4], color: '#8b5cf6' }]
  },
  {
    title: 'Mix & share',
    type: 'area' as ChartType,
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: 'Share', data: [24, 26, 29, 31], color: '#10b981' }]
  }
];

const toPreviewData = (chart: { title: string; type: ChartType; labels: string[]; datasets: { label: string; data: number[]; color: string }[] }) => ({
  title: chart.title,
  labels: chart.labels,
  datasets: chart.datasets.map((ds) => ({
    label: ds.label,
    data: ds.data.join(','),
    color: ds.color
  })),
  chartType: chart.type
});

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);

  const activeHero = useMemo(() => heroCharts[heroIndex], [heroIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroCharts.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden pt-24 pb-16 lg:pt-28"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-white dark:from-[#0b1224] dark:via-gray-900 dark:to-gray-900 opacity-80" />
        <div className="absolute -top-32 -right-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-700/30" aria-hidden />
        <div className="absolute bottom-10 -left-16 h-72 w-72 rounded-full bg-purple-200/25 blur-3xl dark:bg-purple-700/25" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center rounded-full border border-blue-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 backdrop-blur dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200">
                Local-first • Design-grade • Export to 8K
              </span>
              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Build executive-grade charts without leaving your browser.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Templates, palettes, and guardrails that keep every chart readable, on-brand, and export-ready. No signup. No backend.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Open Chart Studio
                  <FiChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/gallery')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-7 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  View gallery
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
                {['Sample + template library', 'Palette & contrast guardrails', 'Instant exports (HD–8K)'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-3 rounded-xl border border-gray-200/80 bg-white/70 px-4 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-800/60"
                  >
                    <FiCheckCircle className="h-4 w-4 text-blue-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[460px]">
              <div className="relative rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur dark:border-white/10 dark:bg-gray-900/80">
                <div className="absolute -top-5 right-5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Live micro-preview
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span>{activeHero.title}</span>
                    <span className="text-blue-600 dark:text-blue-300">{activeHero.type}</span>
                  </div>
                  <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <ChartRenderer data={toPreviewData(activeHero)} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {heroCharts.map((chart, idx) => (
                    <button
                      key={chart.id}
                      onClick={() => setHeroIndex(idx)}
                      className={`rounded-lg border px-2 py-2 text-left transition ${
                        idx === heroIndex
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500/70 dark:bg-blue-900/30 dark:text-blue-200'
                          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500/60'
                      }`}
                    >
                      <div className="font-semibold">{chart.title}</div>
                      <div className="text-[11px] capitalize text-gray-500 dark:text-gray-400">{chart.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Value pillars */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Built for executive storytelling</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              From data paste to export, every control keeps clarity, contrast, and pace in mind.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: FiZap,
                title: 'Start fast',
                copy: 'Load samples, pick a template, and see AI suggestions that fit your data.'
              },
              {
                icon: FiLayers,
                title: 'Design control',
                copy: 'Palette + contrast guardrails, chart-type toggles, and undo/redo for safe iteration.'
              },
              {
                icon: FiPenTool,
                title: 'Ready to present',
                copy: 'Export HD–8K with aspect presets for decks, docs, and dashboards.'
              }
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/70"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110 dark:bg-blue-900/40 dark:text-blue-300">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Build in 30 seconds */}
      <motion.section
        className="py-16 bg-gray-50 dark:bg-gray-900/40"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Build in 30 seconds</h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Three steps. Everything inline. No installs.</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: FiLayers, title: 'Choose a template', detail: 'Executive, ops, or marketing-ready presets.' },
              { icon: FiDroplet, title: 'Pick a palette', detail: 'Colorblind-safe, contrast-checked swatches.' },
              { icon: FiClock, title: 'Export instantly', detail: 'PNG/PDF, 16:9/4:3/1:1, HD–8K quality.' }
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/70"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Step {idx + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Templates + palettes live previews */}
      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Templates and palettes that adapt</h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Every preview runs on the lightweight renderer for speed.</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center justify-center rounded-xl border border-blue-500 px-6 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-blue-300 dark:hover:bg-blue-500/10"
            >
              Open studio
              <FiChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {templateCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/70"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <span>{card.title}</span>
                  <span className="text-xs uppercase text-blue-600 dark:text-blue-300">{card.type}</span>
                </div>
                <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                  <ChartRenderer data={toPreviewData(card)} />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Palette swaps in one click—keeps contrast safe.</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quality + exports */}
      <motion.section
        className="py-16 bg-gray-50 dark:bg-gray-900/40"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
                <FiShield className="h-4 w-4" /> Chart doctor & a11y guardrails
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">Clarity-first defaults</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>• Detects dense labels, generic series names, and slice overload.</li>
                <li>• Contrast checks + palette suggestions for accessibility.</li>
                <li>• One-tap fixes; keeps undo/redo safe.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-white p-7 shadow-sm dark:border-blue-500/30 dark:bg-gray-800/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-200">
                <FiAperture className="h-4 w-4" /> Exports that stay sharp
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">HD to 8K in one click</h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Pick aspect ratios, queue multiple exports, and keep charts presentation-ready for slides, docs, and dashboards.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                {['PNG & PDF', '16:9 • 4:3 • 1:1', 'HD • 2K • 4K • 8K'].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-dashed border-blue-200 px-3 py-2 text-center dark:border-blue-500/40"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Closing CTA */}
      <motion.section
        className="pb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-gray-700 dark:bg-gray-800/70">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Ready to launch your next chart?</h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                  Local-first, free, and optimized for executive decks and dashboards.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Open Chart Studio
                  <FiChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/gallery')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-7 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Browse gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;