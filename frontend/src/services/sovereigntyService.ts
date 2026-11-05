import { PrivacyAssistantMessage } from '../types';

export function getPrivacyAssistantReply(userQuestion: string): PrivacyAssistantMessage {
  const q = userQuestion.toLowerCase();
  let text = '';
  let citation = 'DPDP Act 2023 Principles: Consent & Transparency';

  if (q.includes('what information') || q.includes('know about me') || q.includes('what data')) {
    text = `Here is a transparent breakdown of what PayPal Aegis knows about you:
1. **Your Identity:** Name, verified email address, and authentication tokens (strictly required for financial transactions).
2. **Financial Ledger:** Your transaction history, spending limits, and Virtual Vault budget allocations.
3. **Optional Telemetry (if toggled on):** IP-derived city location for impossible-travel anomaly detection, and Fraud Guardian URLs submitted for inspection.
4. **What we NEVER collect:** We never track your personal private messages, biometric templates, or sell your data to data brokers.`;
    citation = 'DPDP Act 2023 Section 5: Notice & Purpose Specification';
  } else if (q.includes('location') || q.includes('where am i') || q.includes('geo')) {
    text = `We collect IP-based city-level location solely for **Velocity & Anomaly Detection**. 

For example, if a payment is initiated in Mumbai and another checkout is attempted from London 12 minutes later, our security engine instantly flags this impossible travel and freezes unauthorized withdrawals. You can disable this anytime under 'Device & Location Telemetry', though it reduces real-time location anomaly defense.`;
    citation = 'DPDP Act 2023 Section 6(1): Reasonable Purpose Limitation';
  } else if (q.includes('delete') || q.includes('erasure') || q.includes('remove my data') || q.includes('purchase history')) {
    text = `Under India's Digital Personal Data Protection (DPDP) Act, you have the **Right to Erasure**:

- **Telemetry & Browsing Data:** Can be purged immediately upon your request via the "Submit Erasure Request" button below.
- **Financial & Purchase Records:** Under Reserve Bank of India (RBI) and statutory financial compliance regulations, transaction ledger records must be preserved for 7 years to prevent money laundering and settle disputes. However, all marketing and behavioral profiling linked to those records is permanently purged.`;
    citation = 'DPDP Act 2023 Section 12(3): Right to Correction & Erasure';
  } else if (q.includes('who has access') || q.includes('third party') || q.includes('share') || q.includes('sell')) {
    text = `Your data is **never sold or rented** to advertising brokers. Access is restricted strictly to:
1. **Yourself:** Full visibility via this Sovereignty Dashboard.
2. **PayPal Settlement Network:** The banking pipeline required to authorize and capture your payments.
3. **Aegis Local AI Shield:** Operates with client-side or sandboxed inference without training global third-party models on your private financial records.`;
    citation = 'DPDP Act 2023 Section 8: Obligations of Data Fiduciary';
  } else {
    text = `PayPal Aegis is built with a **Privacy-by-Design** architecture aligned with the Indian Digital Personal Data Protection (DPDP) Act. You maintain sovereign ownership of your data, the right to inspect all stored categories, the right to revoke consent for optional telemetry at any second, and the right to lodge grievance requests.`;
    citation = 'DPDP Act 2023: Fundamental Data Principal Rights';
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dpdpCitation: citation,
  };
}
