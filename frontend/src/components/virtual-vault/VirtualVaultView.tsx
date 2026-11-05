import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { SpendingAllocation, SimulatedTransactionResult } from '../../types';
import { evaluateSimulatedTransaction } from '../../services/vaultService';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { formatINR, formatUSD, formatRelativeTime } from '../../lib/utils';
import { 
  Lock, 
  ShieldCheck, 
  Plus, 
  Play, 
  Snowflake, 
  Flame, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Check, 
  X, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  RefreshCw
} from 'lucide-react';

export const VirtualVaultView: React.FC = () => {
  const { 
    availableBalance, 
    allocations, 
    approvalRequests, 
    isVaultFrozen, 
    toggleVaultFreeze,
    createAllocation,
    resolveApprovalRequest,
    depositPayPalFunds,
    addTransaction
  } = useAegis();

  // Create Allocation Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [allocForm, setAllocForm] = useState({
    name: '',
    category: 'Consumer Electronics',
    merchantPattern: '',
    maxAmount: 10000,
    expiryDate: '2026-12-15',
    purpose: '',
    isRecurring: false,
    requiresDualKey: false,
    dualKeyThreshold: 5000,
  });

  // Transaction Simulator Modal state
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simMerchant, setSimMerchant] = useState('mega-gadgets-sale90.shop');
  const [simAmount, setSimAmount] = useState(7500);
  const [simCategory, setSimCategory] = useState('Consumer Electronics');
  const [simResult, setSimResult] = useState<SimulatedTransactionResult | null>(null);

  // PayPal Deposit Modal state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmountINR, setDepositAmountINR] = useState(25000);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositResult, setDepositResult] = useState<any>(null);

  // Presets for quick simulation testing
  const simPresets = [
    {
      label: 'Exceeds Allocation Limit (₹7,500 vs ₹5,000 Cap)',
      merchant: 'Online Electronics Store',
      amount: 7500,
      category: 'Consumer Electronics',
    },
    {
      label: 'Within Allocation Limit (₹3,000)',
      merchant: 'Reliance Digital',
      amount: 3000,
      category: 'Consumer Electronics',
    },
    {
      label: 'Triggers Dual-Key Approval (>₹20,000)',
      merchant: 'Apple Store India',
      amount: 25000,
      category: 'Hardware & Machinery',
    },
    {
      label: 'Predatory Scam Store Block',
      merchant: 'mega-gadgets-sale90.shop',
      amount: 4999,
      category: 'Consumer Electronics',
    },
  ];

  const totalAllocated = allocations.reduce((sum, a) => sum + a.maxAmount, 0);
  const totalSpent = allocations.reduce((sum, a) => sum + a.spentAmount, 0);

  const handleCreateAllocation = () => {
    createAllocation({
      name: allocForm.name || 'Custom Spending Allocation',
      category: allocForm.category,
      merchantPattern: allocForm.merchantPattern,
      maxAmount: Number(allocForm.maxAmount),
      expiryDate: allocForm.expiryDate,
      purpose: allocForm.purpose || 'Guarded spending allocation',
      isRecurring: allocForm.isRecurring,
      requiresDualKey: allocForm.requiresDualKey,
      dualKeyThreshold: allocForm.requiresDualKey ? Number(allocForm.dualKeyThreshold) : undefined,
    });
    setIsCreateOpen(false);
    setAllocForm({
      name: '',
      category: 'Consumer Electronics',
      merchantPattern: '',
      maxAmount: 10000,
      expiryDate: '2026-12-15',
      purpose: '',
      isRecurring: false,
      requiresDualKey: false,
      dualKeyThreshold: 5000,
    });
  };

  const handleRunSimulation = () => {
    const result = evaluateSimulatedTransaction(
      simMerchant,
      Number(simAmount),
      simCategory,
      allocations,
      availableBalance
    );
    setSimResult(result);

    // Record to transaction history
    addTransaction({
      merchant: simMerchant,
      merchantCategory: simCategory,
      amount: Number(simAmount),
      currency: 'INR',
      date: new Date().toISOString(),
      riskScore: result.riskScore,
      riskLevel: result.riskScore > 60 ? 'critical' : result.riskScore > 30 ? 'moderate' : 'low',
      status: result.allowed ? 'protected' : result.requiresDualApproval ? 'flagged' : 'blocked',
      protectionModule: 'virtual-vault',
      details: result.reason,
    });
  };

  const handleDepositPayPal = async () => {
    setIsDepositing(true);
    const res = await depositPayPalFunds(Number(depositAmountINR));
    setIsDepositing(false);
    setDepositResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Module 3: Virtual Vault — Financial Security & Spending Guardrails</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Virtual Spending Vault & Guardrail Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Isolate your core bank account behind programmatic spending allocations, dual-key multi-party approvals, and real-time checkout limit enforcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleVaultFreeze}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-1.5 transition-all ${
              isVaultFrozen
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Snowflake className="w-4 h-4" />
            <span>{isVaultFrozen ? 'Vault is FROZEN (Click to Unlock)' : 'Emergency Freeze'}</span>
          </button>

          <button
            onClick={() => {
              setSimResult(null);
              setIsSimModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white font-semibold text-xs shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Simulate Transaction</span>
          </button>
        </div>
      </div>

      {/* Vault Liquidity Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Vault Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {formatINR(availableBalance)}
            </span>
            <span className="text-xs text-slate-400 font-mono mt-0.5 block">
              ≈ {formatUSD(availableBalance / 86)} (PayPal Sandbox)
            </span>
          </div>
          <button
            onClick={() => {
              setDepositResult(null);
              setIsDepositOpen(true);
            }}
            className="mt-3 text-xs font-bold text-paypal-blue hover:text-paypal-deep flex items-center space-x-1"
          >
            <span>+ Deposit via PayPal Sandbox</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocated Budget Cap</span>
            <div className="w-8 h-8 rounded-xl bg-paypal-subtle text-paypal-blue flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {formatINR(totalAllocated)}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Across {allocations.length} active budget envelopes
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent This Month</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {formatINR(totalSpent)}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}% of allocation consumed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dual-Key Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono block">
              {approvalRequests.filter(r => r.status === 'pending').length} Pending
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              High-value threshold authorization
            </span>
          </div>
        </div>
      </div>

      {/* Active Spending Allocations Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Spending Allocations</h3>
            <p className="text-xs text-slate-500">Virtual single-use and recurring budget envelopes enforcing zero over-draft</p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Spending Allocation</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {allocations.map(alloc => {
            const pct = Math.min(100, Math.round((alloc.spentAmount / alloc.maxAmount) * 100));
            const remaining = alloc.maxAmount - alloc.spentAmount;

            return (
              <div
                key={alloc.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-paypal-blue/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{alloc.name}</h4>
                      <p className="text-[11px] text-slate-500">{alloc.category}</p>
                    </div>
                    {alloc.requiresDualKey && (
                      <span className="p-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200" title="Requires Dual-Key Multi-Signature">
                        2-KEY
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-500 font-sans text-[11px]">Spent / Cap</span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(alloc.spentAmount)} / {formatINR(alloc.maxAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-amber-500' : 'bg-paypal-blue'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
                    {alloc.purpose}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Expires {alloc.expiryDate}</span>
                  <span className="font-semibold text-emerald-600 font-mono">
                    {formatINR(remaining)} Left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual-Key Multi-Sig Approval Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dual-Key Multi-Signature Approvals</h3>
              <p className="text-xs text-slate-500">Secondary authorization queue for transactions exceeding high-value guardrail thresholds</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{approvalRequests.length} Total Audit Records</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {approvalRequests.map(req => (
            <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">{req.id}</span>
                  <StatusBadge status={req.status} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{req.merchant}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{req.reason}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Role: {req.approverRole} • {formatRelativeTime(req.requestedAt)}</span>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <span className="text-base font-extrabold text-slate-900 font-mono mr-2">
                  {formatINR(req.amount)}
                </span>

                {req.status === 'pending' ? (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => resolveApprovalRequest(req.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => resolveApprovalRequest(req.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Resolved {formatRelativeTime(req.resolvedAt || req.requestedAt)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Simulator Modal */}
      <Modal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        title="Virtual Vault Transaction Simulator"
        subtitle="Test spend guardrails, allocation boundaries, and over-draft enforcement"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {/* Quick Presets */}
          <div>
            <span className="text-slate-500 font-semibold block mb-1.5">Load Test Scenarios:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {simPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSimMerchant(preset.merchant);
                    setSimAmount(preset.amount);
                    setSimCategory(preset.category);
                    setSimResult(null);
                  }}
                  className="p-2 rounded-lg border border-slate-200 text-left hover:bg-paypal-subtle hover:border-paypal-blue/30 transition-all"
                >
                  <p className="font-semibold text-slate-800 text-[11px]">{preset.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{preset.merchant} • {formatINR(preset.amount)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Merchant</label>
              <input
                type="text"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={simMerchant}
                onChange={e => setSimMerchant(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Amount (INR)</label>
              <input
                type="number"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={simAmount}
                onChange={e => setSimAmount(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Spending Category</label>
              <select
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={simCategory}
                onChange={e => setSimCategory(e.target.value)}
              >
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Developer & Cloud Services">Developer & Cloud Services</option>
                <option value="Food & Transit">Food & Transit</option>
                <option value="Hardware & Machinery">Hardware & Machinery</option>
                <option value="Uncategorized">Uncategorized</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunSimulation}
              className="px-6 py-2.5 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white font-semibold flex items-center space-x-1.5 shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Evaluate Against Guardrails</span>
            </button>
          </div>

          {/* Simulation Result Presentation */}
          {simResult && (
            <div className={`p-4 rounded-xl border mt-3 animate-fade-in ${
              simResult.allowed 
                ? 'bg-emerald-50 border-emerald-200' 
                : simResult.requiresDualApproval 
                ? 'bg-purple-50 border-purple-200'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-start space-x-3">
                {simResult.allowed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : simResult.requiresDualApproval ? (
                  <Users className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Decision: {simResult.allowed ? 'TRANSACTION ALLOWED' : simResult.requiresDualApproval ? 'DUAL-KEY APPROVAL REQUIRED' : 'TRANSACTION BLOCKED'}
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {simResult.reason}
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-white/70 border border-black/5">
                      <span className="text-slate-400 block text-[9px]">Budget Limit</span>
                      <span className={simResult.checks.allocationLimit === 'pass' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {simResult.checks.allocationLimit.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white/70 border border-black/5">
                      <span className="text-slate-400 block text-[9px]">Vault Balance</span>
                      <span className={simResult.checks.vaultLiquidity === 'pass' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {simResult.checks.vaultLiquidity.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white/70 border border-black/5">
                      <span className="text-slate-400 block text-[9px]">Merchant Risk</span>
                      <span className={simResult.checks.merchantTrust === 'pass' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {simResult.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Create Allocation Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Spending Allocation"
        subtitle="Establish an isolated spending limit for a category or merchant"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Allocation Name</label>
            <input
              type="text"
              placeholder="e.g. Weekly Food & Dining"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={allocForm.name}
              onChange={e => setAllocForm({ ...allocForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Maximum Cap (INR)</label>
              <input
                type="number"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={allocForm.maxAmount}
                onChange={e => setAllocForm({ ...allocForm, maxAmount: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={allocForm.category}
                onChange={e => setAllocForm({ ...allocForm, category: e.target.value })}
              >
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Developer & Cloud Services">Developer & Cloud Services</option>
                <option value="Food & Transit">Food & Transit</option>
                <option value="Hardware & Machinery">Hardware & Machinery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={allocForm.expiryDate}
              onChange={e => setAllocForm({ ...allocForm, expiryDate: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Spending Purpose</label>
            <input
              type="text"
              placeholder="e.g. Budget cap for personal subscriptions"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={allocForm.purpose}
              onChange={e => setAllocForm({ ...allocForm, purpose: e.target.value })}
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-paypal-blue focus:ring-paypal-blue"
                checked={allocForm.requiresDualKey}
                onChange={e => setAllocForm({ ...allocForm, requiresDualKey: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Require Dual-Key Multi-Sig Approval</span>
            </label>
            {allocForm.requiresDualKey && (
              <div className="pl-6 pt-1">
                <span className="text-[11px] text-slate-500 block mb-1">Threshold Amount (INR):</span>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono"
                  value={allocForm.dualKeyThreshold}
                  onChange={e => setAllocForm({ ...allocForm, dualKeyThreshold: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAllocation}
              className="px-5 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold"
            >
              Save Allocation
            </button>
          </div>
        </div>
      </Modal>

      {/* PayPal Sandbox Deposit Modal */}
      <Modal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        title="Deposit Liquidity via PayPal Sandbox"
        subtitle="Funds your Virtual Vault using configured PayPal credentials"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-paypal-subtle border border-paypal-blue/20 text-slate-700">
            <div className="flex items-center space-x-2 text-paypal-deep font-semibold mb-1">
              <CreditCard className="w-4 h-4 text-paypal-blue" />
              <span>PayPal Sandbox Integration</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Connects directly to the backend <code className="bg-white/80 px-1 py-0.5 rounded font-mono">/api/vault/move-money</code> endpoint using sandbox client credentials.
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Deposit Amount (INR)</label>
            <input
              type="number"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={depositAmountINR}
              onChange={e => setDepositAmountINR(Number(e.target.value))}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Equivalent to ≈ {formatUSD(depositAmountINR / 86)} in PayPal USD Sandbox
            </span>
          </div>

          {depositResult && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
              <p className="font-bold text-emerald-900 mb-0.5">✓ Order Authorized in Sandbox</p>
              <p>PayPal Order ID: {depositResult.orderId}</p>
              <p>Mode: {depositResult.isSandboxLive ? 'Live Sandbox API' : 'Simulated Sandbox Pipeline'}</p>
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsDepositOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleDepositPayPal}
              disabled={isDepositing}
              className="px-5 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold flex items-center space-x-1.5 disabled:opacity-60"
            >
              {isDepositing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Authorizing via PayPal...</span>
                </>
              ) : (
                <span>Confirm Sandbox Deposit</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
