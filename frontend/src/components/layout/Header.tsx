import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Zap,
  Globe,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userPersona, 
    setUserPersona, 
    activeAlertsCount, 
    setIsNotificationsOpen, 
    setIsSearchOpen,
    isVaultFrozen,
    paypalConnected,
    setActiveTab
  } = useAegis();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Search Bar Trigger */}
      <div className="flex-1 max-w-lg">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all shadow-sm group"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-paypal-blue transition-colors" />
            <span className="text-xs sm:text-sm text-slate-500">Search transactions, merchants, agreements...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Security Sentinel Status Indicator */}
        <div 
          onClick={() => setActiveTab('virtual-vault')}
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-paypal-blue/40 transition-colors cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <span className={`w-2 h-2 rounded-full ${isVaultFrozen ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            {!isVaultFrozen && (
              <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500/20 animate-ping" />
            )}
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {isVaultFrozen ? 'Vault Frozen' : 'Aegis Shield Active'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
        </div>

        {/* Live PayPal Sandbox Connected Badge */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-paypal-subtle text-paypal-deep border border-paypal-blue/20 text-xs font-medium cursor-pointer hover:bg-paypal-subtle/80"
          title="PayPal Sandbox API Authenticated"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-paypal-blue" />
          <span>PayPal Sandbox</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Profile & Persona Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-paypal-deep to-paypal-blue flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              {userPersona === 'freelancer' ? 'NP' : 'VM'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {userPersona === 'freelancer' ? 'Nachiket Palekar' : 'Vikram Malhotra'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize font-medium">
                {userPersona === 'freelancer' ? 'Freelancer / Seller' : 'Buyer Protected'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-2 z-50 animate-slide-up"
              onClick={() => setIsProfileOpen(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Signed In As</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {userPersona === 'freelancer' ? 'nachiket.design@paypal-aegis.dev' : 'vikram.m@apexventures.io'}
                </p>
              </div>

              {/* Persona Switcher Section */}
              <div className="p-2 border-b border-slate-100">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </p>
                <button
                  onClick={() => setUserPersona('buyer')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    userPersona === 'buyer' ? 'bg-paypal-subtle text-paypal-deep font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-paypal-blue" />
                    <span>Buyer Persona</span>
                  </div>
                  {userPersona === 'buyer' && <Check className="w-3.5 h-3.5 text-paypal-blue" />}
                </button>

                <button
                  onClick={() => setUserPersona('freelancer')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    userPersona === 'freelancer' ? 'bg-paypal-subtle text-paypal-deep font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Freelancer / Seller</span>
                  </div>
                  {userPersona === 'freelancer' && <Check className="w-3.5 h-3.5 text-paypal-blue" />}
                </button>
              </div>

              {/* Navigation links */}
              <div className="p-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  <span>Security & Account Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('sovereignty')}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Privacy Sovereignty</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
