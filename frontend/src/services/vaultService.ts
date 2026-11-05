import { SpendingAllocation, SimulatedTransactionResult } from '../types';

export function evaluateSimulatedTransaction(
  merchant: string,
  amount: number,
  category: string,
  allocations: SpendingAllocation[],
  availableVaultBalance: number
): SimulatedTransactionResult {
  const normMerchant = merchant.trim().toLowerCase();
  const normCategory = category.trim().toLowerCase();

  // Step 1: Find matching allocation
  const matchingAlloc = allocations.find(a => {
    if (a.status !== 'active') return false;
    const catMatch = a.category.toLowerCase().includes(normCategory) || normCategory.includes(a.category.toLowerCase());
    const merchantMatch = a.merchantPattern && a.merchantPattern.split(',').some(p => normMerchant.includes(p.trim().toLowerCase()));
    return catMatch || merchantMatch;
  });

  const remainingAlloc = matchingAlloc ? (matchingAlloc.maxAmount - matchingAlloc.spentAmount) : 0;
  
  // Risk assessment for simulation
  let riskScore = 12;
  if (normMerchant.includes('luxury') || normMerchant.includes('discount') || normMerchant.includes('cheap') || normMerchant.includes('sale90')) {
    riskScore = 86;
  } else if (normMerchant.includes('unknown') || normMerchant.includes('telegram')) {
    riskScore = 75;
  }

  // Check 1: Liquidity Check
  if (amount > availableVaultBalance) {
    return {
      allowed: false,
      reason: `Transaction of ₹${amount.toLocaleString()} was BLOCKED: Vault balance (₹${availableVaultBalance.toLocaleString()}) is insufficient.`,
      merchant,
      amount,
      category,
      riskScore,
      requiresDualApproval: false,
      checks: {
        allocationLimit: 'pass',
        vaultLiquidity: 'fail',
        merchantTrust: riskScore > 60 ? 'fail' : 'pass',
        dualKeyTriggered: false,
      },
    };
  }

  // Check 2: Allocation Match & Limit Check
  if (matchingAlloc) {
    if (amount > remainingAlloc) {
      return {
        allowed: false,
        reason: `Transaction of ₹${amount.toLocaleString()} was BLOCKED: Exceeds remaining allocation for '${matchingAlloc.name}' (Remaining: ₹${remainingAlloc.toLocaleString()} out of ₹${matchingAlloc.maxAmount.toLocaleString()} cap).`,
        merchant,
        amount,
        category,
        allocationMatched: matchingAlloc.name,
        remainingAllocation: remainingAlloc,
        riskScore,
        requiresDualApproval: false,
        checks: {
          allocationLimit: 'fail',
          vaultLiquidity: 'pass',
          merchantTrust: riskScore > 60 ? 'warn' : 'pass',
          dualKeyTriggered: false,
        },
      };
    }

    // Check 3: Dual-Key Approval Requirement
    if (matchingAlloc.requiresDualKey) {
      const threshold = matchingAlloc.dualKeyThreshold || 0;
      if (amount >= threshold) {
        return {
          allowed: false,
          reason: `Transaction of ₹${amount.toLocaleString()} is PENDING APPROVAL: Dual-Key Security policy triggered for purchases exceeding ₹${threshold.toLocaleString()}. Notification routed to Secondary Key Holder.`,
          merchant,
          amount,
          category,
          allocationMatched: matchingAlloc.name,
          remainingAllocation: remainingAlloc,
          riskScore,
          requiresDualApproval: true,
          approvalRequestId: `appr-${Date.now().toString().slice(-4)}`,
          checks: {
            allocationLimit: 'pass',
            vaultLiquidity: 'pass',
            merchantTrust: 'pass',
            dualKeyTriggered: true,
          },
        };
      }
    }
  } else {
    // If no matching allocation and amount is high, block or warn
    if (amount > 15000) {
      return {
        allowed: false,
        reason: `Transaction of ₹${amount.toLocaleString()} was BLOCKED: No active budget allocation found for category '${category}'. Create a dedicated allocation in Virtual Vault before proceeding.`,
        merchant,
        amount,
        category,
        riskScore,
        requiresDualApproval: false,
        checks: {
          allocationLimit: 'fail',
          vaultLiquidity: 'pass',
          merchantTrust: 'pass',
          dualKeyTriggered: false,
        },
      };
    }
  }

  // Check 4: High risk merchant check
  if (riskScore >= 70) {
    return {
      allowed: false,
      reason: `Transaction of ₹${amount.toLocaleString()} was BLOCKED by Aegis Fraud Guardian: High counterparty risk score (${riskScore}/100) detected on merchant '${merchant}'.`,
      merchant,
      amount,
      category,
      allocationMatched: matchingAlloc?.name,
      remainingAllocation: remainingAlloc,
      riskScore,
      requiresDualApproval: false,
      checks: {
        allocationLimit: 'pass',
        vaultLiquidity: 'pass',
        merchantTrust: 'fail',
        dualKeyTriggered: false,
      },
    };
  }

  // All checks passed!
  return {
    allowed: true,
    reason: `Transaction of ₹${amount.toLocaleString()} to '${merchant}' is PROTECTED and ALLOWED. Enforced under ${matchingAlloc ? `'${matchingAlloc.name}' allocation (₹${(remainingAlloc - amount).toLocaleString()} remaining)` : 'default personal spending rule'}.`,
    merchant,
    amount,
    category,
    allocationMatched: matchingAlloc?.name,
    remainingAllocation: matchingAlloc ? remainingAlloc - amount : undefined,
    riskScore,
    requiresDualApproval: false,
    checks: {
      allocationLimit: 'pass',
      vaultLiquidity: 'pass',
      merchantTrust: 'pass',
      dualKeyTriggered: false,
    },
  };
}
