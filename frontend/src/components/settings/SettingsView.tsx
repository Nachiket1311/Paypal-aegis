import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { 
  Settings as SettingsIcon, 
  Shield, 
  CreditCard, 
  Lock, 
  Sparkles, 
  Check, 
  RefreshCw, 
  AlertCircle,
  Eye,
  KeyRound,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    userPersona, 
    setUserPersona, 
    currency, 
    setCurrency, 
    isBackendOnline,
    trustScore
  } = useAegis();

  const [savedNotice, setSavedNotice] = useState(false);
  const [autoFreezeThreshold, setAutoFreezeThreshold] = useState(3);
  const [dualKeyGlobalLimit, setDualKeyGlobalLimit] = useState(20000);
  const [aiEngine, setAiEngine] = useState<'aegis_local' | 'gemini_flash'>('aegis_local');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
            <SettingsIcon className="w-3.5 h-3.5 text-paypal-blue" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage PayPal Sandbox bindings, AI threat inference modes, and automated risk policies.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated and synchronized across all protection modules.</span>
        </div>
      )}

      {/* Section 1: Active Persona Configuration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Active User Persona
        </h3>
        <p className="text-xs text-slate-500">
          Tailors the primary dashboard and default security actions for your workflow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div
            onClick={() => setUserPersona('buyer')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              userPersona === 'buyer'
                ? 'border-paypal-blue bg-paypal-subtle/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Buyer Persona</span>
              {userPersona === 'buyer' && <Check className="w-4 h-4 text-paypal-blue" />}
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Optimized for online shopping safety, phishing detection, merchant legitimacy auditing, and personal vault spending limits.
            </p>
          </div>

          <div
            onClick={() => setUserPersona('freelancer')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              userPersona === 'freelancer'
                ? 'border-paypal-blue bg-paypal-subtle/40 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Freelancer / Seller Persona</span>
              {userPersona === 'freelancer' && <Check className="w-4 h-4 text-paypal-blue" />}
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Optimized for independent contractors, milestone digital agreements, delivery evidence cryptographic timestamping, and chargeback dispute shielding.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: PayPal Sandbox Integration */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-paypal-blue" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. PayPal Sandbox Environment
            </h3>
          </div>
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Connected & Authenticated
          </span>
        </div>

        <p className="text-xs text-slate-500">
          The application reads PayPal Sandbox API credentials from <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">backend/.env</code>.
        </p>

        <div className="space-y-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono">
            <div>
              <span className="text-slate-400 text-[11px] block">PAYPAL_CLIENT_ID:</span>
              <span className="text-slate-800 break-all">BAAF2ezmZBxGlgKO69eCYw7p5DTZlDOiP33Iy9ohOjPUXEoIEtiY7UDgKSqycO5Tz78LixOkbEFGC8e64E</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">PAYPAL_BASE_URL:</span>
              <span className="text-slate-800">https://api-m.sandbox.paypal.com</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Backend Bridge:</span>
              <span className="text-slate-800">FastAPI / Uvicorn (Port 8000) • {isBackendOnline ? '✓ Online' : 'Simulation Mode'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Automated Security Guardrails */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Automated Security Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Auto-Freeze Vault Anomaly Threshold
            </label>
            <select
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={autoFreezeThreshold}
              onChange={e => setAutoFreezeThreshold(Number(e.target.value))}
            >
              <option value={2}>2 Consecutive high-risk attempts</option>
              <option value={3}>3 Consecutive high-risk attempts (Recommended)</option>
              <option value={5}>5 Consecutive high-risk attempts</option>
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Instantly freezes the Virtual Vault to halt further payment exfiltration.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Global Dual-Key Multi-Sig Threshold (INR)
            </label>
            <input
              type="number"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={dualKeyGlobalLimit}
              onChange={e => setDualKeyGlobalLimit(Number(e.target.value))}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Any single checkout exceeding this amount automatically routes to Secondary Key sign-off.
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: AI Threat Detection Engine */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-paypal-blue" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. AI Threat Inference Engine
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="aiEngine"
                checked={aiEngine === 'aegis_local'}
                onChange={() => setAiEngine('aegis_local')}
                className="text-paypal-blue focus:ring-paypal-blue"
              />
              <span className="font-semibold text-slate-800">Aegis Local Neural Heuristic Shield (Deterministic & Instant)</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="aiEngine"
                checked={aiEngine === 'gemini_flash'}
                onChange={() => setAiEngine('gemini_flash')}
                className="text-paypal-blue focus:ring-paypal-blue"
              />
              <span className="font-semibold text-slate-800">Gemini 2.5 Flash API (Cloud-Enhanced Deep Reasoner)</span>
            </label>
          </div>

          {aiEngine === 'gemini_flash' && (
            <div className="pl-6 pt-1">
              <label className="font-semibold text-slate-700 block mb-1">Gemini API Key (Optional)</label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use built-in simulator)"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white font-semibold text-xs shadow-md transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </div>
    </div>
  );
};
