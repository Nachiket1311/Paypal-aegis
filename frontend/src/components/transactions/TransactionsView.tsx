import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { RecentActivityTable } from '../overview/RecentActivityTable';
import { Download, History, Shield, Filter, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const TransactionsView: React.FC = () => {
  const { transactions } = useAegis();
  const [downloadMsg, setDownloadMsg] = useState(false);

  const handleExportCSV = () => {
    const headers = ['ID', 'Merchant', 'Category', 'Amount (INR)', 'Risk Score', 'Status', 'Module', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      `"${t.merchant}"`,
      `"${t.merchantCategory}"`,
      t.amount,
      t.riskScore,
      t.status,
      t.protectionModule,
      t.date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `paypal_aegis_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-paypal-blue" />
            <span>Immutable Security Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Transaction Forensics & Protection History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Complete cryptographic audit trail of every intercepted threat, Virtual Vault spending rule, and Fair Trade escrow release.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {downloadMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Ledger export successfully downloaded to your device.</span>
        </div>
      )}

      {/* Main Ledger Table */}
      <RecentActivityTable limit={0} showHeader={true} />
    </div>
  );
};
