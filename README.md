# PayPal Aegis — AI-Powered Digital Trust & Payment Protection Platform

PayPal Aegis is an intelligent, proactive digital trust layer that transforms traditional payments into secure, autonomous transactions. It sits between users, businesses, and payment rails—analyzing counterparty risk, verifying deliverables, protecting freelancers from unfair chargebacks, safeguarding liquid capital in virtual spending vaults, and guaranteeing personal data sovereignty under India's Digital Personal Data Protection (DPDP) Act.

---

## 🛡️ Key Pillars & The 4 AI Protection Modules

### 1. Fraud Guardian — Buyer Protection
- **Pre-Checkout Risk Inspection**: Real-time evaluation of merchant domains, domain registration age, SSL/TLS certificate validity, predatory discount patterns (>85% off MSRP), lookalike brand phishing vectors, and WHOIS privacy anomalies.
- **Risk Scoring Engine**: Deterministic & AI scoring from 0–100 mapped to clear risk tiers: *Low Risk (0–29)*, *Moderate Risk (30–59)*, *High Risk (60–79)*, and *Critical Risk (80–100)*.
- **Buyer Evidence Vault**: Save merchant audit reports, attach screenshots and DOM snapshots, and store evidence for PayPal Resolution Center disputes.

### 2. Fair Trade Agent — Seller & Freelancer Protection
- **Milestone-Backed Digital Agreements**: Create binding scope agreements with agreed milestones, deliverables, payment terms, and clear acceptance criteria.
- **Delivery Evidence Hashing**: Attach GitHub Pull Request links, Figma prototypes, and work artifacts with cryptographically simulated SHA-256 deliverable timestamps.
- **Dispute Shield & Rebuttal Generator**: Compiles an institutional-grade Dispute Defense Packet including signed agreements, deliverable proofs, timestamps, and client communications to neutralize fraudulent chargebacks.

### 3. Virtual Vault — Financial Security & Spending Guardrails
- **Isolated Budget Envelopes**: Create categorical or merchant-specific spending allocations (e.g. ₹5,000 for Online Electronics, ₹25,000 for Cloud Services) that prevent unexpected overdrafts.
- **Transaction Simulator**: Real-time evaluation against allocation caps, available balance, counterparty reputation, and policy rules with step-by-step audit trails.
- **Dual-Key Multi-Signature Approvals**: High-value transactions automatically trigger secondary approver authorization before funds can move.
- **PayPal Sandbox Liquidity Integration**: Directly authorized via PayPal Sandbox REST API using stored credentials.
- **Emergency Vault Freeze**: Instantly freeze all outflows with a single click.

### 4. Sovereignty Dashboard — Data Privacy & DPDP Alignment
- **Granular Data Inventory**: Complete transparency into every byte collected (Identity, Geolocation, Financial Ledgers, Behavioral Telemetry, Dispute Vault).
- **Interactive Consent Controls**: Real-time toggles to revoke consent for non-essential telemetry and tracking.
- **Plain-Language Privacy Assistant**: Interactive AI assistant answering questions about data usage, retention, and erasure in simple conversational terms.
- **DPDP Act (2023) Alignment**: Educational interface supporting Data Principal rights: Right to Information (Sec. 11), Right to Correction & Erasure (Sec. 12), and Right to Grievance Redressal (Sec. 13).

---

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Design System**: Premium Fintech UI combining Stripe aesthetic quality, Linear micro-interactions, and banking-grade security status indicators
- **Backend**: FastAPI (Python 3.14), Uvicorn, HTTPX
- **Payment Rail**: PayPal Sandbox REST API (OAuth2 Client Credentials, Orders v2 API)
- **AI Engine**: Modular AI Service layer with deterministic heuristic analysis and Gemini API extensibility

---

## ⚡ Running the Application

### 1. Backend (FastAPI)
The backend is located in the `backend/` directory and utilizes the pre-configured PayPal Sandbox credentials in `backend/.env`:
```bash
# Activate virtual environment
source backend/venv/bin/activate

# Start FastAPI server on port 8000
uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
```

### 2. Frontend (React + Vite)
The frontend is located in the `frontend/` directory:
```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Run Vite dev server on port 3000
npm run dev -- --host 127.0.0.1 --port 3000

# Or build for production
npm run build
```

Open your browser at **`http://localhost:3000`** to access PayPal Aegis.

---

## 🎯 4 One-Click Demo Scenarios

The platform includes an interactive **Guided Prototype Tour** bar at the top of every screen:

1. **Buyer Scenario**: Pre-populates a suspicious storefront (`https://mega-gadgets-sale90.shop`), runs Fraud Guardian analysis, flags critical risk (89/100), exposes predatory pricing anomalies, and saves evidence to the Vault.
2. **Freelancer Scenario**: Opens Fair Trade Agent, inspects the *Fintech UI Redesign* contract with milestone deliverables, reviews verified GitHub PR deliverable proofs, and generates an official Dispute Defense Packet.
3. **Financial Security Scenario**: Opens Virtual Vault, attempts a checkout of ₹7,500 against a ₹5,000 Online Shopping allocation, demonstrates real-time Aegis Over-Limit Protection block with policy explanation, and simulates a ₹3,000 transaction that succeeds.
4. **Privacy Scenario**: Opens Sovereignty Dashboard, asks the Privacy Assistant about location telemetry usage, toggles off Behavioral Tracking, and submits a simulated DPDP Right to Erasure request.

---

## 🔒 Security & Privacy Notice
*All balances, transactions, and privacy erasure requests in this prototype operate in simulation mode or PayPal Sandbox environment. Secret keys are securely stored in backend environment variables and never exposed to client-side code.*
