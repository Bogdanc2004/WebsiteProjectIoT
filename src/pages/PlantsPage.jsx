import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlants } from '../context/PlantContext';
import { fetchLatestReading } from '../services/api';
import PlantCard from '../components/plants/PlantCard';
import AddPlantModal from '../components/plants/AddPlantModal';

function CartIcon() {
  return (
    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function PlantsPage() {
  const { plants, loading, addPlant } = usePlants();
  const [showModal, setShowModal] = useState(false);
  const [readings, setReadings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch latest readings for each plant
  useEffect(() => {
    async function loadReadings() {
      const results = {};
      for (const plant of plants) {
        try {
          const reading = await fetchLatestReading(plant.id);
          results[plant.id] = reading;
        } catch {
          // Skip failed
        }
      }
      setReadings(results);
    }

    if (plants.length > 0) {
      loadReadings();
    }
  }, [plants]);

  const filteredPlants = plants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.deviceId && p.deviceId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold font-heading text-white tracking-tight">
              My Botanical Collection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-semibold">
              {plants.length} {plants.length === 1 ? 'plant' : 'plants'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Monitor sensor telemetry and care schedules for all connected plants
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search input */}
          {plants.length > 0 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search plants or sensors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 sm:w-60 bg-planta-surface border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
              />
            </div>
          )}

          <Link
            to="/shop"
            id="plants-buy-sensors-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-green-300 hover:text-white bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-400/50 shadow-sm transition-all"
          >
            <CartIcon />
            <span className="hidden sm:inline">Buy Sensors & Add-ons</span>
            <span className="sm:hidden">Buy</span>
          </Link>

          <button
            onClick={() => setShowModal(true)}
            id="add-plant-header-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            <PlusIcon />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400">Loading collection...</p>
        </div>
      ) : plants.length === 0 ? (
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
            Add your first plant to connect with an IoT telemetry sensor.
          </p>
          <button
            onClick={() => setShowModal(true)}
            id="add-first-plant-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green transition-all"
          >
            <PlusIcon /> Add Your First Plant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              latestReading={readings[plant.id]}
              onClick={() => navigate(`/plants/${plant.id}`)}
            />
          ))}

          {/* Add plant dashed tile */}
          <div
            onClick={() => setShowModal(true)}
            id="add-plant-tile"
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-green-500/50 bg-planta-surface/30 hover:bg-planta-surface/60 transition-all duration-300 cursor-pointer min-h-[280px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-green-500/20 text-gray-400 group-hover:text-green-300 flex items-center justify-center mb-3 transition-colors shadow-sm">
              <PlusIcon />
            </div>
            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
              Add Another Plant
            </span>
            <span className="text-xs text-gray-500 mt-1">Connect new IoT sensor</span>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      <AddPlantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={addPlant}
      />
    </div>
  );
}
