import React from 'react';
import { ArrowLeft, Search, Filter, Layers, Maximize2, Minus, Plus, ZoomIn, ZoomOut, PanelLeft, ChevronDown } from 'lucide-react';

const graphNodes = [
  { id: 'api-gateway', label: 'API Gateway', x: 400, y: 80, color: '#3B82F6' },
  { id: 'auth-service', label: 'Auth Service', x: 250, y: 180, color: '#10B981' },
  { id: 'user-service', label: 'User Service', x: 550, y: 180, color: '#10B981' },
  { id: 'order-service', label: 'Order Service', x: 250, y: 300, color: '#10B981' },
  { id: 'payment-service', label: 'Payment Service', x: 400, y: 300, color: '#F59E0B' },
  { id: 'inventory-service', label: 'Inventory Service', x: 550, y: 300, color: '#F59E0B' },
  { id: 'notification-service', label: 'Notification Service', x: 400, y: 420, color: '#10B981' },
  { id: 'database', label: 'Database', x: 300, y: 520, color: '#10B981' },
  { id: 'redis-cache', label: 'Redis Cache', x: 500, y: 520, color: '#EF4444' },
];

const graphEdges = [
  { from: 'api-gateway', to: 'auth-service' },
  { from: 'api-gateway', to: 'user-service' },
  { from: 'api-gateway', to: 'order-service' },
  { from: 'api-gateway', to: 'payment-service' },
  { from: 'api-gateway', to: 'inventory-service' },
  { from: 'auth-service', to: 'user-service' },
  { from: 'user-service', to: 'database' },
  { from: 'order-service', to: 'payment-service' },
  { from: 'order-service', to: 'inventory-service' },
  { from: 'payment-service', to: 'notification-service' },
  { from: 'inventory-service', to: 'notification-service' },
  { from: 'notification-service', to: 'database' },
  { from: 'notification-service', to: 'redis-cache' },
  { from: 'payment-service', to: 'database' },
];

export default function GraphVisualization({ onBack, onBlastRadius }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Architecture Graph - Payment Gateway V2</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="Search nodes in graph..."
              className="pl-9 pr-4 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-48"
            />
          </div>
          <button className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
            <Filter size={14} />
            Filter
          </button>
          <button className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
            <Layers size={14} />
            Layout
          </button>
          <button
            onClick={onBlastRadius}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Blast Radius Analysis
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4" style={{ height: '600px' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-xs text-text-secondary">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-xs text-text-secondary">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger"></div>
              <span className="text-xs text-text-secondary">Error</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
              <ZoomOut size={16} />
            </button>
            <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
              <ZoomIn size={16} />
            </button>
            <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        <svg width="100%" height="520" viewBox="0 0 800 600" className="bg-dark-bg/50 rounded-lg border border-dark-border">
          {graphEdges.map((edge, i) => {
            const fromNode = graphNodes.find(n => n.id === edge.from);
            const toNode = graphNodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#374151"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#374151" />
            </marker>
          </defs>
          {graphNodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="28" fill={node.color} opacity="0.15" />
              <circle cx={node.x} cy={node.y} r="12" fill={node.color} />
              <text x={node.x} y={node.y + 28} textAnchor="middle" fill="#9CA3AF" fontSize="12" fontWeight="500">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Node Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-dark-card-2 rounded-lg border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-sm text-text-primary font-medium">Payment Service</span>
              <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <span>Type: API</span>
              <span>Dependencies: 6</span>
              <span>Dependents: 3</span>
              <span>Response Time: 245ms</span>
            </div>
            <button className="px-3 py-1.5 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
              View Service Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
