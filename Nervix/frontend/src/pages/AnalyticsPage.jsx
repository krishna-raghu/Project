import React from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Activity, Clock, CircleAlert as AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const stats = [
  { label: 'Total Services', value: '24', icon: Activity, color: 'text-primary' },
  { label: 'Total Dependencies', value: '52', icon: TrendingUp, color: 'text-success' },
  { label: 'Avg Response Time', value: '245ms', icon: Clock, color: 'text-warning' },
  { label: 'Faults Detected', value: '7', icon: AlertCircle, color: 'text-danger' },
];

const dependencyData = [
  { name: 'REST API', value: 60, color: '#3B82F6' },
  { name: 'Database', value: 20, color: '#10B981' },
  { name: 'Event', value: 20, color: '#F59E0B' },
  { name: 'Queue', value: 10, color: '#8B5CF6' },
];

const topServices = [
  { name: 'Payment Service', value: 12 },
  { name: 'Auth Service', value: 10 },
  { name: 'User Service', value: 8 },
  { name: 'Inventory Service', value: 7 },
  { name: 'Order Service', value: 6 },
  { name: 'Notification Service', value: 5 },
];

export default function AnalyticsPage({ onBack }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Analytics Overview</h1>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors">
          <Download size={14} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon size={18} className={stat.color} />
              <span className="text-sm text-text-muted">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Dependency Type Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dependencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dependencyData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {dependencyData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-text-secondary">{item.name}</span>
                  <span className="text-sm text-text-muted">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Top Connected Services</h3>
          <div className="space-y-4">
            {topServices.map((service, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-text-secondary w-32">{service.name}</span>
                <div className="flex-1 bg-dark-card-2 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(service.value / 12) * 100}%` }}></div>
                </div>
                <span className="text-sm text-text-muted w-8 text-right">{service.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
