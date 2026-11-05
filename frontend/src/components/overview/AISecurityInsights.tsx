import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { 
  Sparkles, 
  ShieldAlert, 
  Lock, 
  FileCheck2, 
  Eye, 
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AISecurityInsights: React.FC = () => {
  const { setActiveTab, runTourScenario } = useAegis();

  const insights = [
    {
      id: 'ins-1',
      title: 'Predatory Merchant Intercepted',
      description: 'Fraud Guardian blocked ₹7,999 to mega-gadgets-sale90.shop. Unrealistic 90% discount pattern on electronics.',
      module: 'fraud-guardian',
      badge: 'Buyer Shield',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      actionLabel: 'Inspect Threat Analysis',
      onClick: () => setActiveTab('fraud-guardian'),
    },
    {
      id: 'ins-2',
      title: 'Virtual Vault Budget Preserved',
      description: 'A ₹7,500 checkout was halted because it exceeded the ₹5,000 online shopping allocation cap. Zero funds leaked.',
      module: 'virtual-vault',
      badge: 'Spending Cap',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Lock,
      iconColor: 'text-amber-600',
      actionLabel: 'Adjust Allocations',
      onClick: () => setActiveTab('virtual-vault'),
    },
    {
      id: 'ins-3',
      title: 'Freelance Deliverable Cryptographically Sealed',
      description: 'Milestone 2 code pull request #84 for Apex Ventures was timestamped with SHA-256 deliverable receipt.',
      module: 'fair-trade',
      badge: 'Seller Shield',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileCheck2,
      iconColor: 'text-emerald-600',
      actionLabel: 'View Fair Trade Proofs',
      onClick: () => setActiveTab('fair-trade'),
    },
    {
      id: 'ins-4',
      title: 'DPDP Privacy Preference Review',
      description: 'Optional cross-merchant behavioral profiling is currently enabled. You can revoke consent in one click.',
      module: 'sovereignty',
      badge: 'Data Sovereignty',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Eye,
      iconColor: 'text-purple-600',
      actionLabel: 'Manage DPDP Consent',
      onClick: () => setActiveTab('sovereignty'),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-paypal-blue/10 flex items-center justify-center text-paypal-blue">
            <Sparkles className="w-4 h-4 text-paypal-blue" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Sentinel Security Insights</h3>
            <p className="text-xs text-slate-500">Intelligent proactive threat intelligence across all 4 modules</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">4 Active Signals</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-paypal-blue/40 bg-slate-50/50 hover:bg-white hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-paypal-blue transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-paypal-blue group-hover:text-paypal-deep">
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
