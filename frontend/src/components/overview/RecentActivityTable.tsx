import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Transaction, ModuleType } from '../../types';
import { RiskBadge, StatusBadge } from '../common/Badge';
import { formatINR, formatRelativeTime } from '../../lib/utils';
import { Search, Filter, ArrowUpDown, Shield, Lock, FileCheck2, Eye, ExternalLink } from 'lucide-react';

export const RecentActivityTable: React.FC<{ limit?: number; showHeader?: boolean }> = ({ 
  limit = 6,
  showHeader = true 
}) => {
  const { transactions, setActiveTab } = useAegis();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter & Sort
  const filtered = transactions
    .filter(t => {
      const matchSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMod = filterModule === 'all' || t.protectionModule === filterModule;
      const matchStat = filterStatus === 'all' || t.status === filterStatus;
      return matchSearch && matchMod && matchStat;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const getModuleBadge = (module: ModuleType) => {
    switch (module) {
      case 'fraud-guardian':
        return (
          <span className="inline-flex items-center text-xs font-medium text-paypal-deep bg-paypal-subtle px-2 py-0.5 rounded-md">
            <Shield className="w-3 h-3 mr-1 text-paypal-blue" />
            Fraud Guardian
          </span>
        );
      case 'fair-trade':
        return (
          <span className="inline-flex items-center text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            <FileCheck2 className="w-3 h-3 mr-1 text-emerald-600" />
            Fair Trade
          </span>
        );
      case 'virtual-vault':
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
            <Lock className="w-3 h-3 mr-1 text-amber-600" />
            Virtual Vault
          </span>
        );
      case 'sovereignty':
        return (
          <span className="inline-flex items-center text-xs font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
            <Eye className="w-3 h-3 mr-1 text-purple-600" />
            Sovereignty
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {showHeader && (
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Protected Activity</h3>
            <p className="text-xs text-slate-500">Live multi-agent transaction protection ledger</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter merchant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-paypal-blue w-36 sm:w-44"
              />
            </div>

            {/* Filter Module */}
            <select
              value={filterModule}
              onChange={e => setFilterModule(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-paypal-blue"
            >
              <option value="all">All Modules</option>
              <option value="fraud-guardian">Fraud Guardian</option>
              <option value="fair-trade">Fair Trade</option>
              <option value="virtual-vault">Virtual Vault</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-paypal-blue"
            >
              <option value="all">All Statuses</option>
              <option value="protected">Protected</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-5">Merchant / Recipient</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Protection Module</th>
              <th className="py-3.5 px-4">Risk Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No matching transaction records found.
                </td>
              </tr>
            ) : (
              displayed.map(tx => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900 group-hover:text-paypal-blue transition-colors">
                      {tx.merchant}
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.merchantCategory}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-xs">
                    {formatINR(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getModuleBadge(tx.protectionModule)}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={tx.riskLevel} score={tx.riskScore} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {formatRelativeTime(tx.date)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-paypal-blue hover:bg-paypal-subtle transition-colors"
                      title="Inspect Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer view all link */}
      {limit && (
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-paypal-blue hover:text-paypal-deep"
          >
            View Complete Transaction Ledger ({transactions.length} Records) →
          </button>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    Transaction Forensics: {selectedTx.id}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">{selectedTx.merchant}</h4>
                </div>
                <StatusBadge status={selectedTx.status} />
              </div>

              <div className="py-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Amount</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">{formatINR(selectedTx.amount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Timestamp</span>
                    <span className="font-semibold text-slate-700">{new Date(selectedTx.date).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Protection Module</span>
                    <div className="mt-1">{getModuleBadge(selectedTx.protectionModule)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Risk Assessment</span>
                    <div className="mt-1"><RiskBadge level={selectedTx.riskLevel} score={selectedTx.riskScore} /></div>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Aegis AI Security Audit Log</span>
                  <p className="p-3 rounded-xl bg-paypal-subtle/50 text-slate-700 text-xs border border-paypal-blue/20 leading-relaxed">
                    {selectedTx.details || 'Standard verification passed. Merchant authenticated against trusted commerce repository.'}
                  </p>
                </div>

                {selectedTx.paypalOrderId && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                    PayPal Sandbox Order Ref: {selectedTx.paypalOrderId}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
