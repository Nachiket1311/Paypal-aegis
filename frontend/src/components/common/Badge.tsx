import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: 'bg-paypal-subtle text-paypal-deep border border-paypal-blue/20',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel; score?: number }> = ({ level, score }) => {
  const configs = {
    low: {
      label: 'Low Risk',
      variant: 'success' as const,
      dot: 'bg-emerald-500',
    },
    moderate: {
      label: 'Moderate Risk',
      variant: 'warning' as const,
      dot: 'bg-amber-500',
    },
    high: {
      label: 'High Risk',
      variant: 'danger' as const,
      dot: 'bg-orange-500',
    },
    critical: {
      label: 'Critical Risk',
      variant: 'danger' as const,
      dot: 'bg-rose-600',
    },
  }[level];

  return (
    <Badge variant={configs.variant}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${configs.dot}`} />
      {configs.label} {score !== undefined && `(${score})`}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const format = status.replace('_', ' ').toUpperCase();
  switch (status.toLowerCase()) {
    case 'protected':
    case 'approved':
    case 'completed':
    case 'active':
      return <Badge variant="success">{format}</Badge>;
    case 'flagged':
    case 'awaiting_acceptance':
    case 'pending':
      return <Badge variant="warning">{format}</Badge>;
    case 'blocked':
    case 'disputed':
    case 'critical':
      return <Badge variant="danger">{format}</Badge>;
    case 'in_progress':
    case 'delivered':
      return <Badge variant="info">{format}</Badge>;
    case 'draft':
      return <Badge variant="neutral">{format}</Badge>;
    default:
      return <Badge variant="neutral">{format}</Badge>;
  }
};
