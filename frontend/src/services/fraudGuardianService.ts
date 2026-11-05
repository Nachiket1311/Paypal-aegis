import { MerchantAnalysisResult, RiskLevel } from '../types';

export function extractDomain(inputUrl: string): string {
  try {
    let clean = inputUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return inputUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].split('?')[0];
  }
}

export function isValidUrl(inputUrl: string): boolean {
  if (!inputUrl || inputUrl.trim().length < 3) return false;
  try {
    let clean = inputUrl.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const url = new URL(clean);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

export async function analyzeMerchant(urlInput: string): Promise<MerchantAnalysisResult> {
  const domain = extractDomain(urlInput).toLowerCase();
  const lowerUrl = urlInput.toLowerCase();

  // Deterministic analysis with realistic heuristic evaluation
  let riskScore = 15;
  let riskLevel: RiskLevel = 'low';
  const suspicious: string[] = [];
  const positive: string[] = [];
  
  let domainAge = '3+ years';
  let sslStatus = 'Valid EV SSL (TLS 1.3)';
  let priceSanity = 'Normal retail pricing observed';
  let identityVerified = true;
  let phishingRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let summary = '';
  let recommendation = '';

  // Check 1: Known or highly suspicious TLDs and keywords
  const suspiciousTlds = ['.top', '.xyz', '.shop', '.buzz', '.fit', '.tk', '.cc', '.live', '.monster'];
  const phishingKeywords = ['paypal', 'paypa1', 'secure-login', 'verify-account', 'banking', 'apple-id', 'discount90', 'free-gift'];
  const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
  const hasPhishingWord = phishingKeywords.some(word => domain.includes(word) && !domain.endsWith('paypal.com'));

  if (hasPhishingWord) {
    riskScore += 55;
    phishingRisk = 'critical';
    suspicious.push(`Deceptive brand imitation: domain contains '${phishingKeywords.find(w => domain.includes(w))}' outside verified primary registrar.`);
    suspicious.push('Typosquatting or spoofed authentication path detected.');
    identityVerified = false;
  }

  if (hasSuspiciousTld) {
    riskScore += 25;
    domainAge = '4 days old (registered recently)';
    suspicious.push(`High-risk Top-Level Domain (TLD) '${domain.slice(domain.lastIndexOf('.'))}' frequently associated with disposable scam store campaigns.`);
  }

  // Check 2: Fake discount patterns
  if (lowerUrl.includes('sale90') || lowerUrl.includes('cheap') || lowerUrl.includes('90off') || lowerUrl.includes('outlet')) {
    riskScore += 20;
    priceSanity = 'Predatory discounts (>85% off MSRP) detected';
    suspicious.push('Unrealistic pricing tier: High-demand luxury/electronics offered at 80-95% below market rate.');
  }

  // Check 3: Domain characteristics
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    riskScore += 12;
    suspicious.push(`Excessive hyphenation (${hyphenCount} hyphens) in domain name, typical of automated phishing domain generators.`);
  }

  const numbersInDomain = (domain.match(/[0-9]/g) || []).length;
  if (numbersInDomain >= 3) {
    riskScore += 10;
    suspicious.push('High numerical entropy in domain structure.');
  }

  // Check 4: Positive trust signals if domain is established
  const knownLegitDomains = ['amazon.in', 'flipkart.com', 'swiggy.com', 'zomato.com', 'zerodha.com', 'apple.com', 'patagonia-authentic.in', 'github.com', 'paypal.com'];
  if (knownLegitDomains.some(d => domain.includes(d))) {
    riskScore = Math.min(riskScore, 8);
    positive.push('Verified enterprise identity with active Extended Validation (EV) certificate.');
    positive.push('Multi-year domain registration with reputable registrar (MarkMonitor / DigiCert).');
    positive.push('Clean public fraud telemetry: zero active phishing reports across global threat feeds.');
    positive.push('Standard merchant consumer arbitration & dispute return policies published.');
  } else if (riskScore < 30) {
    positive.push('Valid HTTPS TLS 1.3 certificate issued by recognized Certificate Authority.');
    positive.push('Standard corporate contact details and customer support channel indexed.');
    positive.push('No active listings on Google Safe Browsing or PhishTank blacklists.');
  } else {
    positive.push('Standard HTTPS encryption active (Note: basic SSL does not guarantee seller legitimacy).');
  }

  // Normalize score
  riskScore = Math.min(99, Math.max(5, riskScore));

  // Categorize
  if (riskScore < 30) {
    riskLevel = 'low';
    summary = `Merchant '${domain}' exhibits low risk indicators. Security infrastructure, domain registration longevity, and pricing metrics reflect a legitimate commercial store.`;
    recommendation = 'Safe to proceed. Standard PayPal buyer protection covers eligible physical and digital purchases.';
  } else if (riskScore < 60) {
    riskLevel = 'moderate';
    domainAge = '7 months old';
    summary = `Caution advised. '${domain}' shows moderate anomalies, such as recent domain creation or ambiguous merchant business registration.`;
    recommendation = 'Verify merchant return policies and avoid direct bank transfers. Use PayPal Aegis Virtual Vault with a single-use allocation limit.';
  } else if (riskScore < 80) {
    riskLevel = 'high';
    domainAge = '23 days old';
    identityVerified = false;
    summary = `Elevated risk detected on '${domain}'. Indicators show predatory discount claims, hidden registrant identity, and irregular checkout endpoints.`;
    recommendation = 'Transaction not recommended. High probability of counterfeit goods, non-delivery, or recurring hidden billing.';
  } else {
    riskLevel = 'critical';
    domainAge = '3 days old';
    identityVerified = false;
    phishingRisk = 'critical';
    sslStatus = 'Basic DV Certificate (Domain-validated only, no organizational vetting)';
    summary = `CRITICAL THREAT: '${domain}' matches active malicious e-commerce scam templates. Unrealistic discounts and high domain entropy indicate an active phishing or payment siphon trap.`;
    recommendation = 'DO NOT PROCEED. Immediate checkout block initiated by Aegis Fraud Guardian to protect your funds.';
  }

  return {
    id: `eval-${Date.now().toString().slice(-6)}`,
    url: urlInput,
    domain,
    riskScore,
    riskLevel,
    summary,
    positiveSignals: positive,
    suspiciousIndicators: suspicious,
    recommendation,
    timestamp: new Date().toISOString(),
    factors: {
      domainAge,
      sslStatus,
      reputationScore: 100 - riskScore,
      priceSanity,
      identityVerified,
      phishingRisk,
    },
    isSimulated: true,
  };
}
