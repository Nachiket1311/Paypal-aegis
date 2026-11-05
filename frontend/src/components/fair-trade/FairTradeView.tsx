import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { DigitalAgreement, DeliveryEvidence } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatINR, formatRelativeTime } from '../../lib/utils';
import { 
  FileCheck2, 
  Plus, 
  FileText, 
  ShieldCheck, 
  AlertOctagon, 
  UploadCloud, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Hash, 
  Sparkles,
  GitPullRequest,
  Layers,
  FileCode,
  Printer,
  X,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { generateEvidenceHash } from '../../services/fairTradeService';

export const FairTradeView: React.FC = () => {
  const { 
    agreements, 
    createAgreement, 
    updateAgreementStatus, 
    addDeliveryEvidence, 
    fileDispute 
  } = useAegis();

  // Create Agreement state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    buyerName: '',
    buyerEmail: '',
    sellerName: 'Nachiket Palekar (Aegis Studio)',
    sellerEmail: 'nachiket.design@paypal-aegis.dev',
    amount: 75000,
    deadline: '2026-11-25',
    deliverables: 'Interactive Figma Prototype (30 screens)\nReact & Tailwind Codebase with API integration\nComprehensive unit test suite (>85% coverage)',
    acceptanceCriteria: 'Signed client review within 5 calendar days\nZero critical accessibility bugs (WCAG AA)',
    paymentTerms: '50% escrow milestone upon Milestone 1 delivery, 50% upon final acceptance sign-off.',
  });

  // Selected Agreement Detail Drawer
  const [selectedAgr, setSelectedAgr] = useState<DigitalAgreement | null>(agreements[0] || null);

  // Delivery Evidence Modal state
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<'github_pr' | 'figma' | 'file_upload' | 'email_receipt'>('github_pr');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // Dispute Modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Client initiated unwarranted payment reversal claiming non-delivery after downloading all code.');
  const [clientChat, setClientChat] = useState('Email Nov 2: "Work looks incredible, merged to production."\nNov 4: "Filing chargeback due to internal budget reallocation."');
  const [sellerNotes, setSellerNotes] = useState('All milestones were delivered on schedule and signed off in client Slack channel. GitHub PR #84 was approved by client lead developer.');

  // View Evidence Package Modal state
  const [viewingPackage, setViewingPackage] = useState<DigitalAgreement | null>(null);

  const handleStartCreate = () => {
    setIsConfirmStep(false);
    setIsCreateOpen(true);
  };

  const handleSaveAgreement = () => {
    const deliverablesList = formData.deliverables.split('\n').filter(Boolean);
    const criteriaList = formData.acceptanceCriteria.split('\n').filter(Boolean);

    const newAgr = createAgreement({
      projectName: formData.projectName || 'Custom Freelance Contract',
      buyerName: formData.buyerName || 'Client Name',
      buyerEmail: formData.buyerEmail || 'client@example.com',
      sellerName: formData.sellerName,
      sellerEmail: formData.sellerEmail,
      amount: Number(formData.amount),
      currency: 'INR',
      deadline: formData.deadline,
      deliverables: deliverablesList,
      acceptanceCriteria: criteriaList,
      paymentTerms: formData.paymentTerms,
    });

    setSelectedAgr(newAgr);
    setIsCreateOpen(false);
    setIsConfirmStep(false);
  };

  const handleAttachEvidence = () => {
    if (!selectedAgr) return;
    const finalHash = evidenceUrl.startsWith('http') 
      ? evidenceUrl 
      : generateEvidenceHash(evidenceTitle + evidenceNotes);

    addDeliveryEvidence(selectedAgr.id, {
      title: evidenceTitle || 'Production Delivery Artifact',
      evidenceType,
      urlOrHash: finalHash,
      notes: evidenceNotes || 'Cryptographically verified deliverable package',
    });

    setIsEvidenceModalOpen(false);
    setEvidenceTitle('');
    setEvidenceUrl('');
    setEvidenceNotes('');
  };

  const handleGenerateDispute = () => {
    if (!selectedAgr) return;
    fileDispute(selectedAgr.id, disputeReason, clientChat, sellerNotes);
    setIsDisputeModalOpen(false);
    setViewingPackage(agreements.find(a => a.id === selectedAgr.id) || selectedAgr);
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case 'github_pr':
        return <GitPullRequest className="w-4 h-4 text-purple-600" />;
      case 'figma':
        return <Layers className="w-4 h-4 text-rose-600" />;
      default:
        return <FileCode className="w-4 h-4 text-paypal-blue" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Module 2: Fair Trade Agent — Seller & Freelancer Protection</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Seller Protection & Dispute Shield Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Create milestone-backed digital agreements, anchor cryptographic proof of work, and generate bulletproof AI evidence packages that neutralize fraudulent buyer chargebacks.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-5 py-2.5 rounded-xl bg-paypal-deep hover:bg-paypal-blue text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Digital Agreement</span>
        </button>
      </div>

      {/* Main Split Layout: Agreement List + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agreement Table / List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Digital Agreements ({agreements.length})
              </span>
              <span className="text-xs text-slate-400">Click any contract to inspect</span>
            </div>

            <div className="divide-y divide-slate-100">
              {agreements.map(agr => {
                const isSelected = selectedAgr?.id === agr.id;
                return (
                  <div
                    key={agr.id}
                    onClick={() => setSelectedAgr(agr)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected ? 'bg-paypal-subtle/50 border-l-4 border-paypal-blue' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-semibold text-slate-400">{agr.id}</span>
                          <StatusBadge status={agr.status} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{agr.projectName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Buyer: {agr.buyerName}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900 font-mono block">
                          {formatINR(agr.amount)}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Due: {agr.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100/80 text-[11px] text-slate-500">
                      <span>{agr.deliverables.length} Deliverables</span>
                      <span className="font-medium text-emerald-600">
                        {agr.deliveryEvidence?.length || 0} Verified Proofs Attached
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Agreement Detailed Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {selectedAgr ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Active Contract</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedAgr.projectName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedAgr.buyerName} • {selectedAgr.buyerEmail}</p>
                </div>
                <StatusBadge status={selectedAgr.status} />
              </div>

              {/* Amount and Key Terms */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contract Escrow Amount</span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">{formatINR(selectedAgr.amount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Deadline</span>
                  <span className="font-semibold text-slate-800">{selectedAgr.deadline}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                  <span className="font-medium text-slate-700">{selectedAgr.paymentTerms}</span>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2 uppercase tracking-wider">
                  Agreed Scope Deliverables
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedAgr.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attached Delivery Proofs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Delivery Verification Proofs ({selectedAgr.deliveryEvidence?.length || 0})
                  </span>
                  <button
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="text-xs font-semibold text-paypal-blue hover:text-paypal-deep flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Proof</span>
                  </button>
                </div>

                {!selectedAgr.deliveryEvidence || selectedAgr.deliveryEvidence.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No delivery artifacts attached yet. Attach your PR, Figma link, or file hash.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAgr.deliveryEvidence.map(proof => (
                      <div key={proof.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getEvidenceTypeIcon(proof.evidenceType)}
                            <span className="font-semibold text-slate-900">{proof.title}</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                          {proof.urlOrHash}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">{proof.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dispute Shield & Status Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {selectedAgr.status === 'disputed' ? (
                  <button
                    onClick={() => setViewingPackage(selectedAgr)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Generated Dispute Defense Packet</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateAgreementStatus(selectedAgr.id, 'completed')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => setIsDisputeModalOpen(true)}
                      className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors flex items-center space-x-1"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      <span>File Dispute Shield</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select an agreement on the left to inspect deliverables and dispute records.
            </div>
          )}
        </div>
      </div>

      {/* Create Agreement Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={isConfirmStep ? "Review & Confirm Digital Agreement" : "Create Aegis Digital Agreement"}
        subtitle={isConfirmStep ? "Verify contract terms before anchoring to Fair Trade Escrow" : "Establish legally binding milestone deliverables and payment terms"}
        maxWidth="2xl"
      >
        {!isConfirmStep ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Fintech Mobile App Redesign"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contract Amount (INR)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none font-mono"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Buyer / Client Full Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                  value={formData.buyerName}
                  onChange={e => setFormData({ ...formData, buyerName: e.target.value })}
                  placeholder="e.g. Vikram Malhotra (Apex Ventures)"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Buyer Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                  value={formData.buyerEmail}
                  onChange={e => setFormData({ ...formData, buyerEmail: e.target.value })}
                  placeholder="client@apexventures.io"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Delivery Deadline</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Agreed Deliverables (One per line)</label>
              <textarea
                rows={3}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={formData.deliverables}
                onChange={e => setFormData({ ...formData, deliverables: e.target.value })}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Acceptance Criteria</label>
              <textarea
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
                value={formData.acceptanceCriteria}
                onChange={e => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsConfirmStep(true)}
                className="px-5 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold"
              >
                Proceed to Review →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Project:</span>
                <span className="font-bold text-slate-900">{formData.projectName || 'Custom Freelance Contract'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Buyer:</span>
                <span className="font-semibold text-slate-900">{formData.buyerName} ({formData.buyerEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller:</span>
                <span className="font-semibold text-slate-900">{formData.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Contract Value:</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">{formatINR(formData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deadline:</span>
                <span className="font-semibold text-slate-800">{formData.deadline}</span>
              </div>
            </div>

            <div className="p-3 bg-paypal-subtle/60 border border-paypal-blue/30 rounded-xl text-slate-700 text-[11px] leading-relaxed">
              <span className="font-bold text-paypal-deep block mb-1">Aegis Fair Trade Arbitration Clause:</span>
              Both parties agree that milestone delivery proofs anchored with SHA-256 commit hashes and client written reviews constitute binding factual evidence in payment dispute resolution.
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setIsConfirmStep(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleSaveAgreement}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
              >
                Confirm & Seal Agreement
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Attach Delivery Evidence Modal */}
      <Modal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        title="Attach Proof of Delivery"
        subtitle={`Anchor verified deliverable artifact for ${selectedAgr?.projectName}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Artifact Title</label>
            <input
              type="text"
              placeholder="e.g. GitHub Pull Request #84 (Production Code)"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={evidenceTitle}
              onChange={e => setEvidenceTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Evidence Type</label>
            <select
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={evidenceType}
              onChange={e => setEvidenceType(e.target.value as any)}
            >
              <option value="github_pr">GitHub Pull Request / Git Commit</option>
              <option value="figma">Figma Design File / Prototype Link</option>
              <option value="file_upload">Direct File Upload (SHA-256 Hash)</option>
              <option value="email_receipt">Client Written Sign-Off Record</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Resource Link or SHA-256 Hash</label>
            <input
              type="text"
              placeholder="https://github.com/org/repo/pull/84 or paste SHA-256 hash"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={evidenceUrl}
              onChange={e => setEvidenceUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Delivery Context & Client Sign-Off Notes</label>
            <textarea
              rows={2}
              placeholder="Client reviewed via video call and confirmed all test suites passed."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={evidenceNotes}
              onChange={e => setEvidenceNotes(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsEvidenceModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleAttachEvidence}
              className="px-4 py-2 rounded-xl bg-paypal-blue hover:bg-paypal-deep text-white font-semibold"
            >
              Timestamp & Anchor
            </button>
          </div>
        </div>
      </Modal>

      {/* File Dispute & Generate Evidence Package Modal */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="Generate Fair Trade Dispute Defense Package"
        subtitle={`Assemble evidence rebuttal for ${selectedAgr?.projectName}`}
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dispute Reason / Chargeback Nature</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Client Communication Log</label>
            <textarea
              rows={3}
              placeholder="Paste email transcripts, Slack messages, or chat approvals confirming delivery"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={clientChat}
              onChange={e => setClientChat(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Seller Statement & Scope Fulfillments</label>
            <textarea
              rows={3}
              placeholder="Summary of completed milestones and timelines..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-paypal-blue focus:outline-none"
              value={sellerNotes}
              onChange={e => setSellerNotes(e.target.value)}
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] leading-relaxed">
            <span className="font-bold block mb-0.5">Fintech & Legal Disclaimer:</span>
            Aegis Fair Trade compiles verified timestamps, deliverable hashes, and signed scopes into an objective evidence dossier. It equips you with institutional rebuttal quality but does not automatically guarantee financial reversal from card networks.
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsDisputeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateDispute}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center space-x-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>Compile Dispute Package</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Viewing Generated Dispute Defense Packet Modal */}
      {viewingPackage && viewingPackage.disputeData && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPackage(null)}
          title={`Dispute Defense Package: ${viewingPackage.disputeData.id}`}
          subtitle={`Compiled for ${viewingPackage.projectName}`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">Status</span>
                <span className="font-bold text-slate-900 uppercase">Ready for Submission to PayPal Resolution Center</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold flex items-center space-x-1.5 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export / Print PDF</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
              {viewingPackage.disputeData.evidencePackageSummary}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingPackage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
              >
                Close Artifact
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
