import React from 'react';
import { ArrowLeft, Play, ChevronDown, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Activity, CircleMinus as MinusCircle, Zap } from 'lucide-react';

const impactedServices = [
  { name: 'Inventory Service', impact: 'High', icon: 'I', color: 'bg-danger' },
  { name: 'Order Service', impact: 'High', icon: 'O', color: 'bg-danger' },
  { name: 'Notification Service', impact: 'Medium', icon: 'N', color: 'bg-warning' },
  { name: 'Analytics Service', impact: 'Medium', icon: 'A', color: 'bg-warning' },
  { name: 'Email Service', impact: 'Low', icon: 'E', color: 'bg-success' },
];

const impactLegend = [
  { label: 'High Impact', color: 'bg-danger' },
  { label: 'Medium Impact', color: 'bg-warning' },
  { label: 'Low Impact', color: 'bg-success' },
];

export default function BlastRadiusAnalysis({ onBack }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Blast Radius Analysis</h1>
            <p className="text-sm text-text-muted mt-1">Simulate failure impact on your system</p>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm text-text-secondary mb-1.5">Select Failed Service</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary appearance-none">
                <option>Payment Service</option>
                <option>Auth Service</option>
                <option>User Service</option>
                <option>Order Service</option>
                <option>Inventory Service</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors mt-6">
            <Play size={16} />
            Simulate Failure
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-card-2 border border-dark-border rounded-lg p-4" style={{ height: '400px' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 350">
              <circle cx="200" cy="175" r="120" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="175" r="80" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="175" r="40" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />

              <line x1="200" y1="175" x2="200" y2="55" stroke="#EF4444" strokeWidth="2" />
              <line x1="200" y1="175" x2="80" y2="175" stroke="#EF4444" strokeWidth="2" />
              <line x1="200" y1="175" x2="320" y2="175" stroke="#EF4444" strokeWidth="2" />
              <line x1="200" y1="175" x2="200" y2="295" stroke="#EF4444" strokeWidth="2" />
              <line x1="200" y1="175" x2="115" y2="260" stroke="#F59E0B" strokeWidth="2" />
              <line x1="200" y1="175" x2="285" y2="260" stroke="#F59E0B" strokeWidth="2" />
              <line x1="200" y1="175" x2="115" y2="90" stroke="#F59E0B" strokeWidth="2" />
              <line x1="200" y1="175" x2="285" y2="90" stroke="#F59E0B" strokeWidth="2" />

              <circle cx="200" cy="175" r="14" fill="#EF4444" />
              <text x="200" y="179" textAnchor="middle" fill="white" fontSize="8">P</text>
              <text x="200" y="200" textAnchor="middle" fill="#9CA3AF" fontSize="10">Payment Service</text>

              <circle cx="200" cy="55" r="12" fill="#F59E0B" />
              <text x="200" y="40" textAnchor="middle" fill="#9CA3AF" fontSize="9">API Gateway</text>

              <circle cx="80" cy="175" r="12" fill="#EF4444" />
              <text x="80" y="155" textAnchor="middle" fill="#9CA3AF" fontSize="9">Order Service</text>

              <circle cx="320" cy="175" r="12" fill="#EF4444" />
              <text x="320" y="155" textAnchor="middle" fill="#9CA3AF" fontSize="9">Inventory Service</text>

              <circle cx="200" cy="295" r="12" fill="#F59E0B" />
              <text x="200" y="315" textAnchor="middle" fill="#9CA3AF" fontSize="9">Notification Service</text>

              <circle cx="115" cy="260" r="12" fill="#F59E0B" />
              <text x="115" y="285" textAnchor="middle" fill="#9CA3AF" fontSize="9">Analytics Service</text>

              <circle cx="285" cy="260" r="12" fill="#10B981" />
              <text x="285" y="285" textAnchor="middle" fill="#9CA3AF" fontSize="9">Email Service</text>

              <circle cx="115" cy="90" r="12" fill="#10B981" />
              <text x="115" y="70" textAnchor="middle" fill="#9CA3AF" fontSize="9">Auth Service</text>

              <circle cx="285" cy="90" r="12" fill="#10B981" />
              <text x="285" y="70" textAnchor="middle" fill="#9CA3AF" fontSize="9">User Service</text>
            </svg>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-card-2 border border-dark-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Impact Summary</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger">5</div>
                  <div className="text-xs text-text-muted">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">18</div>
                  <div className="text-xs text-text-muted">Total Affected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger">18</div>
                  <div className="text-xs text-danger">High</div>
                </div>
              </div>
            </div>

            <div className="bg-dark-card-2 border border-dark-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Impacted Services</h3>
              <div className="space-y-3">
                {impactedServices.map((service, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${service.color === 'bg-danger' ? 'bg-danger' : service.color === 'bg-warning' ? 'bg-warning' : 'bg-success'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-text-secondary">{service.name}</div>
                    </div>
                    <span className={`text-xs font-medium ${service.color === 'bg-danger' ? 'text-danger' : service.color === 'bg-warning' ? 'text-warning' : 'text-success'}`}>
                      {service.impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
