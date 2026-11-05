import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { DataCategoryItem, PrivacyRequest } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { formatRelativeTime } from '../../lib/utils';
import { 
  Eye, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Trash2, 
  Sliders, 
  Sparkles, 
  Send, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Clock,
  Scale
} from 'lucide-react';

export const SovereigntyView: React.FC = () => {
  const { 
    dataInventory, 
    toggleDataCategory, 
    privacyRequests, 
    submitPrivacyRequest, 
    privacyMessages, 
    askPrivacyAssistant 
  } = useAegis();

  // Privacy Assistant state
  const [chatInput, setChatInput] = useState('');

  // Deletion Request Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoriesForDeletion, setSelectedCategoriesForDeletion] = useState<string[]>([
    'Behavioral Analytics',
    'Device & Location Telemetry'
  ]);
  const [deletionReason, setDeletionReason] = useState('Exercising DPDP Right to Erasure for non-essential telemetry.');

  // Correction Request Modal state
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState('Account & Identity Profile');
  const [correctionDetails, setCorrectionDetails] = useState('Update verified business email address and remove secondary phone number.');

  const sampleAssistantQuestions = [
    'What information do you know about me?',
    'Why do you need my location?',
    'How can I delete my purchase history?',
    'Who has access to my payment details?',
  ];

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    askPrivacyAssistant(chatInput);
    setChatInput('');
  };

  const handleAskQuick = (q: string) => {
    askPrivacyAssistant(q);
  };

  const handleSubmitDeletion = () => {
    submitPrivacyRequest('deletion', selectedCategoriesForDeletion, deletionReason);
    setIsDeleteModalOpen(false);
  };

  const handleSubmitCorrection = () => {
    submitPrivacyRequest('correction', [correctionTarget], correctionDetails);
    setIsCorrectionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2 border border-purple-200">
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>Module 4: Sovereignty Dashboard — Data Privacy & DPDP Alignment</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Sovereignty & DPDP Consent Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Inspect every byte of personal and financial telemetry collected, manage granular consent toggles, and exercise your DPDP rights with automated audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCorrectionModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Request Data Correction
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Request Data Erasure</span>
          </button>
        </div>
      </div>

      {/* DPDP Act Informational Alignment Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-slate-50 border border-purple-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <Scale className="w-5 h-5 text-purple-700 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Aligned with India's Digital Personal Data Protection (DPDP) Act, 2023 Principles
            </h4>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Designed around Data Principal Rights: Right to Access (Sec. 11), Right to Correction & Erasure (Sec. 12), and Right to Grievance Redressal (Sec. 13).
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium sm:text-right shrink-0">
          *Informational alignment demonstration; simulated operations.
        </span>
      </div>

      {/* Main Split: Data Inventory vs AI Privacy Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Data Inventory & Consent Toggles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Data Inventory</h3>
                <p className="text-xs text-slate-500">Every category collected, why it is retained, and your sovereign control</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 font-mono">
                {dataInventory.filter(d => d.isEnabled).length}/{dataInventory.length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dataInventory.map(item => (
                <div key={item.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        {item.isRequired ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Required by Law
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-paypal-blue bg-paypal-subtle px-2 py-0.5 rounded border border-paypal-blue/20">
                            Optional Consent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        <strong className="text-slate-800">What is collected:</strong> {item.whatIsCollected}
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="ml-4 shrink-0">
                      {item.isRequired ? (
                        <span className="text-[11px] font-semibold text-slate-400 cursor-not-allowed" title="Mandatory under RBI/KYC statutes">
                          Locked
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleDataCategory(item.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.isEnabled ? 'bg-paypal-blue' : 'bg-slate-200'
                          }`}
                          title={item.isEnabled ? 'Revoke Consent' : 'Grant Consent'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Purpose & Retention details */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Why Collected:</span>
                      <span>{item.whyCollected}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Retention Period:</span>
                      <span className="font-mono text-slate-700">{item.retentionPeriod}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Plain-Language AI Privacy Assistant Chat */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-paypal-blue/10 flex items-center justify-center text-paypal-blue">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Plain-Language Privacy Assistant</h3>
                  <p className="text-[11px] text-slate-500">Ask anything in plain conversational English</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="AI Assistant Online" />
            </div>

            {/* Quick Chips */}
            <div className="p-3 border-b border-slate-100 bg-white flex flex-wrap gap-1.5">
              {sampleAssistantQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuick(q)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-paypal-subtle text-slate-700 hover:text-paypal-deep transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {privacyMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-paypal-blue text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.dpdpCitation && (
                      <div className="mt-2 pt-2 border-t border-black/10 text-[10px] font-semibold text-purple-700 font-mono">
                        Reference: {msg.dpdpCitation}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 bg-slate-50 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about your data, cookies, or DPDP rights..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-paypal-blue"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Privacy Requests Audit Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Privacy & Erasure Request Audit Log</h3>
            <p className="text-xs text-slate-500">Immutable record of consent revocations and Right to Erasure executions</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{privacyRequests.length} Total Executed</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
          {privacyRequests.map(req => (
            <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-semibold text-slate-400 text-[11px]">{req.id}</span>
                  <StatusBadge status={req.status} />
                  <span className="text-[11px] font-mono text-purple-700 font-semibold">{req.dpdpReference}</span>
                </div>
                <p className="font-medium text-slate-800 mt-1">{req.details}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {req.targetCategories.map((c, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-slate-400 text-[11px] block">{formatRelativeTime(req.requestedAt)}</span>
                <span className="text-emerald-600 font-semibold text-[11px]">✓ Processed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Erasure Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Submit DPDP Right to Erasure Request"
        subtitle="Request permanent purge of optional telemetry and behavioral logs"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] leading-relaxed">
            <span className="font-bold block mb-0.5">Statutory Exemption Notice:</span>
            In compliance with Indian banking and financial regulations, core financial transaction records must be maintained for 7 years and cannot be expunged. All behavioral profiling and optional telemetry will be purged immediately.
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Categories to Purge</label>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {['Behavioral Analytics', 'Device & Location Telemetry', 'Browsing History Cache', 'Marketing & Attribution'].map(cat => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-paypal-blue focus:ring-paypal-blue"
                    checked={selectedCategoriesForDeletion.includes(cat)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedCategoriesForDeletion([...selectedCategoriesForDeletion, cat]);
                      } else {
                        setSelectedCategoriesForDeletion(selectedCategoriesForDeletion.filter(c => c !== cat));
                      }
                    }}
                  />
                  <span className="text-slate-800">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason for Erasure Request</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={deletionReason}
              onChange={e => setDeletionReason(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDeletion}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md"
            >
              Submit Erasure Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Request Correction Modal */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Submit Data Correction Request"
        subtitle="Request modification of out-of-date personal or contact records"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Category</label>
            <select
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={correctionTarget}
              onChange={e => setCorrectionTarget(e.target.value)}
            >
              <option value="Account & Identity Profile">Account & Identity Profile</option>
              <option value="Billing Address & Contact">Billing Address & Contact</option>
              <option value="Fair Trade Seller Profile">Fair Trade Seller Profile</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Requested Corrections</label>
            <textarea
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={correctionDetails}
              onChange={e => setCorrectionDetails(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsCorrectionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCorrection}
              className="px-5 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold"
            >
              Submit Correction Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
