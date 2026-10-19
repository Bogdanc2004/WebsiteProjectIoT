function WaterDropIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'N/A';
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function WateringIndicator({ data }) {
  if (!data || data.length === 0) return null;

  const latest = data[data.length - 1];
  const isActive = latest.relay === 1;

  let lastWateringTime = null;
  let wateringCount = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].relay === 1) {
      wateringCount++;
      if (!lastWateringTime) {
        lastWateringTime = data[i].timestamp;
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Water Pump Card */}
      <div className="rounded-2xl bg-planta-surface/75 border border-white/10 p-5 shadow-glass backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-green-500/20 text-green-400 shadow-glow-green animate-pulse'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              <WaterDropIcon />
            </div>
            <div>
              <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                Automated Pump
              </div>
              <div className="text-base font-bold font-heading text-white">
                Submersible Relay
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isActive
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-gray-500'
              }`}
            />
            {isActive ? 'Watering Active' : 'Standby'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Last cycle</div>
            <div className="text-sm font-semibold text-white mt-1">
              {formatTimeAgo(lastWateringTime)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Cycles count</div>
            <div className="text-sm font-semibold text-white mt-1">{wateringCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Soil moisture</div>
            <div className="text-sm font-semibold text-purple-300 mt-1">
              {latest.soilHumidity != null ? `${latest.soilHumidity.toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Health Card */}
      <div className="rounded-2xl bg-planta-surface/75 border border-white/10 p-5 shadow-glass backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 shadow-glow-air">
              <ClockIcon />
            </div>
            <div>
              <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                Telemetry Link
              </div>
              <div className="text-base font-bold font-heading text-white">
                IoT Gateway Sync
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            Connected
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Last packet</div>
            <div className="text-sm font-semibold text-white mt-1">
              {formatTimeAgo(latest.timestamp)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Readings in range</div>
            <div className="text-sm font-semibold text-white mt-1">{data.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-black/25 border border-white/5">
            <div className="text-[11px] text-gray-400">Device ID</div>
            <div className="text-sm font-mono font-semibold text-gray-200 mt-1 truncate">
              {latest.device || 'Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
