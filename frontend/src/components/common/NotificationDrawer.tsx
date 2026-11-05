import React from 'react';
import { useAegis } from '../../context/AegisContext';
import { X, ShieldAlert, CheckCircle, Bell, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export const NotificationDrawer: React.FC = () => {
  const { 
    alerts, 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    markAlertRead, 
    dismissAlert,
    setActiveTab 
  } = useAegis();

  if (!isNotificationsOpen) return null;

  const handleActionClick = (alert: any) => {
    markAlertRead(alert.id);
    setActiveTab(alert.actionRoute);
    setIsNotificationsOpen(false);
  };

  const markAllRead = () => {
    alerts.forEach(a => markAlertRead(a.id));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'high':
        return <Lock className="w-5 h-5 text-amber-600" />;
      case 'medium':
        return <Bell className="w-5 h-5 text-sky-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-paypal-blue/10 flex items-center justify-center text-paypal-blue">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Security Notifications</h2>
                <p className="text-xs text-slate-500">Live Aegis real-time monitoring feed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-paypal-blue hover:text-paypal-deep px-2 py-1 rounded hover:bg-paypal-subtle transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto text-emerald-400 mb-2 stroke-1" />
                <p className="text-sm font-medium text-slate-600">Zero Active Threats</p>
                <p className="text-xs text-slate-400">Your transactions and accounts are fully secured.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.read 
                      ? 'bg-white border-slate-200/80' 
                      : 'bg-paypal-subtle/50 border-paypal-blue/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">{alert.title}</h4>
                        <span className="text-[11px] text-slate-400">{formatRelativeTime(alert.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                      
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleActionClick(alert)}
                          className="inline-flex items-center text-xs font-semibold text-paypal-blue hover:text-paypal-deep group"
                        >
                          {alert.actionLabel}
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <div className="inline-flex items-center text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Aegis Sentinel AI Engine: Active 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
