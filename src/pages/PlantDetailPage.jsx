import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { fetchPlant } from '../services/api';
import { useSensorData } from '../hooks/useSensorData';
import { usePlants } from '../context/PlantContext';
import SensorCard from '../components/dashboard/SensorCard';
import SensorChart from '../components/dashboard/SensorChart';
import WateringIndicator from '../components/dashboard/WateringIndicator';
import AiOverview from '../components/dashboard/AiOverview';

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12,19 5,12 12,5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

const TIME_RANGES = [
  { label: '24 Hours', hours: 24, id: '24h' },
  { label: '7 Days', hours: 7 * 24, id: '7d' },
  { label: '30 Days', hours: 30 * 24, id: '30d' },
  { label: '200 Days', hours: 200 * 24, id: '200d' },
];

export default function PlantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [plantLoading, setPlantLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedRange, setSelectedRange] = useState('200d');
  const { removePlant } = usePlants();

  const activeRangeConfig = TIME_RANGES.find((r) => r.id === selectedRange) || TIME_RANGES[3];
  const { data, latest, loading: sensorLoading, stats } = useSensorData(id, activeRangeConfig.hours, 30000);

  useEffect(() => {
    async function load() {
      try {
        const p = await fetchPlant(id);
        setPlant(p);
      } catch {
        navigate('/plants');
      } finally {
        setPlantLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  async function handleDeleteConfirm() {
    try {
      setDeleting(true);
      await removePlant(id);
      navigate('/plants');
    } catch (err) {
      alert('Failed to delete plant: ' + err.message);
      setDeleting(false);
    }
  }

  if (plantLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!plant) return null;

  const createdDate = new Date(plant.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/plants"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeftIcon />
          <span>Back to All Plants</span>
        </Link>
      </div>

      {/* Plant Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-planta-surface/75 border border-white/10 shadow-glass backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-2 flex items-center justify-center shrink-0">
            <img
              src={`/plants/${plant.type}.png`}
              alt={plant.type}
              className="w-full h-full object-contain pixelated"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {plant.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 font-medium">
                {plant.type}
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-gray-400 mt-2">
              <span>Added {createdDate}</span>
              {plant.deviceId && (
                <>
                  <span>•</span>
                  <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5 text-gray-300">
                    Device: {plant.deviceId}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Radix AlertDialog */}
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <Tabs.Root value={selectedRange} onValueChange={setSelectedRange}>
            <Tabs.List className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10 shadow-inner select-none">
              {TIME_RANGES.map((range) => (
                <Tabs.Trigger
                  key={range.id}
                  value={range.id}
                  id={`plant-detail-range-tab-${range.id}`}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-glow-green"
                >
                  {range.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Radix Alert Dialog for Delete */}
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                id="delete-plant-button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 transition-colors focus:outline-none"
              >
                <TrashIcon />
                <span>Delete</span>
              </button>
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
              <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-planta-surface border border-red-500/30 p-6 shadow-2xl backdrop-blur-2xl focus:outline-none data-[state=open]:animate-contentShow">
                <AlertDialog.Title className="text-lg font-bold font-heading text-red-400 flex items-center gap-2">
                  <TrashIcon />
                  Confirm Plant Removal
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-gray-300 mt-3 leading-relaxed">
                  Are you sure you want to remove <strong className="text-white">{plant.name}</strong>?
                  All historical sensor readings and AI diagnostics will be permanently deleted.
                </AlertDialog.Description>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      disabled={deleting}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={deleting}
                      className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
                    >
                      {deleting ? 'Removing...' : 'Yes, Delete'}
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>

      {sensorLoading && !latest ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400">Loading plant telemetry...</p>
        </div>
      ) : (
        <>
          {/* AI Botanical Overview */}
          <AiOverview
            plant={plant}
            stats={stats}
            latest={latest}
            loading={sensorLoading}
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

          {/* Chart */}
          <SensorChart data={data} />

          {/* Watering Status */}
          <WateringIndicator data={data} />
        </>
      )}
    </div>
  );
}
