import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { ShieldCheck, ShieldAlert, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export const TrustScoreGauge: React.FC = () => {
  const { trustScore, isVaultFrozen, setActiveTab } = useAegis();

  // Circle SVG math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (trustScore / 100) * circumference;

  const scoreColor = trustScore >= 90 ? 'text-emerald-500' : trustScore >= 70 ? 'text-paypal-blue' : 'text-amber-500';
  const strokeColor = trustScore >= 90 ? '#10B981' : trustScore >= 70 ? '#0070BA' : '#F59E0B';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Aegis Trust Score</h3>
          <p className="text-xs text-slate-500">Real-time composite account reliability metric</p>
        </div>
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          {trustScore >= 90 ? 'Optimal Standing' : 'Under Review'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Circular Progress Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Score Bar */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold tracking-tight ${scoreColor} font-mono`}>
              {trustScore}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              out of 100
            </span>
          </div>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="flex-1 w-full space-y-2.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Transaction Integrity</span>
              <span className="font-semibold text-slate-900 font-mono">98%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Privacy & DPDP Compliance</span>
              <span className="font-semibold text-slate-900 font-mono">92%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-paypal-blue h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Dispute Resilience</span>
              <span className="font-semibold text-slate-900 font-mono">95%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '95%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Virtual Vault Governance</span>
              <span className="font-semibold text-slate-900 font-mono">{isVaultFrozen ? '65%' : '91%'}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`${isVaultFrozen ? 'bg-amber-500' : 'bg-amber-500'} h-full rounded-full`} 
                style={{ width: isVaultFrozen ? '65%' : '91%' }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center text-slate-500">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span>Calculated from 142 historical audits</span>
        </div>
        <button 
          onClick={() => setActiveTab('settings')}
          className="text-paypal-blue hover:text-paypal-deep font-semibold flex items-center group"
        >
          <span>Score Breakdown</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
