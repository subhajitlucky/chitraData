import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiChevronRight,
  FiDownload,
  FiGlobe,
  FiLayers,
  FiMap,
  FiPenTool,
  FiPieChart,
  FiSliders,
  FiTrendingUp,
  FiUsers,
  FiZap
} from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();

  const heroHighlights = [
    'Sample data and templates built in',
    'AI chart recommendations & palette control',
    '2K to 8K exports for charts and maps'
  ];

  const valuePillars = [
    {
      icon: FiZap,
      title: 'Kick off with momentum',
      copy: 'Load curated sample datasets, apply templates, and let AI recommendations steer you toward the right chart.',
      points: [
        'Sample data library drawn from real business scenarios',
        'Template gallery for executive, marketing, and ops updates'
      ]
    },
    {
      icon: FiLayers,
      title: 'Control every visual detail',
      copy: 'Switch between bar, line, area, pie, and doughnut views while locking in palettes that support your narrative.',
      points: [
        'Color palette selector tuned for contrast and accessibility',
        'Chart-type toggles with instant live preview and undo/redo'
      ]
    },
    {
      icon: FiPenTool,
      title: 'Deliver presentation-grade output',
      copy: 'Export PNG or PDF files in HD, 2K, 4K, or 8K so decks, dashboards, and reports stay sharp everywhere.',
      points: [
        'Quality presets and aspect ratios for slides and social',
        'Shared export pipeline with the map studio'
      ]
    }
  ];

  const chartLibrary = [
    {
      icon: FiBarChart2,
      title: 'Comparative clarity',
      description: 'Bar, stacked, grouped, and waterfall-friendly layouts keep category insights dependable and legible.'
    },
    {
      icon: FiTrendingUp,
      title: 'Trend intelligence',
      description: 'Line and area charts spotlight momentum, inflections, and seasonality without visual noise.'
    },
    {
      icon: FiPieChart,
      title: 'Composition at a glance',
      description: 'Pie and doughnut visuals communicate share-of-voice stories while staying presentation-ready.'
    },
    {
      icon: FiActivity,
      title: 'Cumulative narratives',
      description: 'Layered areas and smooth gradients explain contribution over time with precision.'
    },
    {
      icon: FiMap,
      title: 'Country-level focus',
      description: 'Accurate India maps reveal regional opportunities and benchmarks straight from the browser.'
    },
    {
      icon: FiGlobe,
      title: 'Ready to expand',
      description: 'Architecture prepared for additional geographies and industry-specific presets as the library grows.'
    }
  ];

  const builderHighlights = [
    {
      title: 'Live preview with undo/redo safety',
      description:
        'ChartPreview updates as you type while the undo and redo stack keeps experimentation risk-free.'
    },
    {
      title: 'Sample data & templates on tap',
      description:
        'Swap in curated datasets or apply a template before committing to your own data story.'
    },
    {
      title: 'Exports up to 8K with presets',
      description:
        'Choose PNG or PDF, pick from deck-ready sizes, or scale to 2K, 4K, and 8K with one click.'
    }
  ];

  const mapHighlights = [
    {
      icon: FiSliders,
      title: 'Professional colour scales',
      description:
        'Sequential, diverging, Viridis, Plasma, Turbo, and grayscale palettes are tuned for perception and accessibility.'
    },
    {
      icon: FiMap,
      title: 'Labels that respect every territory',
      description:
        'Auto offsets, connector lines, and capital metadata keep smaller states and union territories readable.'
    },
    {
      icon: FiDownload,
      title: '2K, 4K, and 8K PNG exports',
      description:
        'Generate crisp PNGs with smoothing optimised for print, deck screens, and broadcast dashboards.'
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Import your dataset',
      description: 'Paste spreadsheet values or start from guided examples tailored to business-critical questions.'
    },
    {
      number: '02',
      title: 'Shape the narrative',
      description: 'Switch chart types, refine palettes, add context, and preview updates instantly.'
    },
    {
      number: '03',
      title: 'Share with confidence',
      description:
        'Deliver visuals that stay sharp on any screen—ideal for leadership reviews, investor updates, or public storytelling.'
    }
  ];

  const audienceSegments = [
    {
      icon: FiBriefcase,
      title: 'Business leaders',
      description:
        'Run meetings with visuals that do the heavy lifting. Summaries stay concise while drill-downs remain one click away.'
    },
    {
      icon: FiUsers,
      title: 'Analysts & strategists',
      description:
        'Prototype faster, test hypotheses, and communicate findings without reformatting for each stakeholder.'
    },
    {
      icon: FiGlobe,
      title: 'Open community',
      description:
        'ChitraData remains free and accessible—whether you are exploring a market, a campaign, or a civic project.'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden pt-28 pb-24 lg:pt-32"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-white dark:from-blue-950 dark:via-gray-900 dark:to-gray-900 opacity-70" />
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-700/30" aria-hidden />
        <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-green-200/30 blur-3xl dark:bg-emerald-600/20" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200/70 bg-white/60 px-4 py-1 text-sm font-medium text-blue-700 backdrop-blur dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200">
                <span>ChitraData • Storytelling-grade charts at speed</span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Build beautiful charts that transform data into visual impact.
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Build narratives for leadership meetings, investor updates, and public dashboards without touching code. Every
                builder control is tuned for clarity, precision, and momentum.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Start a chart
                  <FiChevronRight className="ml-2" />
                </button>
                <button
                  onClick={() => navigate('/gallery')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-8 py-3 text-lg font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Preview gallery
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center space-x-3 rounded-lg border border-gray-200/70 bg-white/60 px-4 py-3 backdrop-blur dark:border-gray-700 dark:bg-gray-800/60"
                  >
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur dark:border-white/10 dark:bg-gray-900/70">
                <div className="absolute -top-6 right-6 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Live preview
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold uppercase tracking-wide text-white/70">Revenue pulse</span>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">Line • Quarterly</span>
                    </div>
                    <p className="mt-4 text-2xl font-bold">Explain the inflection point with confidence.</p>
                    <p className="mt-2 text-sm text-white/80">
                      Highlight variance, narrate momentum shifts, and attach context without wrestling with design tools.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Builder toolkit
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Data editor with spreadsheet-style inputs</li>
                        <li>• AI chart suggestions from your dataset</li>
                        <li>• Palette selector with curated swatches</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Built for velocity
                      </div>
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                        Move from dataset to decision-ready narrative in minutes, not days, and keep experimentation reversible.
                      </p>
                      <button
                        onClick={() => navigate('/map')}
                        className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Explore geo stories
                        <FiChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Value pillars */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Created for leadership-quality storytelling
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The chart builder, map studio, and gallery share the same goal—get you from raw numbers to a persuasive data story
              without leaving the browser.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            {valuePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:scale-110 dark:bg-blue-900/40 dark:text-blue-300">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{pillar.copy}</p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start space-x-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Chart library */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900/40"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Every major chart you need</h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Choose a chart because it serves the story—not because it is the only option available. Each type stays legible in
                light and dark mode, on slides or dashboards.
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center justify-center rounded-xl border border-blue-500 px-6 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-blue-300 dark:hover:bg-blue-500/10"
            >
              Launch creator
              <FiChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chartLibrary.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Professional
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Map studio */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Country-level storytelling without GIS overhead
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The map studio mirrors the chart creator: you control the data, the palette, and the export quality—complete with
                smart labelling for every state and union territory.
              </p>

              <div className="space-y-4">
                {mapHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/map')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Open map studio
                  <FiChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-8 text-white shadow-xl dark:border-blue-500/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">India coverage</h3>
                  <p className="text-sm text-blue-100">36 states and union territories, ready to customise.</p>
                </div>
                <div className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                  Map studio
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-blue-100">
                <li>• Sequential, diverging, Viridis, Plasma, Turbo, and grayscale palettes built-in</li>
                <li>• Auto label offsets with connectors keep compact regions legible</li>
                <li>• Export PNG with smoothing optimised for 2K, 4K, and 8K outputs</li>
              </ul>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-blue-50">
                <div className="rounded-2xl bg-white/10 p-4 shadow-lg shadow-blue-900/20">
                  <div className="text-3xl font-bold">6</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-blue-100">Palette families</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 shadow-lg shadow-blue-900/20">
                  <div className="text-3xl font-bold">8K</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-blue-100">Max export ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Builder highlights */}
      <motion.section
        className="py-24"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-10 text-white shadow-xl dark:border-blue-500/40">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold sm:text-4xl">A builder engineered for data storytelling</h2>
              <p className="mt-4 text-lg text-blue-100">
                Everything in the create experience points back to clarity: rapid iteration, precise controls, and exports that hold up in
                any boardroom.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {builderHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/10 p-6 shadow-lg shadow-blue-900/20 backdrop-blur transition hover:bg-white/15"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-blue-100/90">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Workflow */}
      <motion.section
        className="py-20 bg-gray-50 dark:bg-gray-900/40"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                From dataset to decision in three steps
              </h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                A streamlined flow keeps momentum high without sacrificing the craft that makes a data story resonate.
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Try the workflow
              <FiChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="text-4xl font-black text-blue-100 dark:text-blue-900/60" aria-hidden>
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Audience */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-4 lg:items-start">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Built for leaders, open to everyone
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Whether you guide a board meeting, design a strategy sprint, or explore a passion project, ChitraData keeps the bar high
                and the barrier low.
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {audienceSegments.map((segment) => (
                  <div
                    key={segment.title}
                    className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                      <segment.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{segment.title}</h3>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{segment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Closing CTA */}
      <motion.section
        className="pb-24"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-gray-700 dark:bg-gray-800/70">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Ready to build your next story?
                </h2>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                  It takes less than a minute to stand up your first chart. Keep it free, keep it fast, and keep it professional.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Open the chart builder
                  <FiChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-7 py-3 text-base font-semibold text-gray-800 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Explore the map studio
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