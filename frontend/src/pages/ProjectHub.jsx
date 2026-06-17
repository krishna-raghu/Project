import React from 'react';
import { Plus, Search, Bell, Shield, ArrowUpRight, Clock, MoveHorizontal as MoreHorizontal, TriangleAlert as AlertTriangle, Activity, Zap, Link2 } from 'lucide-react';

const featuredProjects = [
  { id: 'PRJ-0012', name: 'Payment Gateway V2', icon: 'P', color: 'bg-blue-500', desc: 'Microservice architecture for payment processing system', services: 25, dependencies: 44, health: 'Healthy', status: 'Good', updated: '2m ago' },
  { id: 'PRJ-0013', name: 'User Management', icon: 'U', color: 'bg-purple-500', desc: 'User identity and access management system', services: 18, dependencies: 32, health: 'Healthy', status: 'Stable', updated: '5m ago' },
  { id: 'PRJ-0014', name: 'Inventory System', icon: 'I', color: 'bg-amber-500', desc: 'Inventory tracking and management system', services: 15, dependencies: 23, health: 'Healthy', status: 'Stable', updated: '10m ago' },
];

const recentActivity = [
  { icon: AlertTriangle, color: 'text-danger', text: 'Payment Service triggered a fault', time: '2m ago' },
  { icon: AlertTriangle, color: 'text-danger', text: 'User Service database connection failed', time: '5m ago' },
  { icon: Activity, color: 'text-warning', text: 'Auth Service response time high', time: '10m ago' },
  { icon: Shield, color: 'text-success', text: 'New service Notification Service added', time: '15m ago' },
];

const stats = [
  { label: 'Total Projects', value: '12', change: '+12%', positive: true },
  { label: 'Total Services', value: '235', change: '+6%', positive: true },
  { label: 'Total Dependencies', value: '652', change: '+18%', positive: true },
  { label: 'Critical Services', value: '4', change: '-2%', positive: false },
];

export default function ProjectHub({ onNavigate, onNewProject, onSelectProject }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Project Hub</h1>
          <p className="text-sm text-text-muted mt-1">Manage and monitor all your API ecosystem projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search projects, services..."
              className="pl-10 pr-4 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-64"
            />
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:bg-primary-hover transition-colors"
          >
            KS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="text-sm text-text-muted mb-2">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-success' : 'text-danger'}`}>
                <ArrowUpRight size={14} />
                {stat.change}
              </div>
            </div>
            <div className="text-xs text-text-muted mt-1">from last week</div>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Featured Collections</h2>
          <button className="text-sm text-primary hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="text-left bg-dark-card-2 border border-dark-border rounded-lg p-4 hover:border-primary/50 hover:bg-dark-card-2/80 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                    {project.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{project.name}</div>
                    <div className="text-xs text-text-muted">{project.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-text-muted">{project.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{project.services} Services</span>
                <span>{project.dependencies} Dependencies</span>
              </div>
              <div className="text-xs text-text-muted mt-2">Updated {project.updated}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.color.replace('text-', 'bg-')}`}></div>
                <div className="flex-1 text-sm text-text-secondary">{activity.text}</div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-3 p-3 bg-dark-card-2 border border-dark-border rounded-lg hover:border-primary/50 transition-all">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-success" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Add Service</div>
                <div className="text-xs text-text-muted">Register new service</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 bg-dark-card-2 border border-dark-border rounded-lg hover:border-primary/50 transition-all">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Link2 size={16} className="text-warning" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Add Dependency</div>
                <div className="text-xs text-text-muted">Create service dependency</div>
              </div>
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="flex items-center gap-3 p-3 bg-dark-card-2 border border-dark-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">View Graph</div>
                <div className="text-xs text-text-muted">Visualize architecture</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-3 bg-dark-card-2 border border-dark-border rounded-lg hover:border-primary/50 transition-all">
              <div className="w-8 h-8 bg-danger/10 rounded-lg flex items-center justify-center">
                <AlertTriangle size={16} className="text-danger" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Run Analysis</div>
                <div className="text-xs text-text-muted">Blast radius analysis</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
