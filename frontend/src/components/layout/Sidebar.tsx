import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  FileCheck2, 
  Lock, 
  Eye, 
  History, 
  Settings,
  Shield,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, trustScore, isVaultFrozen, runTourScenario } = useAegis();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'fraud-guardian',
      label: 'Fraud Guardian',
      icon: ShieldAlert,
      badge: 'Buyer',
      color: 'text-paypal-blue',
    },
    {
      id: 'fair-trade',
      label: 'Fair Trade Agent',
      icon: FileCheck2,
      badge: 'Seller',
      color: 'text-emerald-600',
    },
    {
      id: 'virtual-vault',
      label: 'Virtual Vault',
      icon: Lock,
      badge: isVaultFrozen ? 'Frozen' : 'Safe',
      color: isVaultFrozen ? 'text-amber-500' : 'text-amber-600',
    },
    {
      id: 'sovereignty',
      label: 'Sovereignty',
      icon: Eye,
      badge: 'DPDP',
      color: 'text-purple-600',
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      icon: History,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-screen select-none">
      {/* Brand & Logo Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-paypal-deep via-paypal-blue to-aegis-electric flex items-center justify-center text-white shadow-md shadow-paypal-blue/20">
            <Shield className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-paypal-deep">PayPal</span>
              <span className="font-bold text-base tracking-tight text-paypal-blue">Aegis</span>
            </div>
            <span className="block text-[10px] uppercase tracking-widest font-semibold text-slate-400">
              Trust & Security Layer
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Protection Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-paypal-blue text-white shadow-sm shadow-paypal-blue/30 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : item.color || 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Guided Scenarios Quick Box */}
        <div className="pt-6 px-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-paypal-subtle to-slate-50 border border-paypal-blue/20">
            <div className="flex items-center space-x-2 text-paypal-deep font-semibold text-xs mb-1.5">
              <Sparkles className="w-4 h-4 text-paypal-blue" />
              <span>Interactive Scenarios</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              One-click live simulations demonstrating real-time buyer & seller defense.
            </p>
            <div className="space-y-1">
              <button
                onClick={() => runTourScenario('buyer')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-white hover:text-paypal-blue border border-transparent hover:border-slate-200 transition-all flex items-center justify-between"
              >
                <span>1. Buyer Scam Intercept</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => runTourScenario('freelancer')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-white hover:text-paypal-blue border border-transparent hover:border-slate-200 transition-all flex items-center justify-between"
              >
                <span>2. Freelancer Dispute Shield</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => runTourScenario('vault')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-700 hover:bg-white hover:text-paypal-blue border border-transparent hover:border-slate-200 transition-all flex items-center justify-between"
              >
                <span>3. Vault Budget Limit Block</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Trust Score Card in Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-700">Account Trust Score</span>
          <span className="text-xs font-extrabold text-paypal-blue font-mono">{trustScore}/100</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-paypal-blue h-full rounded-full transition-all duration-700" 
            style={{ width: `${trustScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
          <span>Standing: Verified</span>
          <span className="text-emerald-600 font-medium">Optimal</span>
        </div>
      </div>
    </aside>
  );
};
