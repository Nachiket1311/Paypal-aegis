import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { ShieldCheck, IndianRupee, ShieldAlert, Bell, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const SecuritySummaryCards: React.FC = () => {
  const { 
    totalProtectedAmount, 
    transactions, 
    suspiciousCount, 
    activeAlertsCount,
    setActiveTab,
    setIsNotificationsOpen
  } = useAegis();

  const protectedCount = transactions.filter(t => t.status === 'protected' || t.status === 'approved').length;

  const cards = [
    {
      title: 'Protected Transactions',
      value: protectedCount.toString(),
      subtext: '+12.4% vs previous month',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      onClick: () => setActiveTab('transactions'),
    },
    {
      title: 'Money Protected',
      value: formatINR(totalProtectedAmount),
      subtext: 'Safe in Virtual Vault & Escrow',
      icon: IndianRupee,
      color: 'text-paypal-blue',
      bgColor: 'bg-paypal-subtle',
      borderColor: 'border-paypal-blue/20',
      onClick: () => setActiveTab('virtual-vault'),
    },
    {
      title: 'Suspicious Threats Halted',
      value: suspiciousCount.toString(),
      subtext: '100% blocked before payment',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      onClick: () => setActiveTab('fraud-guardian'),
    },
    {
      title: 'Active Security Alerts',
      value: activeAlertsCount.toString(),
      subtext: activeAlertsCount === 0 ? 'All systems nominal' : 'Action items require review',
      icon: Bell,
      color: activeAlertsCount > 0 ? 'text-amber-600' : 'text-slate-400',
      bgColor: activeAlertsCount > 0 ? 'bg-amber-50' : 'bg-slate-50',
      borderColor: activeAlertsCount > 0 ? 'border-amber-100' : 'border-slate-200',
      onClick: () => setIsNotificationsOpen(true),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            onClick={card.onClick}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:border-paypal-blue/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{card.value}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{card.subtext}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-paypal-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
