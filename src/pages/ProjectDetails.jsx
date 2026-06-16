import React, { useState } from 'react';
import {
  ArrowLeft, Edit2, Clock, Shield, Filter, Plus, Link2,
  Search, Layers, ZoomIn, ZoomOut, Maximize2,
  Pencil, Trash2, ExternalLink,
} from 'lucide-react';
import EditProjectPopup from './EditProjectPopup';
import FilterPopup from './FilterPopup';
import ViewServiceDetailsPopup from './ViewServiceDetailsPopup';
import ServiceFullDetailsPopup from './ServiceFullDetailsPopup';

/* ─── Static data ─── */

const projectServices = [
  { name: 'API Gateway', type: 'Gateway', version: 'v1.2.0', health: 'Healthy', dependencies: 3, dependents: 5, owner: 'Krishna Singh' },
  { name: 'Auth Service', type: 'API', version: 'v1.0.0', health: 'Healthy', dependencies: 4, dependents: 6, owner: 'John Doe' },
  { name: 'User Service', type: 'API', version: 'v1.0.0', health: 'Healthy', dependencies: 5, dependents: 4, owner: 'John One' },
  { name: 'Payment Service', type: 'API', version: 'v1.3.0', health: 'Healthy', dependencies: 6, dependents: 3, owner: 'Krishna Singh' },
  { name: 'Inventory Service', type: 'API', version: 'v1.1.0', health: 'Healthy', dependencies: 5, dependents: 2, owner: 'Smith Johnson' },
  { name: 'Notification Service', type: 'API', version: 'v1.0.0', health: 'Healthy', dependencies: 2, dependents: 1, owner: 'Emily Davis' },
  { name: 'Database', type: 'Database', version: 'v1.0', health: 'Healthy', dependencies: 0, dependents: 8, owner: 'Krishna Singh' },
  { name: 'Redis Cache', type: 'Cache', version: 'v1.0', health: 'Healthy', dependencies: 0, dependents: 3, owner: 'Smith Johnson' },
  { name: 'Order Service', type: 'API', version: 'v1.1.0', health: 'Healthy', dependencies: 4, dependents: 2, owner: 'John Doe' },
];

const projectDependencies = [
  { source: 'API Gateway', target: 'Auth Service', type: 'REST API', criticality: 'High', latency: 120, createdAt: 'May 10, 2024' },
  { source: 'Auth Service', target: 'User Service', type: 'REST API', criticality: 'High', latency: 80, createdAt: 'May 10, 2024' },
  { source: 'User Service', target: 'Database', type: 'Database', criticality: 'Critical', latency: 15, createdAt: 'May 10, 2024' },
  { source: 'Payment Service', target: 'Notification Service', type: 'Event', criticality: 'Medium', latency: 200, createdAt: 'May 10, 2024' },
  { source: 'Inventory Service', target: 'Notification Service', type: 'Event', criticality: 'Medium', latency: 160, createdAt: 'May 10, 2024' },
  { source: 'Inventory Service', target: 'Database', type: 'Database', criticality: 'Critical', latency: 30, createdAt: 'May 10, 2024' },
  { source: 'Order Service', target: 'Payment Service', type: 'REST API', criticality: 'High', latency: 185, createdAt: 'May 10, 2024' },
];

const graphNodes = [
  { id: 'api-gateway', label: 'API Gateway', x: 370, y: 70, color: '#3B82F6', type: 'Gateway', version: 'v1.2.0', owner: 'Krishna Singh', deps: 3, dependents: 0, responseTime: '120ms', desc: 'Main API gateway for routing requests' },
  { id: 'auth-service', label: 'Auth Service', x: 200, y: 190, color: '#10B981', type: 'API', version: 'v1.0.0', owner: 'John Doe', deps: 4, dependents: 6, responseTime: '80ms', desc: 'Handles authentication and authorization' },
  { id: 'user-service', label: 'User Service', x: 540, y: 190, color: '#10B981', type: 'API', version: 'v1.0.0', owner: 'John One', deps: 5, dependents: 4, responseTime: '95ms', desc: 'User profile and account management' },
  { id: 'order-service', label: 'Order Service', x: 160, y: 330, color: '#10B981', type: 'API', version: 'v1.1.0', owner: 'John Doe', deps: 4, dependents: 2, responseTime: '150ms', desc: 'Manages order lifecycle and processing' },
  { id: 'payment-service', label: 'Payment Service', x: 370, y: 330, color: '#F59E0B', type: 'API', version: 'v2.2.1', owner: 'Krishna Singh', deps: 6, dependents: 3, responseTime: '245ms', desc: 'Handles all payment processing and transactions' },
  { id: 'inventory-service', label: 'Inventory Service', x: 580, y: 330, color: '#F59E0B', type: 'API', version: 'v1.1.0', owner: 'Smith Johnson', deps: 5, dependents: 2, responseTime: '160ms', desc: 'Tracks inventory levels and updates' },
  { id: 'notification-service', label: 'Notification Service', x: 370, y: 450, color: '#10B981', type: 'API', version: 'v1.0.0', owner: 'Emily Davis', deps: 2, dependents: 1, responseTime: '200ms', desc: 'Sends notifications via email and SMS' },
  { id: 'database', label: 'Database', x: 250, y: 540, color: '#10B981', type: 'Database', version: 'v1.0', owner: 'Krishna Singh', deps: 0, dependents: 8, responseTime: '15ms', desc: 'Primary PostgreSQL database' },
  { id: 'redis-cache', label: 'Redis Cache', x: 490, y: 540, color: '#EF4444', type: 'Cache', version: 'v1.0', owner: 'Smith Johnson', deps: 0, dependents: 3, responseTime: '5ms', desc: 'In-memory caching layer' },
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
  { from: 'payment-service', to: 'database' },
];

const healthSummary = [
  { label: 'Healthy', value: 16, color: 'bg-success', percent: '72%' },
  { label: 'Warning', value: 4, color: 'bg-warning', percent: '16%' },
  { label: 'Error', value: 3, color: 'bg-danger', percent: '12%' },
];

const recentFaults = [
  { name: 'Payment Service Timeout Error', type: 'APis', time: '2m ago' },
  { name: 'User Service Database Failed', type: 'Fault', time: '5m ago' },
  { name: 'Auth Service High Response Time', type: 'High', time: '10m ago' },
  { name: 'Notification Service Queue Length High', type: 'High', time: '15m ago' },
];

const archSummary = [
  { label: 'Total Nodes', value: 26 },
  { label: 'APIs', value: 18 },
  { label: 'Databases', value: 3 },
  { label: 'Caches', value: 2 },
  { label: 'Gateways', value: 1 },
  { label: 'Queues', value: 1 },
  { label: 'Dependencies', value: 44 },
];

/* ─── Helpers ─── */

const healthBadge = (h) => ({ Healthy: 'bg-success/10 text-success', Warning: 'bg-warning/10 text-warning', Error: 'bg-danger/10 text-danger' }[h] || 'bg-success/10 text-success');
const critBadge = (c) => ({ Critical: 'bg-danger/10 text-danger', High: 'bg-warning/10 text-warning', Medium: 'bg-amber-500/10 text-amber-400', Low: 'bg-success/10 text-success' }[c] || 'bg-dark-card-2 text-text-muted');

/* ─── Tab components ─── */

function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Services', value: 25, color: 'bg-primary' },
          { label: 'Dependencies', value: 44, color: 'bg-purple-500' },
          { label: 'Critical Nodes', value: 3, color: 'bg-danger' },
          { label: 'Blast Radius Score', value: 18, color: 'bg-warning', sub: '+ High' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 ${stat.color} rounded-full`}></div>
              <span className="text-sm text-text-muted">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
            {stat.sub && <div className="text-xs text-danger mt-1">{stat.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Services Health Summary</h3>
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1F2937" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="201.06 251.33" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="50.27 251.33" strokeDashoffset="-201.06" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="37.70 251.33" strokeDashoffset="-251.33" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-text-primary">25</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {healthSummary.map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${h.color}`}></div>
                  <span className="text-xs text-text-secondary">{h.label}</span>
                  <span className="text-xs text-text-muted">{h.value} ({h.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Architecture Summary</h3>
          <div className="space-y-2">
            {archSummary.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1 border-b border-dark-border/50 last:border-0">
                <span className="text-sm text-text-secondary">{row.label}</span>
                <span className="text-sm font-medium text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Recent Faults</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentFaults.map((fault, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-danger rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-secondary truncate">{fault.name}</div>
                  <div className="text-xs text-text-muted">{fault.type}</div>
                </div>
                <div className="text-xs text-text-muted flex-shrink-0">{fault.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesTab({ onAddService, onAddDependency }) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setShowFilter(true)}
          className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
        >
          <Filter size={14} />
          Filter
        </button>
        <button
          onClick={onAddDependency}
          className="flex items-center gap-2 px-4 py-2 bg-dark-card-2 border border-dark-border hover:border-primary text-text-primary rounded-lg text-sm font-medium transition-colors"
        >
          <Link2 size={16} />
          Add Dependency
        </button>
        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              {['Service Name', 'Type', 'Version', 'Health', 'Dependencies', 'Dependents', 'Owner', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs text-text-muted font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectServices.map((svc, i) => (
              <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-card-2/50 transition-colors">
                <td className="px-4 py-3"><span className="text-sm text-text-primary font-medium">{svc.name}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.type}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-muted font-mono">{svc.version}</span></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${healthBadge(svc.health)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {svc.health}
                  </span>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.dependencies}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.dependents}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.owner}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={13} /></button>
                    <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><ExternalLink size={13} /></button>
                    <button className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFilter && <FilterPopup onClose={() => setShowFilter(false)} />}
    </div>
  );
}

function DependenciesTab({ onAddDependency }) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => setShowFilter(true)}
          className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
        >
          <Filter size={14} />
          Filter
        </button>
        <button
          onClick={onAddDependency}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Dependency
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              {['Source Service', 'Target Service', 'Type', 'Criticality', 'Latency', 'Created At', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs text-text-muted font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectDependencies.map((dep, i) => (
              <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-card-2/50 transition-colors">
                <td className="px-4 py-3"><span className="text-sm text-text-primary font-medium">{dep.source}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.target}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.type}</span></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${critBadge(dep.criticality)}`}>{dep.criticality}</span>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.latency}ms</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-muted">{dep.createdAt}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><Link2 size={13} /></button>
                    <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={13} /></button>
                    <button className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showFilter && <FilterPopup onClose={() => setShowFilter(false)} />}
    </div>
  );
}

function GraphTab({ onBlastRadius }) {
  const defaultNode = graphNodes.find(n => n.id === 'payment-service');
  const [selectedNode, setSelectedNode] = useState(defaultNode);
  const [showFilter, setShowFilter] = useState(false);
  const [showViewService, setShowViewService] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const incomingDeps = graphEdges.filter(e => e.to === selectedNode?.id).map(e => graphNodes.find(x => x.id === e.from)?.label).filter(Boolean);
  const outgoingDeps = graphEdges.filter(e => e.from === selectedNode?.id).map(e => graphNodes.find(x => x.id === e.to)?.label).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input type="text" placeholder="Search nodes in graph..." className="pl-9 pr-4 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-48" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilter(true)} className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
            <Filter size={14} />Filter
          </button>
          <button className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
            <Layers size={14} />Layout
          </button>
          <button onClick={onBlastRadius} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors">
            Blast Radius Analysis
          </button>
        </div>
      </div>

      {/* Graph + right panel */}
      <div className="flex gap-4" style={{ height: '500px' }}>
        <div className="flex-1 bg-dark-card border border-dark-border rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-4">
              {[['bg-success', 'Healthy'], ['bg-warning', 'Warning'], ['bg-danger', 'Error']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${c}`}></div>
                  <span className="text-xs text-text-secondary">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded transition-colors"><ZoomOut size={14} /></button>
              <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded transition-colors"><ZoomIn size={14} /></button>
              <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded transition-colors"><Maximize2 size={14} /></button>
            </div>
          </div>

          <svg
            className="flex-1 w-full bg-dark-bg/40 rounded-lg border border-dark-border cursor-pointer"
            viewBox="0 0 740 580"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#4B5563" />
              </marker>
            </defs>
            {graphEdges.map((edge, i) => {
              const f = graphNodes.find(n => n.id === edge.from);
              const t = graphNodes.find(n => n.id === edge.to);
              if (!f || !t) return null;
              return <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#4B5563" strokeWidth="1.5" markerEnd="url(#arr)" />;
            })}
            {graphNodes.map((node) => (
              <g key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
                <circle cx={node.x} cy={node.y} r="22" fill={node.color} fillOpacity="0.15" stroke={selectedNode?.id === node.id ? node.color : 'transparent'} strokeWidth="2" />
                <circle cx={node.x} cy={node.y} r="10" fill={node.color} />
                <text x={node.x} y={node.y + 26} textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="500">{node.label}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Right node details panel */}
        {selectedNode && (
          <div className="w-60 flex-shrink-0 bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-text-primary">Node Details</span>
              <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">Healthy</span>
            </div>
            <div className="text-base font-semibold text-text-primary mb-3">{selectedNode.label}</div>
            <div className="space-y-2 text-sm mb-4">
              {[
                { label: 'Type', value: selectedNode.type },
                { label: 'Version', value: selectedNode.version },
                { label: 'Owner', value: selectedNode.owner },
                { label: 'Dependencies', value: selectedNode.deps },
                { label: 'Dependents', value: selectedNode.dependents },
                { label: 'Response Time', value: selectedNode.responseTime },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-text-muted text-xs">{label}</span>
                  <span className="text-text-secondary text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>
            {selectedNode.desc && (
              <div className="mb-3">
                <div className="text-xs text-text-muted mb-1">Description</div>
                <div className="text-xs text-text-secondary leading-relaxed">{selectedNode.desc}</div>
              </div>
            )}
            {incomingDeps.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-text-muted mb-1.5">Incoming Dependencies</div>
                <div className="space-y-1">{incomingDeps.map((d, i) => <div key={i} className="text-xs text-text-secondary px-2 py-1 bg-dark-card-2 rounded">{d}</div>)}</div>
              </div>
            )}
            {outgoingDeps.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-text-muted mb-1.5">Outgoing Dependencies</div>
                <div className="space-y-1">{outgoingDeps.map((d, i) => <div key={i} className="text-xs text-text-secondary px-2 py-1 bg-dark-card-2 rounded">{d}</div>)}</div>
              </div>
            )}
            <button
              onClick={() => setShowFullDetails(true)}
              className="mt-auto w-full px-3 py-2 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
            >
              View Full Details
            </button>
          </div>
        )}
      </div>

      {/* Bottom node details bar */}
      {selectedNode && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="text-xs font-semibold text-text-muted mb-3">Node Details</div>
          <div className="flex items-center gap-6 p-3 bg-dark-card-2 rounded-lg border border-dark-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedNode.color }}></div>
              <span className="text-sm font-semibold text-text-primary">{selectedNode.label}</span>
              <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">Healthy</span>
            </div>
            <span className="text-sm text-text-secondary">Type: {selectedNode.type}</span>
            <span className="text-sm text-text-secondary">Dependencies: {selectedNode.deps}</span>
            <span className="text-sm text-text-secondary">Dependents: {selectedNode.dependents}</span>
            <span className="text-sm text-text-secondary">Response Time: {selectedNode.responseTime}</span>
            <button
              onClick={() => setShowViewService(true)}
              className="ml-auto px-4 py-1.5 text-sm text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
            >
              View Service Details
            </button>
          </div>
        </div>
      )}

      {showFilter && <FilterPopup onClose={() => setShowFilter(false)} />}
      {showViewService && <ViewServiceDetailsPopup node={selectedNode} onClose={() => setShowViewService(false)} />}
      {showFullDetails && <ServiceFullDetailsPopup node={selectedNode} onClose={() => setShowFullDetails(false)} />}
    </div>
  );
}

/* ─── Main component ─── */

export default function ProjectDetails({ project, onBack, onNavigate, onAddService, onAddDependency }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProject, setShowEditProject] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Services' },
    { id: 'dependencies', label: 'Dependencies' },
    { id: 'graph', label: 'Graph' },
    { id: 'analytics', label: 'Analytics', external: true },
    { id: 'team', label: 'Team', external: true },
    { id: 'settings', label: 'Settings', external: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.external) {
      const pageMap = { analytics: 'analytics', team: 'teams', settings: 'settings' };
      onNavigate(pageMap[tab.id]);
      return;
    }
    setActiveTab(tab.id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'services': return <ServicesTab onAddService={onAddService} onAddDependency={onAddDependency} />;
      case 'dependencies': return <DependenciesTab onAddDependency={onAddDependency} />;
      case 'graph': return <GraphTab onBlastRadius={() => onNavigate('blast-radius')} />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-text-primary">{project?.name || 'Payment Gateway V2'}</h1>
              <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">Healthy</span>
            </div>
            <p className="text-sm text-text-muted mt-0.5">{project?.desc || 'Microservice architecture for payment processing system'}</p>
          </div>
        </div>
        <button onClick={() => setShowEditProject(true)} className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
          <Edit2 size={14} />
          Edit Project
        </button>
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs">KS</div>
          <div>
            <div className="text-xs text-text-muted">Project Owner</div>
            <div className="text-text-primary font-medium text-xs">Krishna Singh</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['KS', 'JD', 'SJ', 'ED', 'MB'].map((init, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-dark-card-2 border-2 border-dark-card flex items-center justify-center text-white font-semibold text-xs">{init}</div>
            ))}
            <div className="w-7 h-7 rounded-full bg-dark-card-2 border-2 border-dark-card flex items-center justify-center text-text-muted text-xs">+2</div>
          </div>
          <div className="text-xs text-text-muted">Team Members</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-text-muted" />
          <div>
            <div className="text-xs text-text-muted">Created At</div>
            <div className="text-xs text-text-primary font-medium">May 10, 2024</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-text-muted" />
          <div>
            <div className="text-xs text-text-muted">Project ID</div>
            <div className="text-xs text-text-primary font-medium">{project?.id || 'PRJ-0012'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-dark-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id && !tab.external ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

      {showEditProject && <EditProjectPopup project={project} onClose={() => setShowEditProject(false)} />}
    </div>
  );
}
