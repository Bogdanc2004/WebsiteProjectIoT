import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { usePlants } from '../context/PlantContext';
import { useSensorData } from '../hooks/useSensorData';
import SensorCard from '../components/dashboard/SensorCard';
import SensorChart from '../components/dashboard/SensorChart';
import WateringIndicator from '../components/dashboard/WateringIndicator';
import AiOverview from '../components/dashboard/AiOverview';

function CartIcon() {
  return (
    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const TIME_RANGES = [
  { label: '24 Hours', hours: 24, id: '24h' },
  { label: '7 Days', hours: 7 * 24, id: '7d' },
  { label: '30 Days', hours: 30 * 24, id: '30d' },
  { label: '200 Days', hours: 200 * 24, id: '200d' },
];

export default function DashboardPage() {
  const { plants } = usePlants();
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [selectedRange, setSelectedRange] = useState('200d');
  const [, setCurrentTime] = useState(new Date());

  // Select first plant by default
  useEffect(() => {
    if (plants.length > 0 && !selectedPlantId) {
      setSelectedPlantId(plants[0].id);
    }
    if (plants.length === 0) {
      setSelectedPlantId(null);
    }
  }, [plants, selectedPlantId]);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const activeRangeConfig = TIME_RANGES.find((r) => r.id === selectedRange) || TIME_RANGES[3];
  const { data, latest, loading, stats } = useSensorData(selectedPlantId, activeRangeConfig.hours, 30000);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {selectedPlant ? (
              <span className="flex items-center gap-2">
                <span>Telemetry stream for</span>
                <span className="text-green-300 font-semibold">{selectedPlant.name}</span>
                <span className="text-xs text-gray-500 font-mono">({selectedPlant.type})</span>
              </span>
            ) : (
              'Overview of your IoT environmental telemetry'
            )}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Quick link to hardware & sensors store */}
          <Link
            to="/shop"
            id="dashboard-buy-sensors-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-teal-500/10 hover:from-green-500/25 hover:to-emerald-500/20 border border-green-500/30 hover:border-green-400/50 text-xs font-semibold text-green-300 hover:text-white shadow-sm hover:shadow-glow-green transition-all"
          >
            <CartIcon />
            <span>Buy Sensors & Hardware</span>
          </Link>

          {/* Time range selector using Radix Tabs */}
          <Tabs.Root value={selectedRange} onValueChange={setSelectedRange}>
            <Tabs.List className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10 shadow-inner select-none">
              {TIME_RANGES.map((range) => (
                <Tabs.Trigger
                  key={range.id}
                  value={range.id}
                  id={`range-tab-${range.id}`}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-glow-green"
                >
                  {range.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span>Live Sync</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 hidden sm:inline">{formatDate()}</span>
          </div>
        </div>
      </div>

      {/* Plant selector tabs (if multiple plants) */}
      {plants.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {plants.map((plant) => {
            const isSelected = selectedPlantId === plant.id;
            return (
              <button
                key={plant.id}
                onClick={() => setSelectedPlantId(plant.id)}
                id={`plant-selector-${plant.id}`}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-green-500/25 to-green-500/10 text-green-300 border border-green-500/40 shadow-glow-green'
                    : 'bg-planta-surface/70 hover:bg-planta-surface text-gray-400 hover:text-gray-200 border border-white/10'
                }`}
              >
                <img
                  src={`/plants/${plant.type}.png`}
                  alt={plant.type}
                  className="w-5 h-5 object-contain pixelated"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <span>{plant.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-planta-surface/60 border border-dashed border-white/15 my-12">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 20h10" />
              <path d="M10 20c5.5-2.5.8-6.4 3-10" />
              <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-heading text-white">No plants added yet</h3>
          <p className="text-sm text-gray-400 max-w-md mt-1 mb-6">
            Add a plant and connect it to your IoT sensor device ID to start monitoring environment metrics.
          </p>
          <Link
            to="/plants"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green transition-all"
          >
            Go to My Plants
          </Link>
        </div>
      ) : loading && !latest ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400">Loading IoT telemetry data...</p>
        </div>
      ) : (
        <>
          {/* AI Botanical Overview */}
          <AiOverview
            plant={selectedPlant}
            stats={stats}
            latest={latest}
            loading={loading}
          />

          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SensorCard
              type="temperature"
              value={latest?.temperature}
              stats={stats?.temperature}
            />
            <SensorCard
              type="airHumidity"
              value={latest?.airHumidity}
              stats={stats?.airHumidity}
            />
            <SensorCard
              type="soilHumidity"
              value={latest?.soilHumidity}
              stats={stats?.soilHumidity}
            />
          </div>

          {/* Historical Interactive Chart */}
          <SensorChart data={data} />

          {/* Watering Pump & Connectivity status */}
          <WateringIndicator data={data} />
        </>
      )}
    </div>
  );
}
