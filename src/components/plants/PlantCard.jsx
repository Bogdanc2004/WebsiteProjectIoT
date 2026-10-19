import * as Tooltip from '@radix-ui/react-tooltip';

function PlantSvgIcon() {
  return (
    <svg className="w-16 h-16 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'healthy':
      return {
        label: 'Healthy',
        bg: 'bg-green-500/15 border-green-500/30 text-green-400',
        dot: 'bg-green-400 shadow-[0_0_8px_#4ade80]',
      };
    case 'warning':
      return {
        label: 'Attention',
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      };
    case 'critical':
      return {
        label: 'Critical',
        bg: 'bg-red-500/15 border-red-500/30 text-red-400',
        dot: 'bg-red-400 shadow-[0_0_8px_#f87171]',
      };
    default:
      return {
        label: 'Unknown',
        bg: 'bg-gray-500/15 border-gray-500/30 text-gray-400',
        dot: 'bg-gray-400',
      };
  }
}

function getMeasurementStatus(type, value) {
  if (type === 'temperature') {
    if (value > 35 || value < 10) return 'danger';
    if (value > 30 || value < 15) return 'warn';
    return 'good';
  }
  if (type === 'airHumidity') {
    if (value > 85 || value < 30) return 'danger';
    if (value > 75 || value < 40) return 'warn';
    return 'good';
  }
  if (type === 'soilHumidity') {
    if (value > 90 || value < 20) return 'danger';
    if (value > 80 || value < 30) return 'warn';
    return 'good';
  }
  return 'good';
}

export default function PlantCard({ plant, latestReading, onClick }) {
  let status = plant.status || 'healthy';

  if (latestReading) {
    const statuses = [
      getMeasurementStatus('temperature', latestReading.temperature),
      getMeasurementStatus('airHumidity', latestReading.airHumidity),
      getMeasurementStatus('soilHumidity', latestReading.soilHumidity),
    ];

    const dangerCount = statuses.filter((s) => s === 'danger').length;
    const warnCount = statuses.filter((s) => s === 'warn').length;

    if (dangerCount >= 1) {
      status = 'critical';
    } else if (warnCount >= 2) {
      status = 'warning';
    } else {
      status = 'healthy';
    }
  }

  const badge = getStatusBadge(status);

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        onClick={onClick}
        id={`plant-card-${plant.id}`}
        className="group relative flex flex-col rounded-2xl bg-planta-surface/75 hover:bg-planta-surface/95 border border-white/10 hover:border-green-500/40 p-5 shadow-glass hover:shadow-glow-green transition-all duration-300 hover:-translate-y-1.5 cursor-pointer backdrop-blur-xl"
      >
        {/* Top bar with Image & Status */}
        <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden mb-4 p-4">
          <img
            src={`/plants/${plant.type}.png`}
            alt={plant.type}
            className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none' }}>
            <PlantSvgIcon />
          </div>

          <div
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${badge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </div>

          {plant.deviceId && (
            <div className="absolute bottom-2 left-3 text-[11px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              {plant.deviceId}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-white group-hover:text-green-300 transition-colors">
              {plant.name}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{plant.type}</p>
          </div>

          {latestReading ? (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
              {/* Temperature */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <span className="text-[11px] text-orange-300 font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                      </svg>
                      Temp
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5">
                      {latestReading.temperature?.toFixed(1)}°C
                    </span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={5}
                    className="z-50 px-2.5 py-1 text-xs text-white bg-planta-surface border border-white/20 rounded-md shadow-xl"
                  >
                    Target: 15–30°C
                    <Tooltip.Arrow className="fill-planta-surface" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* Air Humidity */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                    <span className="text-[11px] text-sky-300 font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      Air
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5">
                      {latestReading.airHumidity?.toFixed(1)}%
                    </span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={5}
                    className="z-50 px-2.5 py-1 text-xs text-white bg-planta-surface border border-white/20 rounded-md shadow-xl"
                  >
                    Target: 40–75%
                    <Tooltip.Arrow className="fill-planta-surface" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              {/* Soil Humidity */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <span className="text-[11px] text-purple-300 font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                      </svg>
                      Soil
                    </span>
                    <span className="text-sm font-bold text-white mt-0.5">
                      {latestReading.soilHumidity?.toFixed(1)}%
                    </span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={5}
                    className="z-50 px-2.5 py-1 text-xs text-white bg-planta-surface border border-white/20 rounded-md shadow-xl"
                  >
                    Target: 30–80%
                    <Tooltip.Arrow className="fill-planta-surface" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-gray-500">
              Waiting for live reading...
            </div>
          )}
        </div>
      </div>
    </Tooltip.Provider>
  );
}
