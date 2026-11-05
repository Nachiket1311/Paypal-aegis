import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { SecuritySummaryCards } from './SecuritySummaryCards';
import { TrustScoreGauge } from './TrustScoreGauge';
import { RecentActivityTable } from './RecentActivityTable';
import { AISecurityInsights } from './AISecurityInsights';
import { Shield, Sparkles, ArrowRight, Zap, CheckCircle2, Lock } from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { userPersona, setActiveTab, runTourScenario } = useAegis();

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-paypal-navy via-paypal-deep to-paypal-blue p-6 sm:p-8 text-white shadow-card">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <Shield className="w-full h-full transform translate-x-12 -translate-y-6" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-aegis-electric" />
            <span>AI-Powered Autonomous Trust Infrastructure</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to Aegis
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-1.5 leading-relaxed font-normal">
            Your intelligent trust layer for safer digital transactions.
          </p>

          <p className="text-xs text-white/70 mt-2">
            Active Persona: <strong className="text-white capitalize">{userPersona} Protection</strong> — Fraud Guardian, Fair Trade Escrow, Virtual Vault, and DPDP Sovereignty operational.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('fraud-guardian')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-paypal-deep hover:bg-slate-100 transition-all shadow-md flex items-center space-x-1.5"
            >
              <span>Analyze a Merchant</span>
              <ArrowRight className="w-3.5 h-3.5 text-paypal-deep" />
            </button>

            <button
              onClick={() => setActiveTab('virtual-vault')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-all backdrop-blur-md border border-white/20 flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Simulate Vault Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <SecuritySummaryCards />

      {/* Trust Score & AI Insights Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <TrustScoreGauge />
        </div>
        <div className="lg:col-span-7">
          <AISecurityInsights />
        </div>
      </div>

      {/* Recent Protected Activity Ledger */}
      <RecentActivityTable limit={6} showHeader={true} />
    </div>
  );
};
