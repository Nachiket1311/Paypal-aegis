import React, { useState, useEffect } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Search, ShieldAlert, FileText, Lock, Eye, ArrowRight, X } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    transactions, 
    agreements, 
    allocations, 
    dataInventory, 
    setActiveTab 
  } = useAegis();
  const [query, setQuery] = useState('');

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingTxs = q ? transactions.filter(t => 
    t.merchant.toLowerCase().includes(q) || 
    t.merchantCategory.toLowerCase().includes(q) || 
    t.status.toLowerCase().includes(q)
  ) : [];

  const matchingAgreements = q ? agreements.filter(a => 
    a.projectName.toLowerCase().includes(q) || 
    a.buyerName.toLowerCase().includes(q) || 
    a.sellerName.toLowerCase().includes(q)
  ) : [];

  const matchingAllocations = q ? allocations.filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.category.toLowerCase().includes(q)
  ) : [];

  const matchingPrivacy = q ? dataInventory.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.category.toLowerCase().includes(q) || 
    d.whatIsCollected.toLowerCase().includes(q)
  ) : [];

  const hasResults = matchingTxs.length > 0 || matchingAgreements.length > 0 || matchingAllocations.length > 0 || matchingPrivacy.length > 0;

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsSearchOpen(false)} 
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 divide-y divide-slate-100 overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            className="h-14 w-full border-0 bg-transparent pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
            placeholder="Search transactions, merchants, digital agreements, vault rules, or DPDP privacy policies..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-3 text-sm">
          {!q ? (
            <div className="p-6 text-center text-slate-500">
              <p className="font-medium text-slate-700">Quick Navigation</p>
              <p className="text-xs text-slate-400 mt-1">Jump directly to any Aegis security module</p>
              <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                <button
                  onClick={() => navigateTo('fraud-guardian')}
                  className="flex items-center p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-left transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-paypal-blue mr-2" />
                  <span className="text-xs font-semibold text-slate-800">Fraud Guardian</span>
                </button>
                <button
                  onClick={() => navigateTo('fair-trade')}
                  className="flex items-center p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-left transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="text-xs font-semibold text-slate-800">Fair Trade Agent</span>
                </button>
                <button
                  onClick={() => navigateTo('virtual-vault')}
                  className="flex items-center p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-left transition-colors"
                >
                  <Lock className="w-4 h-4 text-amber-600 mr-2" />
                  <span className="text-xs font-semibold text-slate-800">Virtual Vault</span>
                </button>
                <button
                  onClick={() => navigateTo('sovereignty')}
                  className="flex items-center p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-left transition-colors"
                >
                  <Eye className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-xs font-semibold text-slate-800">Sovereignty</span>
                </button>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm font-medium">No records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for 'AWS', 'electronics', 'figma', or 'privacy'.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Transactions */}
              {matchingTxs.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Transactions ({matchingTxs.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingTxs.map(tx => (
                      <div
                        key={tx.id}
                        onClick={() => navigateTo('transactions')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                            ₹
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-xs">{tx.merchant}</p>
                            <p className="text-[11px] text-slate-500">{tx.merchantCategory} • Risk: {tx.riskScore}/100</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-xs text-slate-900">{formatINR(tx.amount)}</p>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agreements */}
              {matchingAgreements.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Digital Agreements ({matchingAgreements.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingAgreements.map(agr => (
                      <div
                        key={agr.id}
                        onClick={() => navigateTo('fair-trade')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="font-medium text-slate-900 text-xs">{agr.projectName}</p>
                            <p className="text-[11px] text-slate-500">{agr.buyerName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{formatINR(agr.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vault Allocations */}
              {matchingAllocations.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Vault Allocations ({matchingAllocations.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchingAllocations.map(alloc => (
                      <div
                        key={alloc.id}
                        onClick={() => navigateTo('virtual-vault')}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Lock className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="font-medium text-slate-900 text-xs">{alloc.name}</p>
                            <p className="text-[11px] text-slate-500">{alloc.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">Cap: {formatINR(alloc.maxAmount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono text-[10px]">ESC</kbd> to exit</span>
          <span className="inline-flex items-center text-paypal-blue font-medium cursor-pointer" onClick={() => setIsSearchOpen(false)}>
            Close Search
          </span>
        </div>
      </div>
    </div>
  );
};
