import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Sparkles, X, ShieldAlert, FileText, Lock, Eye, ChevronRight } from 'lucide-react';

export const GuidedTourBanner: React.FC = () => {
  const { runTourScenario, activeTourScenario } = useAegis();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-paypal-navy via-paypal-deep to-paypal-blue text-white px-4 py-2.5 shadow-sm border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-aegis-electric" />
          </div>
          <span className="font-semibold">Interactive Prototype Tour:</span>
          <span className="text-white/80 hidden lg:inline">
            Test full AI trust workflows across 4 real scenarios without needing real bank accounts.
          </span>
        </div>

        {/* 4 Interactive Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => runTourScenario('buyer')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTourScenario === 'buyer' 
                ? 'bg-white text-paypal-deep shadow-md' 
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-300" />
            <span>1. Buyer Scam Intercept</span>
          </button>

          <button
            onClick={() => runTourScenario('freelancer')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTourScenario === 'freelancer' 
                ? 'bg-white text-paypal-deep shadow-md' 
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <FileText className="w-3 h-3 text-emerald-300" />
            <span>2. Freelancer Dispute Shield</span>
          </button>

          <button
            onClick={() => runTourScenario('vault')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTourScenario === 'vault' 
                ? 'bg-white text-paypal-deep shadow-md' 
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>3. Vault Limit Enforcement</span>
          </button>

          <button
            onClick={() => runTourScenario('privacy')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
              activeTourScenario === 'privacy' 
                ? 'bg-white text-paypal-deep shadow-md' 
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            <Eye className="w-3 h-3 text-purple-300" />
            <span>4. DPDP Privacy Erasure</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-white/60 hover:text-white p-1 rounded transition-colors ml-1"
            title="Dismiss Tour Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
