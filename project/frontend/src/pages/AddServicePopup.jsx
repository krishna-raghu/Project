import React from 'react';
import { X } from 'lucide-react';

export default function AddServicePopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Add New Service</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Service Name</label>
            <input
              type="text"
              placeholder="Enter service name"
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Service Type</label>
            <select className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary appearance-none">
              <option>API</option>
              <option>Database</option>
              <option>Gateway</option>
              <option>Cache</option>
              <option>Queue</option>
              <option>Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Version</label>
            <input
              type="text"
              defaultValue="v1.0.0"
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Enter service description"
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
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
            Create Service
          </button>
        </div>
      </div>
    </div>
  );
}
