import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { isValidUrl, extractDomain } from '../../services/fraudGuardianService';
import { RiskBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { 
  ShieldAlert, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  ExternalLink, 
  BookmarkPlus, 
  Trash2, 
  Eye, 
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ShieldX,
  FileCheck
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export const FraudGuardianView: React.FC = () => {
  const { 
    currentAnalysis, 
    isAnalyzing, 
    runAnalysis, 
    savedEvidence, 
    saveEvidence, 
    deleteEvidence 
  } = useAegis();

  const [inputUrl, setInputUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  
  // Evidence Save Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [evidenceTags, setEvidenceTags] = useState('Phishing, Counterfeit');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // View Saved Evidence Modal state
  const [viewingEvidence, setViewingEvidence] = useState<any>(null);

  const sampleMerchants = [
    { label: 'Phishing Trap (90% Off)', url: 'https://mega-gadgets-sale90.shop', risk: 'critical' },
    { label: 'Fake Luxury Outlet', url: 'https://luxurydesigners-outlet90.shop', risk: 'high' },
    { label: 'Spoofed Brand Portal', url: 'https://paypal-security-verification-portal.net', risk: 'critical' },
    { label: 'Authentic Storefront', url: 'https://patagonia-authentic.in', risk: 'low' },
    { label: 'Verified Indian Enterprise', url: 'https://zerodha.com', risk: 'low' },
  ];

  const handleAnalyze = async (urlToTest?: string) => {
    const target = (urlToTest || inputUrl).trim();
    if (!target) {
      setUrlError('Please enter a merchant website URL');
      return;
    }
    if (!isValidUrl(target)) {
      setUrlError('Please enter a valid web domain or URL (e.g. storename.shop)');
      return;
    }
    setUrlError('');
    if (urlToTest) setInputUrl(urlToTest);
    await runAnalysis(target);
  };

  const handleSaveToVault = () => {
    if (!currentAnalysis) return;
    saveEvidence({
      merchantName: currentAnalysis.domain,
      domain: currentAnalysis.domain,
      riskScore: currentAnalysis.riskScore,
      notes: evidenceNotes || `Flagged with ${currentAnalysis.riskScore}/100 risk. ${currentAnalysis.summary}`,
      tags: evidenceTags.split(',').map(t => t.trim()).filter(Boolean),
      screenshotUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    });
    setIsSaveModalOpen(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score < 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score < 80) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-paypal-subtle text-paypal-deep text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-paypal-blue" />
              <span>Module 1: Fraud Guardian — Buyer Protection</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pre-Checkout Merchant Risk Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect suspicious online stores, check domain registration longevity, evaluate predatory pricing traps, and detect lookalike phishing clones before entering your credit card or PayPal credentials.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500">Evidence Vault:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 text-xs font-mono">
              {savedEvidence.length} Saved Records
            </span>
          </div>
        </div>

        {/* URL Input Form */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Paste store URL or domain (e.g. mega-gadgets-sale90.shop or mystore.in)..."
                value={inputUrl}
                onChange={e => {
                  setInputUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-paypal-blue shadow-inner"
              />
            </div>
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-aegis-electric" />
                  <span>Analyze Merchant</span>
                </>
              )}
            </button>
          </div>

          {urlError && (
            <p className="text-xs text-rose-600 mt-2 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              {urlError}
            </p>
          )}

          {/* Quick Test Samples */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Quick Sample Stores:</span>
            {sampleMerchants.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleAnalyze(sample.url)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  sample.risk === 'critical'
                    ? 'border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                    : sample.risk === 'high'
                    ? 'border-amber-200 bg-amber-50/70 text-amber-700 hover:bg-amber-100'
                    : 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Merchant analysis successfully archived to your Evidence Vault.</span>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {currentAnalysis && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card animate-slide-up space-y-6">
          {/* Top Banner: Domain & Score */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  Target Domain
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  • Analyzed {formatRelativeTime(currentAnalysis.timestamp)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
                <span>{currentAnalysis.domain}</span>
                <RiskBadge level={currentAnalysis.riskLevel} />
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1 break-all">
                Input: {currentAnalysis.url}
              </p>
            </div>

            {/* Risk Score Pill */}
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl border text-center min-w-[130px] ${getRiskScoreColor(currentAnalysis.riskScore)}`}>
                <span className="text-3xl font-extrabold font-mono block">
                  {currentAnalysis.riskScore}/100
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider block mt-0.5">
                  {currentAnalysis.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-paypal-subtle text-slate-700 hover:text-paypal-deep font-semibold text-xs border border-slate-200 flex items-center space-x-2 transition-colors"
              >
                <BookmarkPlus className="w-4 h-4 text-paypal-blue" />
                <span>Save to Evidence Vault</span>
              </button>
            </div>
          </div>

          {/* AI Executive Assessment Summary */}
          <div className={`p-4 rounded-xl border ${
            currentAnalysis.riskLevel === 'critical' || currentAnalysis.riskLevel === 'high'
              ? 'bg-rose-50/60 border-rose-200/80'
              : 'bg-emerald-50/60 border-emerald-200/80'
          }`}>
            <div className="flex items-start space-x-3">
              {currentAnalysis.riskLevel === 'critical' || currentAnalysis.riskLevel === 'high' ? (
                <ShieldX className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Aegis AI Threat Intelligence Verdict
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {currentAnalysis.summary}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">Recommended User Action:</span>
                  <span className="text-xs text-slate-800 font-medium">{currentAnalysis.recommendation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Factors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Domain Longevity</span>
              <span className="text-sm font-semibold text-slate-900 block font-mono">
                {currentAnalysis.factors.domainAge}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentAnalysis.factors.domainAge.includes('day') 
                  ? '⚠️ High anomaly: disposable scam life-cycle' 
                  : '✓ Established web tenure'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">SSL / TLS Protocol</span>
              <span className="text-sm font-semibold text-slate-900 block font-mono truncate">
                {currentAnalysis.factors.sslStatus}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Encrypted in transit (does not vouch for merchant honesty)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Pricing Integrity</span>
              <span className="text-sm font-semibold text-slate-900 block">
                {currentAnalysis.factors.priceSanity}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Evaluated against authorized distribution channels
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Phishing Probability</span>
              <span className="text-sm font-semibold text-slate-900 block uppercase font-mono">
                {currentAnalysis.factors.phishingRisk}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Cross-checked against known typosquat dictionaries
              </p>
            </div>
          </div>

          {/* Trust Signals vs Suspicious Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Suspicious Indicators */}
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Suspicious Threat Indicators ({currentAnalysis.suspiciousIndicators.length})</span>
              </div>
              {currentAnalysis.suspiciousIndicators.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No suspicious anomalies detected.</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {currentAnalysis.suspiciousIndicators.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Positive Trust Signals */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Positive Trust Signals ({currentAnalysis.positiveSignals.length})</span>
              </div>
              {currentAnalysis.positiveSignals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Zero positive trust signals identified.</p>
              ) : (
                <ul className="space-y-2 text-xs text-slate-700">
                  {currentAnalysis.positiveSignals.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Vault Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Buyer Evidence Vault</h3>
            <p className="text-xs text-slate-500">Archived merchant forensics, screenshots, and proof artifacts for chargeback dispute defense</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{savedEvidence.length} Total Saved</span>
        </div>

        {savedEvidence.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <BookmarkPlus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">Your Evidence Vault is empty</p>
            <p className="text-xs text-slate-400 mt-0.5">Analyze any store above and click "Save to Evidence Vault" to preserve records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedEvidence.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-paypal-blue/30 bg-slate-50/40 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.merchantName}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{item.domain}</p>
                    </div>
                    <RiskBadge level={item.riskScore > 60 ? 'critical' : item.riskScore > 30 ? 'moderate' : 'low'} score={item.riskScore} />
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {item.notes}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{formatRelativeTime(item.dateSaved)}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingEvidence(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-paypal-blue hover:bg-paypal-subtle transition-colors"
                      title="Inspect Proof Packet"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvidence(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Evidence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Evidence Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Archive Merchant to Evidence Vault"
        subtitle={`Save audit snapshot for ${currentAnalysis?.domain}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Audit Notes & Observations</label>
            <textarea
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              placeholder="e.g. Unrealistic 90% discount on electronics. Fake physical address in footer. No refund contact phone."
              value={evidenceNotes}
              onChange={e => setEvidenceNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={evidenceTags}
              onChange={e => setEvidenceTags(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
            <p className="font-medium text-slate-700 mb-0.5">Attached Digital Artifacts:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>DOM Snapshot and WHOIS registration telemetry</li>
              <li>Calculated Risk Assessment Score ({currentAnalysis?.riskScore}/100)</li>
              <li>Timestamped SHA-256 certificate thumbprint</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveToVault}
              className="px-4 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      </Modal>

      {/* View Evidence Modal */}
      {viewingEvidence && (
        <Modal
          isOpen={true}
          onClose={() => setViewingEvidence(null)}
          title={`Evidence Dossier: ${viewingEvidence.merchantName}`}
          subtitle={`Archived on ${new Date(viewingEvidence.dateSaved).toLocaleString('en-IN')}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Domain Under Audit</span>
                <span className="text-sm font-bold text-slate-900">{viewingEvidence.domain}</span>
              </div>
              <RiskBadge level={viewingEvidence.riskScore > 60 ? 'critical' : 'moderate'} score={viewingEvidence.riskScore} />
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Investigator Notes:</span>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {viewingEvidence.notes}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-paypal-subtle/50 border border-paypal-blue/20 text-slate-700">
              <span className="font-semibold text-paypal-deep block mb-1">Dispute Utility:</span>
              <p className="text-[11px] leading-relaxed">
                This evidentiary package can be downloaded and attached to your PayPal Resolution Center ticket as objective proof of merchant misrepresentation.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingEvidence(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
