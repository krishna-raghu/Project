import React from 'react';
import { ArrowLeft, Bell, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info, CircleCheck as CheckCircle, X, Mail, User, Settings } from 'lucide-react';

const notifications = [
  { type: 'Fault', title: 'Payment Service Timeout Error', time: '2m ago', severity: 'High', read: false },
  { type: 'Fault', title: 'User Service Database Connection Failed', time: '5m ago', severity: 'High', read: false },
  { type: 'Alert', title: 'Auth Service High Response Time', time: '10m ago', severity: 'Medium', read: false },
  { type: 'System', title: 'New member John Doe joined the project', time: '15m ago', severity: 'Low', read: true },
  { type: 'Invitation', title: "You've been invited to Analytics Engine", time: '1h ago', severity: 'Low', read: true },
  { type: 'Alert', title: 'Redis Cache Memory Usage High', time: '2h ago', severity: 'Medium', read: true },
  { type: 'Fault', title: 'Database Connection Pool Exhausted', time: '3h ago', severity: 'High', read: true },
  { type: 'System', title: 'Scheduled maintenance completed', time: '5h ago', severity: 'Low', read: true },
  { type: 'Invitation', title: "You've been invited to Payment Gateway V2", time: '1d ago', severity: 'Low', read: true },
  { type: 'Alert', title: 'API Gateway Rate Limiting Triggered', time: '1d ago', severity: 'Medium', read: true },
];

const severityStyles = {
  High: 'bg-danger/10 text-danger',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-primary/10 text-primary',
};

const typeIcons = {
  Fault: AlertTriangle,
  Alert: AlertCircle,
  System: Settings,
  Invitation: Mail,
};

const typeColors = {
  Fault: 'text-danger',
  Alert: 'text-warning',
  System: 'text-primary',
  Invitation: 'text-success',
};

export default function NotificationsPage({ onBack }) {
  const [activeTab, setActiveTab] = React.useState('All');
  const tabs = ['All', 'Faults', 'Alerts', 'System', 'Invitations'];

  const filtered = activeTab === 'All' ? notifications : notifications.filter(n => {
    if (activeTab === 'Faults') return n.type === 'Fault';
    if (activeTab === 'Alerts') return n.type === 'Alert';
    if (activeTab === 'System') return n.type === 'System';
    if (activeTab === 'Invitations') return n.type === 'Invitation';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Notifications</h1>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="flex items-center gap-1 border-b border-dark-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="divide-y divide-dark-border">
          {filtered.map((n, i) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <div key={i} className={`flex items-center gap-4 p-4 hover:bg-dark-card-2/50 transition-colors ${!n.read ? 'bg-dark-card-2/30' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${!n.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                <div className={`w-8 h-8 rounded-full bg-dark-card-2 flex items-center justify-center border border-dark-border`}>
                  <Icon size={14} className={typeColors[n.type]} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-text-primary font-medium">{n.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityStyles[n.severity]}`}>{n.type}</span>
                    <span className="text-xs text-text-muted">{n.time}</span>
                  </div>
                </div>
                <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
