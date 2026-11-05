import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  SecurityAlert, 
  EvidenceItem, 
  DigitalAgreement, 
  SpendingAllocation, 
  DualKeyApprovalRequest, 
  DataCategoryItem, 
  PrivacyRequest, 
  PrivacyAssistantMessage,
  UserPersona,
  MerchantAnalysisResult
} from '../types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_ALERTS, 
  INITIAL_SAVED_EVIDENCE, 
  INITIAL_AGREEMENTS, 
  INITIAL_ALLOCATIONS, 
  INITIAL_APPROVAL_REQUESTS, 
  INITIAL_DATA_INVENTORY, 
  INITIAL_PRIVACY_REQUESTS 
} from '../data/seedData';
import { analyzeMerchant } from '../services/fraudGuardianService';
import { createAgreementDocument, generateDisputeEvidencePackage } from '../services/fairTradeService';
import { getPrivacyAssistantReply } from '../services/sovereigntyService';
import { checkBackendHealth, fetchVaultBalance, createPayPalOrder } from '../services/api';

interface AegisContextType {
  // Navigation & Persona
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPersona: UserPersona;
  setUserPersona: (persona: UserPersona) => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;

  // Transactions & Security Metrics
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  trustScore: number;
  totalProtectedAmount: number;
  suspiciousCount: number;
  activeAlertsCount: number;

  // Alerts
  alerts: SecurityAlert[];
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;

  // Fraud Guardian
  currentAnalysis: MerchantAnalysisResult | null;
  isAnalyzing: boolean;
  runAnalysis: (url: string) => Promise<MerchantAnalysisResult>;
  clearCurrentAnalysis: () => void;
  savedEvidence: EvidenceItem[];
  saveEvidence: (item: Omit<EvidenceItem, 'id' | 'dateSaved'>) => void;
  deleteEvidence: (id: string) => void;

  // Fair Trade
  agreements: DigitalAgreement[];
  createAgreement: (data: Partial<DigitalAgreement>) => DigitalAgreement;
  updateAgreementStatus: (id: string, status: DigitalAgreement['status']) => void;
  addDeliveryEvidence: (agreementId: string, evidence: { title: string; evidenceType: any; urlOrHash: string; notes: string }) => void;
  fileDispute: (agreementId: string, reason: string, clientChat: string, sellerNotes: string) => void;

  // Virtual Vault
  availableBalance: number;
  allocations: SpendingAllocation[];
  approvalRequests: DualKeyApprovalRequest[];
  isVaultFrozen: boolean;
  toggleVaultFreeze: () => void;
  createAllocation: (data: Omit<SpendingAllocation, 'id' | 'spentAmount' | 'status' | 'createdAt'>) => void;
  resolveApprovalRequest: (id: string, action: 'approved' | 'rejected') => void;
  depositPayPalFunds: (amount: number) => Promise<{ success: boolean; orderId?: string; isSandboxLive: boolean }>;

  // Sovereignty & DPDP
  dataInventory: DataCategoryItem[];
  toggleDataCategory: (id: string) => void;
  privacyRequests: PrivacyRequest[];
  submitPrivacyRequest: (type: PrivacyRequest['requestType'], categories: string[], details: string) => void;
  privacyMessages: PrivacyAssistantMessage[];
  askPrivacyAssistant: (question: string) => void;

  // System & Tour
  isBackendOnline: boolean;
  paypalConnected: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  activeTourScenario: string | null;
  runTourScenario: (scenario: 'buyer' | 'freelancer' | 'vault' | 'privacy') => void;
  clearTourScenario: () => void;
}

const AegisContext = createContext<AegisContextType | undefined>(undefined);

export const AegisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userPersona, setUserPersona] = useState<UserPersona>('buyer');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Transactions & Metrics
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);

  // Fraud Guardian
  const [currentAnalysis, setCurrentAnalysis] = useState<MerchantAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [savedEvidence, setSavedEvidence] = useState<EvidenceItem[]>(INITIAL_SAVED_EVIDENCE);

  // Fair Trade
  const [agreements, setAgreements] = useState<DigitalAgreement[]>(INITIAL_AGREEMENTS);

  // Virtual Vault
  const [availableBalance, setAvailableBalance] = useState<number>(215000);
  const [allocations, setAllocations] = useState<SpendingAllocation[]>(INITIAL_ALLOCATIONS);
  const [approvalRequests, setApprovalRequests] = useState<DualKeyApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS);
  const [isVaultFrozen, setIsVaultFrozen] = useState<boolean>(false);

  // Sovereignty
  const [dataInventory, setDataInventory] = useState<DataCategoryItem[]>(INITIAL_DATA_INVENTORY);
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>(INITIAL_PRIVACY_REQUESTS);
  const [privacyMessages, setPrivacyMessages] = useState<PrivacyAssistantMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: 'Hello, I am your Aegis Plain-Language Privacy Assistant. You can ask me what personal data we collect, why we need your location, how to exercise your DPDP Right to Erasure, or who has access to your payment records.',
      timestamp: '10:00 AM',
      dpdpCitation: 'India DPDP Act 2023 Principles: Consent & Transparency',
    }
  ]);

  // System & Modals
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [paypalConnected, setPaypalConnected] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeTourScenario, setActiveTourScenario] = useState<string | null>(null);

  // Health check on mount
  useEffect(() => {
    checkBackendHealth().then(res => {
      setIsBackendOnline(res.online);
    });
    fetchVaultBalance().then(res => {
      if (res.isLive) {
        // approximate USD to INR conversion for unified view
        setAvailableBalance(res.balance * 86);
      }
    });
  }, []);

  // Computed metrics
  const totalProtectedAmount = transactions
    .filter(t => t.status === 'protected' || t.status === 'approved' || t.status === 'blocked')
    .reduce((sum, t) => sum + t.amount, 0);

  const suspiciousCount = transactions.filter(t => t.riskScore >= 60 || t.status === 'blocked' || t.status === 'flagged').length;
  const activeAlertsCount = alerts.filter(a => !a.read).length;

  // Account Trust Score calculation
  const trustScore = isVaultFrozen ? 65 : 94;

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now().toString().slice(-4)}`,
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Fraud Guardian methods
  const runAnalysis = async (url: string) => {
    setIsAnalyzing(true);
    // Simulate real AI network latency for micro-interaction
    await new Promise(r => setTimeout(r, 900));
    const result = await analyzeMerchant(url);
    setCurrentAnalysis(result);
    setIsAnalyzing(false);

    if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
      const newAlert: SecurityAlert = {
        id: `alert-${Date.now()}`,
        title: `High-Risk Storefront Flagged: ${result.domain}`,
        description: `Risk score ${result.riskScore}/100. ${result.recommendation}`,
        severity: result.riskLevel === 'critical' ? 'critical' : 'high',
        module: 'fraud-guardian',
        timestamp: new Date().toISOString(),
        actionLabel: 'Inspect Analysis',
        actionRoute: 'fraud-guardian',
        read: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    return result;
  };

  const clearCurrentAnalysis = () => setCurrentAnalysis(null);

  const saveEvidence = (item: Omit<EvidenceItem, 'id' | 'dateSaved'>) => {
    const newEv: EvidenceItem = {
      ...item,
      id: `ev-${Date.now().toString().slice(-5)}`,
      dateSaved: new Date().toISOString(),
    };
    setSavedEvidence(prev => [newEv, ...prev]);
  };

  const deleteEvidence = (id: string) => {
    setSavedEvidence(prev => prev.filter(e => e.id !== id));
  };

  // Fair Trade methods
  const createAgreement = (data: Partial<DigitalAgreement>) => {
    const newAgr = createAgreementDocument(data);
    setAgreements(prev => [newAgr, ...prev]);
    return newAgr;
  };

  const updateAgreementStatus = (id: string, status: DigitalAgreement['status']) => {
    setAgreements(prev => prev.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
  };

  const addDeliveryEvidence = (agreementId: string, evidence: { title: string; evidenceType: any; urlOrHash: string; notes: string }) => {
    const newEvidence = {
      id: `del-${Date.now().toString().slice(-4)}`,
      agreementId,
      title: evidence.title,
      evidenceType: evidence.evidenceType,
      urlOrHash: evidence.urlOrHash,
      notes: evidence.notes,
      timestamp: new Date().toISOString(),
      verified: true,
    };

    setAgreements(prev => prev.map(a => {
      if (a.id === agreementId) {
        return {
          ...a,
          deliveryEvidence: [...(a.deliveryEvidence || []), newEvidence],
          status: a.status === 'in_progress' ? 'delivered' : a.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));
  };

  const fileDispute = (agreementId: string, reason: string, clientChat: string, sellerNotes: string) => {
    const agreement = agreements.find(a => a.id === agreementId);
    if (!agreement) return;

    const disputeRecord = generateDisputeEvidencePackage(agreement, reason, clientChat, sellerNotes);

    setAgreements(prev => prev.map(a => {
      if (a.id === agreementId) {
        return {
          ...a,
          status: 'disputed',
          disputeData: disputeRecord,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));

    // Add security alert
    setAlerts(prev => [
      {
        id: `alert-${Date.now()}`,
        title: `Fair Trade Dispute Shield Activated: ${agreement.projectName}`,
        description: `Dispute evidence package generated with ${agreement.deliveryEvidence?.length || 0} verified artifacts.`,
        severity: 'high',
        module: 'fair-trade',
        timestamp: new Date().toISOString(),
        actionLabel: 'View Evidence Package',
        actionRoute: 'fair-trade',
        read: false,
      },
      ...prev
    ]);
  };

  // Virtual Vault methods
  const toggleVaultFreeze = () => {
    setIsVaultFrozen(prev => !prev);
  };

  const createAllocation = (data: Omit<SpendingAllocation, 'id' | 'spentAmount' | 'status' | 'createdAt'>) => {
    const newAlloc: SpendingAllocation = {
      ...data,
      id: `alloc-${Date.now().toString().slice(-4)}`,
      spentAmount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setAllocations(prev => [newAlloc, ...prev]);
  };

  const resolveApprovalRequest = (id: string, action: 'approved' | 'rejected') => {
    setApprovalRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: action,
          resolvedAt: new Date().toISOString(),
        };
      }
      return req;
    }));

    const req = approvalRequests.find(r => r.id === id);
    if (req) {
      addTransaction({
        merchant: req.merchant,
        merchantCategory: 'High-Value Authorized',
        amount: req.amount,
        currency: req.currency,
        date: new Date().toISOString(),
        riskScore: action === 'approved' ? 10 : 85,
        riskLevel: action === 'approved' ? 'low' : 'critical',
        status: action === 'approved' ? 'approved' : 'blocked',
        protectionModule: 'virtual-vault',
        details: `Dual-Key Request ${action.toUpperCase()} by Secondary Key Holder`,
      });
    }
  };

  const depositPayPalFunds = async (amountINR: number) => {
    const amountUSD = (amountINR / 86).toFixed(2);
    const res = await createPayPalOrder({
      amount: amountUSD,
      currency: 'USD',
    });

    if (res.success) {
      setAvailableBalance(prev => prev + amountINR);
      addTransaction({
        merchant: 'PayPal Sandbox Escrow Settlement',
        merchantCategory: 'Liquidity Inflow',
        amount: amountINR,
        currency: 'INR',
        date: new Date().toISOString(),
        riskScore: 0,
        riskLevel: 'low',
        status: 'protected',
        protectionModule: 'virtual-vault',
        details: `Funded via PayPal Sandbox Order ID [${res.orderId}]. Status: ${res.status}`,
        paypalOrderId: res.orderId,
      });
    }

    return {
      success: res.success,
      orderId: res.orderId,
      isSandboxLive: res.isSandboxLive,
    };
  };

  // Sovereignty methods
  const toggleDataCategory = (id: string) => {
    setDataInventory(prev => prev.map(item => {
      if (item.id === id && !item.isRequired) {
        return { ...item, isEnabled: !item.isEnabled };
      }
      return item;
    }));
  };

  const submitPrivacyRequest = (type: PrivacyRequest['requestType'], categories: string[], details: string) => {
    const newReq: PrivacyRequest = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      requestType: type,
      targetCategories: categories,
      status: 'completed',
      requestedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      details,
      dpdpReference: `DPDP-2023-${type.toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
    };

    setPrivacyRequests(prev => [newReq, ...prev]);

    if (type === 'deletion' || type === 'consent_withdrawal') {
      setDataInventory(prev => prev.map(item => {
        if (categories.includes(item.category) || categories.includes(item.name)) {
          return { ...item, isEnabled: false };
        }
        return item;
      }));
    }
  };

  const askPrivacyAssistant = (question: string) => {
    const userMsg: PrivacyAssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPrivacyMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const reply = getPrivacyAssistantReply(question);
      setPrivacyMessages(prev => [...prev, reply]);
    }, 400);
  };

  // Guided demo tour scenarios
  const runTourScenario = (scenario: 'buyer' | 'freelancer' | 'vault' | 'privacy') => {
    setActiveTourScenario(scenario);
    if (scenario === 'buyer') {
      setActiveTab('fraud-guardian');
      runAnalysis('https://mega-gadgets-sale90.shop');
    } else if (scenario === 'freelancer') {
      setActiveTab('fair-trade');
      setUserPersona('freelancer');
    } else if (scenario === 'vault') {
      setActiveTab('virtual-vault');
    } else if (scenario === 'privacy') {
      setActiveTab('sovereignty');
      askPrivacyAssistant('Why do you need my location data and how can I delete my telemetry?');
    }
  };

  const clearTourScenario = () => setActiveTourScenario(null);

  return (
    <AegisContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userPersona,
        setUserPersona,
        currency,
        setCurrency,
        transactions,
        addTransaction,
        trustScore,
        totalProtectedAmount,
        suspiciousCount,
        activeAlertsCount,
        alerts,
        markAlertRead,
        dismissAlert,
        currentAnalysis,
        isAnalyzing,
        runAnalysis,
        clearCurrentAnalysis,
        savedEvidence,
        saveEvidence,
        deleteEvidence,
        agreements,
        createAgreement,
        updateAgreementStatus,
        addDeliveryEvidence,
        fileDispute,
        availableBalance,
        allocations,
        approvalRequests,
        isVaultFrozen,
        toggleVaultFreeze,
        createAllocation,
        resolveApprovalRequest,
        depositPayPalFunds,
        dataInventory,
        toggleDataCategory,
        privacyRequests,
        submitPrivacyRequest,
        privacyMessages,
        askPrivacyAssistant,
        isBackendOnline,
        paypalConnected,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        activeTourScenario,
        runTourScenario,
        clearTourScenario,
      }}
    >
      {children}
    </AegisContext.Provider>
  );
};

export const useAegis = () => {
  const context = useContext(AegisContext);
  if (!context) {
    throw new Error('useAegis must be used within an AegisProvider');
  }
  return context;
};
