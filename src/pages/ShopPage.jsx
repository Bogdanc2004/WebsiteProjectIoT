import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import BuyModal, { TURNKEY_BUNDLES } from '../components/shop/BuyModal';

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function RadioTowerIcon() {
  return (
    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
    </svg>
  );
}

const INDIVIDUAL_PRODUCTS = [
  {
    id: 'prod-esp32',
    name: 'ESP32 IoT Garden Node (Pre-flashed AWS)',
    category: 'Controllers & Kits',
    categoryKey: 'controllers',
    price: 16.99,
    icon: '⚡',
    badge: 'Pre-Configured',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Wi-Fi & Bluetooth microcontroller pre-loaded with Planta firmware. Auto-connects to your AWS API Gateway telemetry pipeline.',
    specs: [
      { label: 'Processor', value: 'Xtensa Dual 240MHz' },
      { label: 'Wireless', value: '802.11 b/g/n + BLE' },
      { label: 'Pins', value: '30 GPIO / ADC / I2C' },
      { label: 'Firmware', value: 'Planta MQTT v1.4' },
    ],
  },
  {
    id: 'prod-solar',
    name: '5V Solar Cell & Li-Ion Battery Management Shield',
    category: 'Controllers & Kits',
    categoryKey: 'controllers',
    price: 13.99,
    icon: '🔋',
    badge: 'Off-Grid Ready',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'Run your balcony and outdoor plant monitors completely wire-free with high efficiency solar charging and battery protection.',
    specs: [
      { label: 'Panel', value: '5V 250mA Monocrystal' },
      { label: 'Controller', value: 'TP4056 + DW01A' },
      { label: 'Battery', value: '18650 / LiPo 3.7V' },
      { label: 'Weather', value: 'IP65 Water resistant' },
    ],
  },
];

const ALL_PRODUCTS = [...TURNKEY_BUNDLES, ...INDIVIDUAL_PRODUCTS];

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'bundles', label: '📦 Turnkey Bundles (1, 5, 10 Plants)' },
  { id: 'lorawan', label: '📡 LoRaWAN Agriculture (Hectares)' },
  { id: 'controllers', label: '⚡ IoT Controllers & Nodes' },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bundleTelecomTab, setBundleTelecomTab] = useState('ble'); // 'ble' or 'lora'

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.categoryKey === selectedCategory ||
      (selectedCategory === 'bundles' && (p.isBundle || p.categoryKey === 'bundles' || p.categoryKey === 'lorawan'));
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featuredBundles = TURNKEY_BUNDLES.filter((b) => b.telecomType === bundleTelecomTab);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-950/90 via-[#102419] to-emerald-950/90 border border-green-500/30 p-6 sm:p-10 shadow-glass backdrop-blur-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-300 shadow-sm">
              <ShieldCheckIcon />
              <span>Certified IoT Hardware & Turnkey Systems</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-glow-green">
              <span>🧪 100% Free Order Simulation • No Real Money Charged</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Sensors & Hardware Marketplace
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-2 leading-relaxed">
            Order ready-to-run packages pre-configured with AWS firmware. Choose between <strong>Bluetooth & Wi-Fi for 1, 5, or 10 plants</strong>, or long-range <strong>LoRaWAN (868MHz) for agricultural fields and hectares</strong>.
          </p>
        </div>
      </div>

      {/* FEATURED TURNKEY COMPLETE BUNDLES SHOWCASE */}
      <div className="rounded-3xl bg-gradient-to-br from-[#121c17] via-[#0d1611] to-[#121c17] border border-green-500/25 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📦</span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                Turnkey Ready-to-Use Packages
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Zero assembly required: Everything arrives paired, tested, and pre-flashed with your AWS telemetry dashboard.
            </p>
          </div>

          {/* Telecom Switcher (Bluetooth 1-10 plants vs LoRaWAN Hectares) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/50 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setBundleTelecomTab('ble')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                bundleTelecomTab === 'ble'
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-glow-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BluetoothIcon />
              <span>1, 5, 10 Plants (BLE)</span>
            </button>
            <button
              type="button"
              onClick={() => setBundleTelecomTab('lora')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                bundleTelecomTab === 'lora'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-glow-amber'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <RadioTowerIcon />
              <span>Fields & Hectares (LoRaWAN)</span>
            </button>
          </div>
        </div>

        {/* Featured Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {featuredBundles.map((bundle) => (
            <div
              key={bundle.id}
              className="relative flex flex-col justify-between rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-green-500/50 p-5 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${bundle.badgeColor}`}>
                    {bundle.badge}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">{bundle.coverage}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                    {bundle.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white group-hover:text-green-300 transition-colors truncate">
                      {bundle.name}
                    </h3>
                    <div className="text-xs text-green-400 font-semibold mt-0.5">
                      {bundle.capacity}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                  {bundle.description}
                </p>

                {/* Included in box preview */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 mb-4 text-[11px]">
                  <div className="font-semibold text-gray-300 text-[10px] uppercase tracking-wider">
                    Package Includes:
                  </div>
                  {bundle.included.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-400 truncate">
                      <span className="text-green-400 text-xs font-bold">✓</span>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                  {bundle.included.length > 3 && (
                    <div className="text-[10px] text-gray-500 pl-4 font-mono">
                      + {bundle.included.length - 3} more items included
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-semibold">Turnkey Price</span>
                  <span className="text-2xl font-extrabold font-heading text-white group-hover:text-green-400 transition-colors">
                    €{bundle.price.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(bundle)}
                  id={`buy-bundle-${bundle.id}`}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CartIcon />
                  <span>Simulate Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 pt-2">
        {/* Category Tabs */}
        <Tabs.Root value={selectedCategory} onValueChange={setSelectedCategory}>
          <Tabs.List className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10 shadow-inner flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <Tabs.Trigger
                key={cat.id}
                value={cat.id}
                id={`shop-tab-${cat.id}`}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer select-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-glow-green"
              >
                {cat.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search bundles, Raspberry Pi, LoRaWAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-80 bg-planta-surface border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-planta-surface/75 hover:bg-planta-surface/95 border border-white/10 hover:border-green-500/40 p-5 shadow-glass hover:shadow-glow-green transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl"
          >
            <div>
              {/* Product Top */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${product.badgeColor}`}>
                  {product.badge}
                </span>
                <span className="text-xs text-gray-400 font-medium">{product.category}</span>
              </div>

              {/* Icon visual */}
              <div className="w-full h-32 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300 text-5xl">
                {product.icon}
              </div>

              <h3 className="text-base font-bold font-heading text-white group-hover:text-green-300 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Specs tags */}
              <div className="grid grid-cols-2 gap-1.5 my-4 pt-3 border-t border-white/5 text-[11px]">
                {product.specs.map((s, idx) => (
                  <div key={idx} className="bg-black/30 px-2 py-1 rounded border border-white/5 truncate">
                    <span className="text-gray-500">{s.label}: </span>
                    <span className="font-semibold text-gray-300">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                <span className="text-xl font-extrabold font-heading text-white group-hover:text-green-400 transition-colors">
                  €{product.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                id={`buy-btn-${product.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 shadow-glow-green transition-all cursor-pointer"
              >
                <CartIcon />
                <span>Simulate Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          No matching hardware found for &ldquo;{searchQuery}&rdquo;. Try another term.
        </div>
      )}

      {/* 3-Step Setup Guide Banner */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-6 sm:p-8 mt-12">
        <h3 className="text-lg font-bold font-heading text-white mb-4">
          How to connect your new hardware or complete package:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="w-6 h-6 rounded-full bg-green-500 text-black font-bold flex items-center justify-center mb-2">1</span>
            <div className="font-bold text-white text-sm mb-1">Turnkey / Plug in</div>
            Turnkey packages power on instantly. For custom nodes, connect sensors to your ESP32 controller board.
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="w-6 h-6 rounded-full bg-green-500 text-black font-bold flex items-center justify-center mb-2">2</span>
            <div className="font-bold text-white text-sm mb-1">Set Device ID</div>
            In Planta, click &ldquo;Add Plant&rdquo; and enter the Device ID (e.g. <code className="text-green-300 font-mono">Planterra</code>) provided in your package.
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="w-6 h-6 rounded-full bg-green-500 text-black font-bold flex items-center justify-center mb-2">3</span>
            <div className="font-bold text-white text-sm mb-1">Automatic Telemetry</div>
            Telemetry streams via BLE, Wi-Fi, or LoRaWAN straight to AWS API Gateway and displays live in your dashboard!
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <BuyModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
