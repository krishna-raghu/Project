import React, { useState, useEffect } from 'react'; // Added useState and useEffect explicitly
import axios from 'axios'; // Imported axios for your backend service calls
import { supabase } from '../supabaseClient'; // Imported supabase client to resolve session calls
import { Plus, Search, Shield, ArrowUpRight, Clock, MoveHorizontal as MoreHorizontal, TriangleAlert as AlertTriangle, Activity, Zap, Link2 } from 'lucide-react';

// Static array for dashboard display representing quick-access collections
const featuredProjects = [
  { id: 'PRJ-0012', name: 'Payment Gateway V2', icon: 'P', color: 'bg-blue-500', desc: 'Microservice architecture for payment processing system', services: 25, dependencies: 44, health: 'Healthy', status: 'Good', updated: '2m ago' },
  { id: 'PRJ-0013', name: 'User Management', icon: 'U', color: 'bg-purple-500', desc: 'User identity and access management system', services: 18, dependencies: 32, health: 'Healthy', status: 'Stable', updated: '5m ago' },
  { id: 'PRJ-0014', name: 'Inventory System', icon: 'I', color: 'bg-amber-500', desc: 'Inventory tracking and management system', services: 15, dependencies: 23, health: 'Healthy', status: 'Stable', updated: '10m ago' },
];

// Static array representing infrastructure/system alerts
const recentActivity = [
  { icon: AlertTriangle, color: 'text-danger', text: 'Payment Service triggered a fault', time: '2m ago' },
  { icon: AlertTriangle, color: 'text-danger', text: 'User Service database connection failed', time: '5m ago' },
  { icon: Activity, color: 'text-warning', text: 'Auth Service response time high', time: '10m ago' },
  { icon: Shield, color: 'text-success', text: 'New service Notification Service added', time: '15m ago' },
];

export default function ProjectHub({ userData, onNavigate, onNewProject, onSelectProject }) {
  // State hook to hold dynamic project lists synced from your Spring Boot database
  const [projects, setProjects] = useState([]);

  // Hook handles authentication lifecycle and pushes metadata tokens to Spring Boot
  useEffect(() => {
    // 1. Synchronous listener to automatically push OAuth profile data to Spring Boot right upon login redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          // Syncs profile metadata instantly into the custom public.users table on your backend
          await axios.post(
            "http://localhost:8080/auth/oauth-signup",
            {
              fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "User",
              email: session.user.email,
              supabaseUid: session.user.id,
            }
          );
        } catch (err) {
          console.error("OAuth backend table sync failed:", err);
        }
      }
    });

    // 2. Fetch specific user-owned workspace projects using Bearer Token authorization
    const loadProjects = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("Current session context:", session);

          // Secure API request sending the temporary Supabase JWT access token to your Spring controller
          const response = await axios.get(
            "http://localhost:8080/projects/my-projects",
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            }
          );
          setProjects(response.data);
        }
      } catch (err) {
        console.error("Failed to load backend project dependencies:", err);
      }
    };

    loadProjects();

    // Cleanup subscription mapping to prevent memory leaks when navigating away from ProjectHub
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Top Header Navigation Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Project Hub</h1>
          <p className="text-sm text-text-muted mt-1">Manage and monitor all your API ecosystem projects</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Dashboard Ecosystem Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search collections, services..."
              className="pl-10 pr-4 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-64"
            />
          </div>

          {/* Action Trigger for project registration */}
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>

          {/* User Profile Avatar Node Navigation mapping */}
          <button
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:bg-primary-hover transition-colors"
          >
            {userData?.fullName
                            ?.split(' ')
                            .map(word => word[0])
                            .join('')
                            .toUpperCase() || 'KS'}
                        </button>
                    </div>
                  </div>

      {/* Featured Core Ecosystem Grid Cards */}
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

      {/* Real-Time Live Infrastructure Health & Activity Tracker Logs */}
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
      </div>
    </div>
  );
}