import React from 'react';
import { X } from 'lucide-react';

export default function AddDependencyPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Add Dependency</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Source Service</label>
            <select className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary appearance-none">
              <option>Select source service</option>
              <option>API Gateway</option>
              <option>Auth Service</option>
              <option>User Service</option>
              <option>Payment Service</option>
              <option>Order Service</option>
              <option>Inventory Service</option>
              <option>Notification Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Target Service</label>
            <select className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary appearance-none">
              <option>Select target service</option>
              <option>Database</option>
              <option>Redis Cache</option>
              <option>Auth Service</option>
              <option>User Service</option>
              <option>Payment Service</option>
              <option>Order Service</option>
              <option>Inventory Service</option>
              <option>Notification Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Dependency Type</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="depType" defaultChecked className="accent-primary" />
                <span className="text-sm text-text-secondary">REST API</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="depType" className="accent-primary" />
                <span className="text-sm text-text-secondary">Database</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="depType" className="accent-primary" />
                <span className="text-sm text-text-secondary">Event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="depType" className="accent-primary" />
                <span className="text-sm text-text-secondary">Queue</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-dark-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Dependency
          </button>
        </div>
      </div>
    </div>
  );
}
