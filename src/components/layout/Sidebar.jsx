import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import FallingPetals from './FallingPetals';
import EditProfileModal from './EditProfileModal';

function LeafIcon() {
  return (
    <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.4 5-5 6.5" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { to: '/plants', icon: <PlantIcon />, label: 'My Plants' },
    { to: '/shop', icon: <StoreIcon />, label: 'Sensors & Hardware' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2)?.toUpperCase() || 'U';

  return (
    <Tooltip.Provider delayDuration={200}>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        id="mobile-menu-toggle"
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-planta-surface/90 border border-white/10 text-gray-200 shadow-lg backdrop-blur-md"
      >
        <MenuIcon />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0b120e]/95 border-r border-white/10 transition-all duration-300 backdrop-blur-2xl ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <FallingPetals count={20} />

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggle}
          id="sidebar-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-planta-surface border border-white/15 text-gray-300 hover:text-white hover:border-green-500/50 items-center justify-center shadow-lg transition-transform"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronLeftIcon />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 shadow-glow-green shrink-0">
            <LeafIcon />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-extrabold font-heading bg-gradient-to-r from-green-400 via-green-300 to-emerald-200 bg-clip-text text-transparent">
                Planta
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                IoT Monitoring
              </span>
            </div>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const content = (
              <NavLink
                key={link.to}
                to={link.to}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-green-500/5 text-green-300 border border-green-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <div className="shrink-0">{link.icon}</div>
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip.Root key={link.to}>
                  <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={10}
                      className="z-50 px-3 py-1.5 text-xs font-semibold text-white bg-planta-surface border border-white/15 rounded-lg shadow-xl"
                    >
                      {link.label}
                      <Tooltip.Arrow className="fill-planta-surface" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            }

            return content;
          })}
        </nav>

        {/* Clean, Professional User Panel at bottom left */}
        <div className="p-2 border-t border-white/10 bg-[#070c09]">
          <DropdownMenu.Root>
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#111914] border border-white/5 hover:border-white/15 transition-all">
              {/* User info trigger */}
              <DropdownMenu.Trigger asChild>
                <button
                  id="user-profile-menu-trigger"
                  className="flex items-center gap-2.5 flex-1 p-1 rounded-lg hover:bg-white/5 text-left focus:outline-none min-w-0 transition-colors"
                  aria-label="User profile options"
                >
                  <div className="relative shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || 'User'}
                        className="w-9 h-9 rounded-full object-cover border border-green-500/40 shadow-md"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-600 via-emerald-500 to-green-400 text-black font-extrabold text-sm flex items-center justify-center shadow-md">
                        {initials}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#111914] bg-green-500 shadow-[0_0_6px_#22c55e]" />
                  </div>

                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate leading-tight">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                        {user?.email || ''}
                      </div>
                    </div>
                  )}
                </button>
              </DropdownMenu.Trigger>

              {/* Direct Edit Profile button */}
              {!collapsed && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      id="edit-profile-direct-btn"
                      className="p-2 rounded-lg text-gray-400 hover:text-green-300 hover:bg-white/10 transition-colors"
                      aria-label="Edit Profile & Password"
                    >
                      <EditIcon />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={5}
                      className="z-50 px-2 py-1 text-[11px] font-semibold text-white bg-black/90 border border-white/10 rounded shadow-md"
                    >
                      Edit Profile & Password
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )}
            </div>

            {/* Clean Dropdown Menu */}
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                side="top"
                align="start"
                sideOffset={10}
                className="z-50 w-60 rounded-xl bg-[#141c17] border border-white/15 p-1.5 shadow-2xl backdrop-blur-2xl text-xs space-y-1 animate-contentShow"
              >
                <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2.5">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-green-500/40 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-sm truncate">{user?.name || 'User'}</div>
                    <div className="text-gray-400 font-mono text-[11px] truncate">{user?.email}</div>
                  </div>
                </div>

                <DropdownMenu.Item
                  onClick={() => setIsEditModalOpen(true)}
                  id="menu-edit-profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10 cursor-pointer outline-none font-semibold transition-colors"
                >
                  <EditIcon />
                  <span>Edit Profile & Password</span>
                </DropdownMenu.Item>

                <div className="pt-1 border-t border-white/5">
                  <DropdownMenu.Item
                    onClick={logout}
                    id="logout-button"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/15 cursor-pointer outline-none font-semibold transition-colors"
                  >
                    <LogOutIcon />
                    <span>Log Out</span>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </aside>

      {/* Edit Profile & Password Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Tooltip.Provider>
  );
}
