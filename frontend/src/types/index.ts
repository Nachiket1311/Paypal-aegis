export type ModuleType = 
  | 'fraud-guardian' 
  | 'fair-trade' 
  | 'virtual-vault' 
  | 'sovereignty';

export type UserPersona = 'buyer' | 'freelancer' | 'admin';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Transaction {
  id: string;
  merchant: string;
  merchantCategory: string;
  amount: number; // in INR
  currency: 'INR' | 'USD';
  date: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  status: 'protected' | 'flagged' | 'blocked' | 'approved' | 'in_dispute' | 'settled';
  protectionModule: ModuleType;
  details?: string;
  allocationId?: string;
  paypalOrderId?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module: ModuleType;
  timestamp: string;
  actionLabel: string;
  actionRoute: string;
  read: boolean;
}

// Fraud Guardian Types
export interface MerchantAnalysisResult {
  id: string;
  url: string;
  domain: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  summary: string;
  positiveSignals: string[];
  suspiciousIndicators: string[];
  recommendation: string;
  timestamp: string;
  factors: {
    domainAge: string;
    sslStatus: string;
    reputationScore: number;
    priceSanity: string;
    identityVerified: boolean;
    phishingRisk: 'low' | 'moderate' | 'high' | 'critical';
  };
  isSimulated: boolean;
}

export interface EvidenceItem {
  id: string;
  merchantName: string;
  domain: string;
  riskScore: number;
  dateSaved: string;
  notes: string;
  screenshotUrl?: string;
  tags: string[];
}

// Fair Trade Types
export type AgreementStatus = 
  | 'draft' 
  | 'awaiting_acceptance' 
  | 'in_progress' 
  | 'delivered' 
  | 'completed' 
  | 'disputed';

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'submitted' | 'approved';
}

export interface DigitalAgreement {
  id: string;
  projectName: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerEmail: string;
  amount: number;
  currency: 'INR' | 'USD';
  deadline: string;
  deliverables: string[];
  acceptanceCriteria: string[];
  paymentTerms: string;
  status: AgreementStatus;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
  deliveryEvidence?: DeliveryEvidence[];
  disputeData?: DisputeRecord;
}

export interface DeliveryEvidence {
  id: string;
  agreementId: string;
  title: string;
  evidenceType: 'github_pr' | 'figma' | 'file_upload' | 'email_receipt' | 'note';
  urlOrHash: string;
  timestamp: string;
  verified: boolean;
  notes: string;
}

export interface DisputeRecord {
  id: string;
  agreementId: string;
  reason: string;
  clientCommunication: string;
  sellerStatement: string;
  evidencePackageSummary: string;
  generatedDate: string;
  status: 'under_review' | 'evidence_submitted' | 'resolved';
}

// Virtual Vault Types
export interface SpendingAllocation {
  id: string;
  name: string;
  category: string;
  merchantPattern?: string;
  maxAmount: number;
  spentAmount: number;
  expiryDate: string;
  purpose: string;
  isRecurring: boolean;
  requiresDualKey: boolean;
  dualKeyThreshold?: number;
  status: 'active' | 'exhausted' | 'expired' | 'frozen';
  createdAt: string;
}

export interface SimulatedTransactionResult {
  allowed: boolean;
  reason: string;
  merchant: string;
  amount: number;
  category: string;
  allocationMatched?: string;
  remainingAllocation?: number;
  riskScore: number;
  requiresDualApproval: boolean;
  approvalRequestId?: string;
  checks: {
    allocationLimit: 'pass' | 'fail' | 'warn';
    vaultLiquidity: 'pass' | 'fail';
    merchantTrust: 'pass' | 'fail' | 'warn';
    dualKeyTriggered: boolean;
  };
}

export interface DualKeyApprovalRequest {
  id: string;
  merchant: string;
  amount: number;
  currency: 'INR' | 'USD';
  requestedAt: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverRole: string;
  resolvedAt?: string;
}

// Sovereignty Types
export interface DataCategoryItem {
  id: string;
  name: string;
  category: string;
  whatIsCollected: string;
  whyCollected: string;
  howUsed: string;
  isRequired: boolean;
  isEnabled: boolean;
  retentionPeriod: string;
  canDelete: boolean;
  canModify: boolean;
}

export interface PrivacyRequest {
  id: string;
  requestType: 'correction' | 'deletion' | 'consent_withdrawal' | 'export';
  targetCategories: string[];
  status: 'completed' | 'processing' | 'scheduled';
  requestedAt: string;
  completedAt?: string;
  details: string;
  dpdpReference: string;
}

export interface PrivacyAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dpdpCitation?: string;
}
