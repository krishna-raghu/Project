import React, { useState } from 'react';
import { X, Plus, Copy, Link } from 'lucide-react';

export default function CreateProjectPopup({ onClose, onCreate }) {
  const [visibility, setVisibility] = useState('private');
  const [collaborators, setCollaborators] = useState([
    { email: 'john.doe@example.com', role: 'Editor' },
    { email: 'smith@example.com', role: 'Viewer' },
  ]);
  const [newEmail, setNewEmail] = useState('');

  const addCollaborator = () => {
    if (newEmail.trim()) {
      setCollaborators([...collaborators, { email: newEmail.trim(), role: 'Viewer' }]);
      setNewEmail('');
    }
  };

  const removeCollaborator = (index) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Create New Project</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Project Name</label>
            <input
              type="text"
              defaultValue="Payment Gateway V2"
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Description (optional)</label>
            <textarea
              rows={2}
              defaultValue="Microservice architecture for payment processing system"
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Visibility</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="accent-primary"
                />
                <span className="text-sm text-text-secondary">Private</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'team'}
                  onChange={() => setVisibility('team')}
                  className="accent-primary"
                />
                <span className="text-sm text-text-secondary">Team</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Add Collaborators</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1 px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
              <button
                onClick={addCollaborator}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {collaborators.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-dark-card-2 rounded-lg border border-dark-border">
                <div className="w-6 h-6 rounded-full bg-dark-border flex items-center justify-center">
                  <span className="text-xs text-text-muted">{c.email.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm text-text-secondary flex-1">{c.email}</span>
                <select
                  value={c.role}
                  onChange={(e) => {
                    const updated = [...collaborators];
                    updated[i].role = e.target.value;
                    setCollaborators(updated);
                  }}
                  className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-xs text-text-secondary focus:outline-none"
                >
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
                <button onClick={() => removeCollaborator(i)} className="text-text-muted hover:text-danger transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Invitation Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue="https://nervix.app/invite/abc123"
                readOnly
                className="flex-1 px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-muted focus:outline-none"
              />
              <button className="flex items-center gap-2 px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-primary transition-colors">
                <Copy size={14} />
                <span>Copy Link</span>
              </button>
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
            onClick={() => { onCreate(); onClose(); }}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
