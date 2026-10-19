import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

function CloseIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

const RETAILERS = [
  { name: 'Optimus Digital (RO / Fast Delivery)', url: 'https://www.optimusdigital.ro', badge: 'Next-Day Delivery' },
  { name: 'Amazon Europe', url: 'https://www.amazon.de', badge: 'Prime Available' },
  { name: 'AliExpress Direct', url: 'https://www.aliexpress.com', badge: 'Best Price' },
  { name: 'Adafruit / SparkFun', url: 'https://www.adafruit.com', badge: 'Official Partner' },
];

export const TURNKEY_BUNDLES = [
  {
    id: 'bundle-solo',
    name: 'Planta Solo Turnkey Pack (1 Plant)',
    shortName: '1 Plant (BLE)',
    category: 'Turnkey Bundles',
    categoryKey: 'bundles',
    price: 34.99,
    icon: '🌱',
    badge: '1 Plant • Bluetooth',
    badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-glow-green',
    isBundle: true,
    telecomType: 'ble',
    connectivity: 'Bluetooth Low Energy 5.0 + Wi-Fi',
    coverage: 'Indoor Pot (10-15m)',
    capacity: '1 Plant Dedicated',
    description: 'Complete ready-to-run system for 1 plant. Includes smart BLE/Wi-Fi telemetry node, capacitive probe, ultra-quiet mini-pump, and food-grade silicone tubing. Pre-provisioned to your AWS dashboard.',
    specs: [
      { label: 'Plants', value: '1 Plant dedicated' },
      { label: 'Telecom', value: 'Bluetooth 5.0 + Wi-Fi' },
      { label: 'Pump', value: 'Silent 5V Submersible' },
      { label: 'Power', value: 'USB-C (Cable included)' },
    ],
    included: [
      '1x Planta Smart Controller Node (ESP32-S3 BLE/Wi-Fi)',
      '1x Anti-corrosion Capacitive Soil Moisture Sensor v2',
      '1x 5V DC Ultra-Silent Submersible Water Pump',
      '1.5m Food-grade Silicone Watering Tube',
      '1x USB-C Power Adapter & Braided Cable',
      'Pre-configured AWS IoT Device Credentials',
    ],
  },
  {
    id: 'bundle-home5',
    name: 'Planta Home Garden Pack (5 Plants)',
    shortName: '5 Plants (BLE Mesh)',
    category: 'Turnkey Bundles',
    categoryKey: 'bundles',
    price: 109.99,
    icon: '🪴',
    badge: '5 Plants • BLE Mesh',
    badgeColor: 'bg-teal-500/25 text-teal-300 border-teal-500/40 shadow-glow-green',
    isBundle: true,
    telecomType: 'ble',
    connectivity: 'Bluetooth BLE Mesh + Local Hub',
    coverage: 'Apartment / Balcony (30-50m)',
    capacity: 'Up to 5 Plants',
    description: 'Complete multi-plant indoor ecosystem. Includes 1 central wireless hub and 5 independent wireless Bluetooth soil & climate pods. No wires between pots! Includes 5-zone automated irrigation distributor.',
    specs: [
      { label: 'Plants', value: 'Up to 5 Plants' },
      { label: 'Telecom', value: 'BLE Mesh + Local Hub' },
      { label: 'Irrigation', value: '5-Channel Distributor' },
      { label: 'Batteries', value: '1-Year Coin Cell per pod' },
    ],
    included: [
      '1x Central Raspberry Pi / Planta Hub Gateway',
      '5x Wireless BLE Moisture & Climate Pods (CR2477 coin cell, 1+ year life)',
      '1x 5-Way Micro-Valve Irrigation Manifold',
      '5x 2m Drip-Line Tubing with Adjustable Emitters',
      '1x 12V High-Pressure Diaphragm Pump',
      'Free AWS Cloud Telemetry Setup',
    ],
  },
  {
    id: 'bundle-pro10',
    name: 'Planta Villa & Greenhouse Pro (10 Plants)',
    shortName: '10 Plants (Pro BLE)',
    category: 'Turnkey Bundles',
    categoryKey: 'bundles',
    price: 189.99,
    icon: '🌿',
    badge: '10 Plants • Extended BLE',
    badgeColor: 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40 shadow-glow-green',
    isBundle: true,
    telecomType: 'ble',
    connectivity: 'Long-Range Bluetooth Mesh + Wi-Fi 6',
    coverage: 'Terrace / Greenhouse / Villa (80m)',
    capacity: 'Up to 10 Plants',
    description: 'Professional botanical management for 10 plants or greenhouse beds. Raspberry Pi 4 Edge Gateway, 10 wireless BLE sensor probes, sunlight tracking, and automated 10-line smart watering.',
    specs: [
      { label: 'Plants', value: 'Up to 10 Plants' },
      { label: 'Telecom', value: 'Long-Range BLE Mesh' },
      { label: 'Light Sensor', value: 'BH1750 Sun Tracker' },
      { label: 'Irrigation', value: '10-Zone Micro-Drip' },
    ],
    included: [
      '1x Raspberry Pi 4 (4GB) Central Edge Gateway in Custom Enclosure',
      '10x Long-Range Wireless Bluetooth Soil & Temp Pods',
      '1x Ambient Sunlight BH1750 Solar Tracker',
      '10-Zone Automated Valve Irrigation Manifold + 20m Micro-tubing',
      'Dual High-Performance Water Pump Setup',
      'Instant SMS & Mobile Push Notification Configuration',
    ],
  },
  {
    id: 'bundle-lora-starter',
    name: 'Planta AgriField LoRaWAN Starter (1 - 3 Hectares)',
    shortName: '1 - 3 Ha (LoRaWAN)',
    category: 'LoRaWAN Agriculture',
    categoryKey: 'lorawan',
    price: 389.00,
    icon: '📡',
    badge: '1-3 Ha • 10km LoRaWAN',
    badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-glow-green',
    isBundle: true,
    telecomType: 'lora',
    connectivity: 'LoRaWAN 868 MHz (EU) / Long Range',
    coverage: '1 to 3 Hectares (up to 10-12 km LOS)',
    capacity: '1 - 3 Hectares (Fields & Orchards)',
    description: 'Turnkey agricultural IoT system for open fields, orchards, and vineyards. Solar-powered LoRaWAN outdoor gateway with 5.8dBi fiberglass antenna and 4 ruggedized IP68 deep soil probes. 0 SIM subscription fees per node!',
    specs: [
      { label: 'Coverage', value: '1 - 3 Hectares' },
      { label: 'Telecom', value: 'LoRaWAN 868MHz (EU)' },
      { label: 'Radio Range', value: 'Up to 10 - 12 km LOS' },
      { label: 'Sensors', value: '4x Soil EC & Moisture' },
    ],
    included: [
      '1x Industrial Outdoor LoRaWAN 868MHz Gateway (IP67, PoE/Solar)',
      '1x 5.8 dBi High-Gain Omni Fiberglass Antenna + Mounting Bracket',
      '4x Rugged IP68 LoRaWAN Soil Probes (Moisture, Temp & Salinity EC)',
      '4x Integrated Monocrystalline Solar Panels & LiFePO4 5-Year Batteries',
      'Pre-configured AWS IoT Core for LoRaWAN Pipeline',
      'Satellite Map Overlay & Crop Irrigation Presets',
    ],
  },
  {
    id: 'bundle-lora-enterprise',
    name: 'Planta Industrial FarmFleet LoRaWAN (5 - 25+ Hectares)',
    shortName: '5 - 25+ Ha (Enterprise)',
    category: 'LoRaWAN Agriculture',
    categoryKey: 'lorawan',
    price: 849.00,
    icon: '🚜',
    badge: '5-25+ Ha • Enterprise',
    badgeColor: 'bg-violet-500/25 text-violet-300 border-violet-500/40 shadow-glow-green',
    isBundle: true,
    telecomType: 'lora',
    connectivity: 'Industrial LoRaWAN 868MHz + 4G/LTE Fallback',
    coverage: '5 to 25+ Hectares (up to 15 km LOS)',
    capacity: '5 - 25+ Hectares (Large Agricultural Estate)',
    description: 'Complete enterprise farm automation fleet. Includes 15km heavy-duty LoRaWAN gateway, 12 multi-depth soil profile probes (root zone analysis at 20cm, 40cm, 60cm), all-in-one agrometeorological station (wind, rain, solar), and LoRaWAN solenoid valve controllers.',
    specs: [
      { label: 'Coverage', value: '5 - 25+ Hectares' },
      { label: 'Telecom', value: 'LoRaWAN 868MHz + 4G/LTE' },
      { label: 'Radio Range', value: 'Up to 15 km Line-of-Sight' },
      { label: 'Weather', value: 'Full Agri Weather Station' },
    ],
    included: [
      '1x Carrier-Grade LoRaWAN Gateway with 8dBi Antenna & 4G/LTE Backup',
      '12x Multi-Depth Soil Profile Transmitters (20cm, 40cm, 60cm root zones)',
      '1x Ultrasonic Agrometeorological Station (Wind speed/dir, rain gauge, solar radiation)',
      '2x High-Flow LoRaWAN Wireless Solenoid Valve Actuators (for automated field irrigation)',
      'Industrial Solar Charging & 10-Year Battery System',
      'AWS IoT Core LoRaWAN Multi-Tenant Fleet Dashboard with Geo-Fencing',
    ],
  },
];

export default function BuyModal({ product, isOpen, onClose }) {
  const [activeProduct, setActiveProduct] = useState(product);
  const [quantity, setQuantity] = useState(1);
  const [extraProbe, setExtraProbe] = useState(false);
  const [solarUpgrade, setSolarUpgrade] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [simOrderId, setSimOrderId] = useState('PLT-SIM-9482');

  useEffect(() => {
    setActiveProduct(product);
    setQuantity(1);
    setExtraProbe(false);
    setSolarUpgrade(false);
    setOrderConfirmed(false);
    setSimOrderId(`PLT-SIM-${Math.floor(10000 + Math.random() * 90000)}`);
  }, [product]);

  if (!activeProduct) return null;

  const isBundle = activeProduct.isBundle || activeProduct.categoryKey === 'bundles' || activeProduct.categoryKey === 'lorawan';

  // Calculate pricing breakdown
  const probeCost = extraProbe ? (activeProduct.telecomType === 'lora' ? 49 : 14) : 0;
  const solarCost = solarUpgrade ? 19 : 0;
  const unitPrice = activeProduct.price + probeCost + solarCost;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  function handleOrderSimulate() {
    setOrderConfirmed(true);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl rounded-2xl bg-[#121915] border border-green-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl focus:outline-none data-[state=open]:animate-contentShow max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-glow-green" />
              <Dialog.Title className="text-xl font-bold font-heading text-white">
                {isBundle ? 'Simulate Turnkey Package Order' : 'Simulate Hardware Order'}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </Dialog.Close>
          </div>

          {/* SIMULATION NOTICE BANNER */}
          <div className="mb-5 flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <SparklesIcon />
              <span className="font-semibold">
                Interactive Simulation Mode • <strong>No Real Money Charged</strong>
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
              €0.00 Free Demo
            </span>
          </div>

          {orderConfirmed ? (
            <div className="py-6 text-center space-y-5 animate-contentShow">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto shadow-glow-green">
                <CheckIcon />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-heading text-white">
                  Simulated Order Confirmed!
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  100% Free Sandbox Demo — No payment or credit card was charged.
                </p>
              </div>

              {/* Order Receipt Details */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-left space-y-2.5 max-w-lg mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400 font-mono">Simulation ID:</span>
                  <span className="font-bold text-green-300 font-mono">{simOrderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Item Ordered:</span>
                  <span className="font-semibold text-white truncate ml-2">
                    {quantity}x {activeProduct.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Estimated Retail Value:</span>
                  <span className="text-gray-300 font-mono">€{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Actual Amount Billed:</span>
                  <span className="font-extrabold text-green-400 font-mono text-sm">
                    €0.00 (Demo Mode)
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1 font-mono text-[11px] text-gray-400">
                  <div className="text-emerald-400 font-bold">AWS Cloud Auto-Provisioning:</div>
                  <div>• Device Node ID: <span className="text-white">Planta-{activeProduct.id.slice(0, 10).toUpperCase()}</span></div>
                  <div>• Telemetry Uplink: <span className="text-white">{activeProduct.connectivity || 'Wi-Fi / MQTT'}</span></div>
                  <div>• Telemetry API Gateway: <span className="text-green-300">Connected & Ready</span></div>
                  <div>• Test Status: Ready for instant simulation in dashboard</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setOrderConfirmed(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Simulate Another Order
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Turnkey Variant Switcher */}
              {isBundle && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wider">
                    Select Turnkey Package Variant:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TURNKEY_BUNDLES.map((b) => {
                      const isSelected = activeProduct.id === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setActiveProduct(b);
                            setExtraProbe(false);
                            setSolarUpgrade(false);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                            isSelected
                              ? 'bg-green-500/20 border-green-500/50 shadow-glow-green text-white font-bold'
                              : 'bg-black/30 hover:bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span>{b.icon}</span>
                            <span className="truncate">{b.shortName}</span>
                          </div>
                          <div className="text-green-400 font-extrabold mt-1">€{b.price.toFixed(2)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Brief Banner */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 text-3xl">
                  {activeProduct.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-500/15 px-2 py-0.5 rounded border border-green-500/25">
                      {activeProduct.category}
                    </span>
                    {activeProduct.telecomType === 'lora' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/25">
                        LoRaWAN 868MHz
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mt-1 leading-snug">{activeProduct.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {activeProduct.description}
                  </p>
                </div>
              </div>

              {/* Included in Box checklist for Turnkey Bundles */}
              {activeProduct.included && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <BoxIcon />
                    <span>Included in This Turnkey Package:</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs text-gray-300">
                    {activeProduct.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 shrink-0 font-bold">✓</span>
                        <span className="text-[11px] leading-tight text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Add-Ons */}
              {isBundle && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Optional Add-ons & Spares:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      extraProbe ? 'bg-green-500/15 border-green-500/40 text-white' : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={extraProbe}
                          onChange={(e) => setExtraProbe(e.target.checked)}
                          className="rounded border-white/20 text-green-500 focus:ring-0"
                        />
                        <span>{activeProduct.telecomType === 'lora' ? 'Extra LoRaWAN Soil Probe' : 'Extra Wireless BLE Pod'}</span>
                      </div>
                      <span className="font-bold text-green-400">+{activeProduct.telecomType === 'lora' ? '€49' : '€14'}</span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      solarUpgrade ? 'bg-green-500/15 border-green-500/40 text-white' : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={solarUpgrade}
                          onChange={(e) => setSolarUpgrade(e.target.checked)}
                          className="rounded border-white/20 text-green-500 focus:ring-0"
                        />
                        <span>Solar Battery Backup Kit</span>
                      </div>
                      <span className="font-bold text-green-400">+€19</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-sm font-semibold text-gray-200 block">Package Quantity</span>
                  <span className="text-[11px] text-gray-400">Unit value: €{unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="text-base font-bold text-white w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Certification & Guarantee */}
              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/25 text-xs text-green-300 flex items-center gap-2.5">
                <CheckIcon />
                <span>
                  <strong>100% Turnkey Tested:</strong> Pre-programmed with AWS Lambda & API Gateway telemetry. Ready for Bluetooth, Wi-Fi, or LoRaWAN 868MHz.
                </span>
              </div>

              {/* Total Price and Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase font-semibold">Simulated Value:</span>
                    <span className="text-xs text-gray-500 line-through">€{totalPrice}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold font-heading text-green-400 shadow-glow-green">
                      €0.00
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                      (Free Sandbox Demo)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOrderSimulate}
                  id="simulate-order-confirm-btn"
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 hover:from-green-300 hover:to-green-400 shadow-glow-green hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <SparklesIcon />
                  <span>Simulate Order (No Charge)</span>
                </button>
              </div>

              {/* Partner Retailers Link */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Or buy components individually from partner stores:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RETAILERS.map((retailer) => (
                    <a
                      key={retailer.name}
                      href={retailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 hover:bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold truncate">{retailer.name}</div>
                        <div className="text-[10px] text-green-400">{retailer.badge}</div>
                      </div>
                      <ExternalLinkIcon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
