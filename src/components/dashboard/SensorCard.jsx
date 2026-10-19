import * as Tooltip from '@radix-ui/react-tooltip';

function ThermometerIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function MoistureIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      <path d="M9.1 16.9a3 3 0 0 1-.9-2.2c0-1 .5-2 1.5-2.8" />
    </svg>
  );
}

const SENSOR_CONFIG = {
  temperature: {
    icon: <ThermometerIcon />,
    label: 'Temperature',
    unit: '°C',
    target: '15–30',
    accentColor: 'text-orange-400',
    bgColor: 'from-orange-500/15 via-orange-500/5 to-transparent',
    borderColor: 'border-orange-500/20 hover:border-orange-500/50',
    iconBg: 'bg-orange-500/20 text-orange-400 shadow-glow-temp',
  },
  airHumidity: {
    icon: <DropletIcon />,
    label: 'Air Humidity',
    unit: '%',
    target: '40–75',
    accentColor: 'text-sky-400',
    bgColor: 'from-sky-500/15 via-sky-500/5 to-transparent',
    borderColor: 'border-sky-500/20 hover:border-sky-500/50',
    iconBg: 'bg-sky-500/20 text-sky-400 shadow-glow-air',
  },
  soilHumidity: {
    icon: <MoistureIcon />,
    label: 'Soil Humidity',
    unit: '%',
    target: '30–80',
    accentColor: 'text-purple-400',
    bgColor: 'from-purple-500/15 via-purple-500/5 to-transparent',
    borderColor: 'border-purple-500/20 hover:border-purple-500/50',
    iconBg: 'bg-purple-500/20 text-purple-400 shadow-glow-soil',
  },
};

function getStatus(type, value) {
  if (value == null) return { status: 'unknown', text: 'No data', dot: 'bg-gray-400' };

  if (type === 'temperature') {
    if (value > 35 || value < 10) return { status: 'danger', text: 'Extreme Temp', dot: 'bg-red-400 shadow-[0_0_8px_#f87171]' };
    if (value > 30 || value < 15) return { status: 'warn', text: 'Suboptimal', dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' };
    return { status: 'good', text: 'Optimal', dot: 'bg-green-400 shadow-[0_0_8px_#4ade80]' };
  }
  if (type === 'airHumidity') {
    if (value > 85 || value < 30) return { status: 'danger', text: 'Severe Humidity', dot: 'bg-red-400 shadow-[0_0_8px_#f87171]' };
    if (value > 75 || value < 40) return { status: 'warn', text: 'Suboptimal', dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' };
    return { status: 'good', text: 'Optimal', dot: 'bg-green-400 shadow-[0_0_8px_#4ade80]' };
  }
  if (type === 'soilHumidity') {
    if (value > 90 || value < 20) return { status: 'danger', text: 'Critically Dry/Wet', dot: 'bg-red-400 shadow-[0_0_8px_#f87171]' };
    if (value > 80 || value < 30) return { status: 'warn', text: 'Needs Watering Soon', dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' };
    return { status: 'good', text: 'Optimal Moisture', dot: 'bg-green-400 shadow-[0_0_8px_#4ade80]' };
  }
  return { status: 'good', text: 'Optimal', dot: 'bg-green-400 shadow-[0_0_8px_#4ade80]' };
}

export default function SensorCard({ type, value, stats }) {
  const config = SENSOR_CONFIG[type];
  if (!config) return null;

  const status = getStatus(type, value);
  const displayValue = typeof value === 'number' ? value.toFixed(1) : '--';

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        id={`sensor-card-${type}`}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${config.bgColor} bg-planta-surface/75 border ${config.borderColor} p-6 shadow-glass backdrop-blur-xl transition-all duration-300 hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${config.iconBg}`}>
            {config.icon}
          </div>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 cursor-help">
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span className="text-xs font-medium text-gray-300">{status.text}</span>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={5}
                className="z-50 px-3 py-1.5 text-xs text-white bg-planta-surface border border-white/20 rounded-lg shadow-xl"
              >
                Target range: {config.target}{config.unit}
                <Tooltip.Arrow className="fill-planta-surface" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {config.label}
          </span>
          <span className="text-xs text-gray-500 font-mono">Target: {config.target}{config.unit}</span>
        </div>

        <div className="flex items-baseline gap-1 my-2">
          <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            {displayValue}
          </span>
          <span className={`text-xl font-bold ${config.accentColor}`}>
            {config.unit}
          </span>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10">
            <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-gray-400">Min</div>
              <div className="text-sm font-bold text-gray-200 mt-0.5">{stats.min}{config.unit}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-gray-400">Avg</div>
              <div className="text-sm font-bold text-gray-200 mt-0.5">{stats.avg}{config.unit}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-gray-400">Max</div>
              <div className="text-sm font-bold text-gray-200 mt-0.5">{stats.max}{config.unit}</div>
            </div>
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
}
