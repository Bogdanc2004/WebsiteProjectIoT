import { useRef, useEffect, useState, useCallback } from 'react';
import * as Switch from '@radix-ui/react-switch';

const COLORS = {
  temperature: {
    line: '#f97316',
    fill: 'rgba(249, 115, 22, 0.1)',
    gradient: ['rgba(249, 115, 22, 0.35)', 'rgba(249, 115, 22, 0)'],
  },
  airHumidity: {
    line: '#38bdf8',
    fill: 'rgba(56, 189, 248, 0.1)',
    gradient: ['rgba(56, 189, 248, 0.35)', 'rgba(56, 189, 248, 0)'],
  },
  soilHumidity: {
    line: '#a78bfa',
    fill: 'rgba(167, 139, 250, 0.1)',
    gradient: ['rgba(167, 139, 250, 0.35)', 'rgba(167, 139, 250, 0)'],
  },
};

const SERIES_LABELS = {
  temperature: { label: 'Temperature', unit: '°C' },
  airHumidity: { label: 'Air Humidity', unit: '%' },
  soilHumidity: { label: 'Soil Humidity', unit: '%' },
};

function formatTime(timestamp, isMultiDay = false) {
  const d = new Date(timestamp);
  if (isMultiDay) {
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatFullTime(timestamp) {
  const d = new Date(timestamp);
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function SensorChart({ data }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [hiddenSeries, setHiddenSeries] = useState(new Set());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0 || dimensions.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 24, right: 24, bottom: 44, left: 52 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const seriesKeys = ['temperature', 'airHumidity', 'soilHumidity'].filter(
      (k) => !hiddenSeries.has(k)
    );
    if (seriesKeys.length === 0) {
      ctx.fillStyle = 'rgba(148, 163, 176, 0.4)';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('All series hidden. Toggle series below to view data.', w / 2, h / 2);
      return;
    }

    // Calculate Y range
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const key of seriesKeys) {
      for (const d of data) {
        const v = d[key];
        if (v != null) {
          if (v < yMin) yMin = v;
          if (v > yMax) yMax = v;
        }
      }
    }

    if (yMin === Infinity) {
      yMin = 0;
      yMax = 100;
    }

    const yPad = (yMax - yMin) * 0.12 || 5;
    yMin = Math.floor(yMin - yPad);
    yMax = Math.ceil(yMax + yPad);

    function xPos(i) {
      if (data.length <= 1) return padding.left + chartW / 2;
      return padding.left + (i / (data.length - 1)) * chartW;
    }

    function yPos(v) {
      return padding.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + ((yMax - yMin) * i) / yTicks;
      const y = yPos(yVal);

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 176, 0.6)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(yVal.toFixed(0), padding.left - 10, y);
    }

    // X labels
    const isMultiDay =
      data.length > 1 &&
      data[data.length - 1].timestamp - data[0].timestamp > 24 * 60 * 60 * 1000;
    const xLabelCount = Math.min(6, data.length);
    const xStep = Math.max(1, Math.floor(data.length / xLabelCount));
    ctx.fillStyle = 'rgba(148, 163, 176, 0.6)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < data.length; i += xStep) {
      const x = xPos(i);
      ctx.fillText(formatTime(data[i].timestamp, isMultiDay), x, h - padding.bottom + 12);
    }

    // Draw lines & fills
    for (const key of seriesKeys) {
      const color = COLORS[key];
      const validPoints = [];

      for (let i = 0; i < data.length; i++) {
        const val = data[i][key];
        if (val != null) {
          validPoints.push({ x: xPos(i), y: yPos(val) });
        }
      }

      if (validPoints.length === 0) continue;

      // Fill gradient
      ctx.beginPath();
      ctx.moveTo(validPoints[0].x, validPoints[0].y);

      for (let i = 1; i < validPoints.length; i++) {
        const prev = validPoints[i - 1];
        const curr = validPoints[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }

      ctx.lineTo(validPoints[validPoints.length - 1].x, padding.top + chartH);
      ctx.lineTo(validPoints[0].x, padding.top + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, color.gradient[0]);
      gradient.addColorStop(1, color.gradient[1]);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(validPoints[0].x, validPoints[0].y);

      for (let i = 1; i < validPoints.length; i++) {
        const prev = validPoints[i - 1];
        const curr = validPoints[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }

      ctx.strokeStyle = color.line;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }, [data, dimensions, hiddenSeries]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handleMouseMove(e) {
    if (!data || data.length === 0 || dimensions.width === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const padding = { left: 52, right: 24 };
    const chartW = dimensions.width - padding.left - padding.right;
    const relX = mouseX - padding.left;

    if (relX < 0 || relX > chartW) {
      setTooltip(null);
      return;
    }

    const idx = Math.min(
      data.length - 1,
      Math.max(0, Math.round((relX / chartW) * (data.length - 1)))
    );
    const d = data[idx];
    if (!d) {
      setTooltip(null);
      return;
    }

    setTooltip({
      x: mouseX,
      y: e.clientY - rect.top,
      time: formatFullTime(d.timestamp),
      temperature: d.temperature != null ? d.temperature.toFixed(1) : '—',
      airHumidity: d.airHumidity != null ? d.airHumidity.toFixed(1) : '—',
      soilHumidity: d.soilHumidity != null ? d.soilHumidity.toFixed(1) : '—',
      relay: d.relay,
    });
  }

  function toggleSeries(key) {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="rounded-2xl bg-planta-surface/75 border border-white/10 p-5 sm:p-6 shadow-glass backdrop-blur-xl mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            Historical Sensor Trends
            <span className="text-xs font-normal text-gray-400">
              ({data?.length || 0} telemetry points)
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time multi-metric correlation over time
          </p>
        </div>

        {/* Series toggle controls using Radix Switch */}
        <div className="flex items-center flex-wrap gap-3">
          {Object.entries(SERIES_LABELS).map(([key, config]) => {
            const isVisible = !hiddenSeries.has(key);
            const color = COLORS[key].line;

            return (
              <div
                key={key}
                onClick={() => toggleSeries(key)}
                id={`chart-legend-${key}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  isVisible
                    ? 'bg-white/5 border-white/15 text-white shadow-sm'
                    : 'bg-white/[0.02] border-white/5 text-gray-500 opacity-60'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: isVisible ? `0 0 8px ${color}` : 'none',
                  }}
                />
                <span>{config.label}</span>
                <Switch.Root
                  checked={isVisible}
                  onCheckedChange={() => toggleSeries(key)}
                  className="w-7 h-4 bg-white/10 data-[state=checked]:bg-green-500 rounded-full relative outline-none cursor-pointer transition-colors"
                >
                  <Switch.Thumb className="block w-3 h-3 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-3.5" />
                </Switch.Root>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="relative w-full h-72 sm:h-80 cursor-crosshair"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl bg-planta-surface/95 border border-white/15 p-3.5 shadow-2xl backdrop-blur-xl text-xs space-y-1.5"
            style={{
              left: `${Math.min(tooltip.x + 14, dimensions.width - 200)}px`,
              top: `${Math.max(tooltip.y - 100, 10)}px`,
            }}
          >
            <div className="font-semibold text-gray-300 pb-1 border-b border-white/10">
              {tooltip.time}
            </div>
            {!hiddenSeries.has('temperature') && (
              <div className="flex items-center justify-between gap-4 text-orange-400 font-medium">
                <span>Temperature:</span>
                <span className="font-bold">{tooltip.temperature} °C</span>
              </div>
            )}
            {!hiddenSeries.has('airHumidity') && (
              <div className="flex items-center justify-between gap-4 text-sky-400 font-medium">
                <span>Air Humidity:</span>
                <span className="font-bold">{tooltip.airHumidity} %</span>
              </div>
            )}
            {!hiddenSeries.has('soilHumidity') && (
              <div className="flex items-center justify-between gap-4 text-purple-400 font-medium">
                <span>Soil Humidity:</span>
                <span className="font-bold">{tooltip.soilHumidity} %</span>
              </div>
            )}
            {tooltip.relay === 1 && (
              <div className="pt-1 border-t border-white/10 flex items-center gap-1.5 text-green-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                <span>Watering pump was active</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
