import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { getPlantTypes } from '../../services/api';

function CloseIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-400 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AddPlantModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const plantTypes = getPlantTypes();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Plant name is required');
      return;
    }

    if (!type) {
      setError('Please select a plant type');
      return;
    }

    if (!deviceId.trim()) {
      setError('Device ID is required to connect to your sensor');
      return;
    }

    try {
      setLoading(true);
      await onAdd({ name: name.trim(), type, deviceId: deviceId.trim() || undefined });
      setName('');
      setType('');
      setDeviceId('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl bg-planta-surface/95 border border-green-500/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl focus:outline-none data-[state=open]:animate-contentShow">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <Dialog.Title className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-glow-green" />
              Add New Plant
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-1 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
                aria-label="Close"
                id="modal-close-btn"
              >
                <CloseIcon />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-gray-400 mb-6">
            Connect an IoT sensor to monitor real-time soil, air humidity, and temperature.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="plant-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Plant Name
              </label>
              <input
                id="plant-name"
                type="text"
                placeholder="e.g., Living Room Monstera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Plant Species / Type
              </label>
              <Select.Root value={type} onValueChange={setType}>
                <Select.Trigger
                  id="plant-type-select"
                  className="w-full flex items-center justify-between px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white text-sm hover:border-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-500/25 transition-all"
                  aria-label="Select plant type"
                >
                  <div className="flex items-center gap-3">
                    {type ? (
                      <>
                        <img
                          src={`/plants/${type}.png`}
                          alt={type}
                          className="w-6 h-6 object-contain pixelated"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <span className="font-medium">{type}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select species...</span>
                    )}
                  </div>
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    position="popper"
                    sideOffset={5}
                    className="z-[60] w-[var(--radix-select-trigger-width)] max-h-64 overflow-y-auto bg-planta-surface border border-white/15 rounded-xl shadow-2xl p-1.5 backdrop-blur-2xl"
                  >
                    <Select.Viewport className="space-y-1">
                      {plantTypes.map((t) => (
                        <Select.Item
                          key={t}
                          value={t}
                          className="relative flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 rounded-lg cursor-pointer outline-none hover:bg-green-500/20 hover:text-green-300 data-[highlighted]:bg-green-500/20 data-[highlighted]:text-green-300 transition-colors"
                        >
                          <img
                            src={`/plants/${t}.png`}
                            alt={t}
                            className="w-6 h-6 object-contain pixelated"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                          <Select.ItemText>{t}</Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label htmlFor="device-id" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Device ID <span className="text-red-400 font-bold">*</span>
              </label>
              <input
                id="device-id"
                type="text"
                placeholder="e.g., Planterra"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full px-4 py-3 bg-planta-dark/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/25 transition-all text-sm"
              />
              <p className="text-xs text-gray-400">
                Must match the Device name registered in your IoT broker/AWS.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                id="add-plant-submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  'Add Plant'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
