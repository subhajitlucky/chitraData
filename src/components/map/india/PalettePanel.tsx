type PalettePanelProps = {
  colorScheme: string;
  onChange: (scheme: 'sequential' | 'diverging' | 'viridis' | 'plasma' | 'turbo' | 'grayscale') => void;
};

export function PalettePanel({ colorScheme, onChange }: PalettePanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colour scheme</h3>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Choose a palette that fits your story. Switch anytime.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <PaletteButton
          active={colorScheme === 'sequential'}
          label="Blue"
          subLabel="Sequential"
          swatchClass="from-blue-200 to-blue-600"
          onClick={() => onChange('sequential')}
        />
        <PaletteButton
          active={colorScheme === 'diverging'}
          label="Diverging"
          subLabel="Red ↔ Blue"
          swatchClass="from-red-400 via-purple-300 to-blue-500"
          onClick={() => onChange('diverging')}
        />
        <PaletteButton
          active={colorScheme === 'viridis'}
          label="Viridis"
          subLabel="Scientific"
          swatchClass="from-purple-800 via-teal-500 to-yellow-400"
          onClick={() => onChange('viridis')}
        />
        <PaletteButton
          active={colorScheme === 'plasma'}
          label="Plasma"
          subLabel="ML/AI"
          swatchClass="from-purple-900 via-pink-500 to-yellow-300"
          onClick={() => onChange('plasma')}
        />
        <PaletteButton
          active={colorScheme === 'turbo'}
          label="Turbo"
          subLabel="Rainbow"
          swatchClass="from-blue-900 via-green-400 via-yellow-300 to-red-500"
          onClick={() => onChange('turbo')}
        />
        <PaletteButton
          active={colorScheme === 'grayscale'}
          label="Grayscale"
          subLabel="Print"
          swatchClass="from-black to-white"
          onClick={() => onChange('grayscale')}
        />
      </div>
    </div>
  );
}

type PaletteButtonProps = {
  active: boolean;
  label: string;
  subLabel: string;
  swatchClass: string;
  onClick: () => void;
};

function PaletteButton({ active, label, subLabel, swatchClass, onClick }: PaletteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition ${
        active
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded bg-gradient-to-r ${swatchClass}`} />
        <div>
          <div className="text-xs font-semibold text-gray-900 dark:text-white">{label}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{subLabel}</div>
        </div>
      </div>
    </button>
  );
}

