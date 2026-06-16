import React, { useState } from 'react';
import { X } from 'lucide-react';

const permissions = [
  { key: 'viewServices', label: 'View Services', defaultChecked: true },
  { key: 'addServices', label: 'Add Services', defaultChecked: false },
  { key: 'editServices', label: 'Edit Services', defaultChecked: false },
  { key: 'deleteServices', label: 'Delete Services', defaultChecked: false },
  { key: 'viewDependencies', label: 'View Dependencies', defaultChecked: true },
  { key: 'addDependencies', label: 'Add Dependencies', defaultChecked: false },
  { key: 'editDependencies', label: 'Edit Dependencies', defaultChecked: false },
  { key: 'deleteDependencies', label: 'Delete Dependencies', defaultChecked: false },
  { key: 'runBlastRadius', label: 'Run Blast Radius', defaultChecked: false },
  { key: 'viewAnalytics', label: 'View Analytics', defaultChecked: true },
  { key: 'manageSettings', label: 'Manage Project Settings', defaultChecked: true },
];

export default function InviteTeamMemberPopup({ onClose }) {
  const [perms, setPerms] = useState(() =>
    Object.fromEntries(permissions.map((p) => [p.key, p.defaultChecked]))
  );

  const togglePerm = (key) => setPerms((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Invite Team Member</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="enter email address..."
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Role</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary">
                <option>Viewer</option>
                <option>Editor</option>
                <option>Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Permissions</label>
            <div className="space-y-2">
              {permissions.map((perm) => (
                <label key={perm.key} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => togglePerm(perm.key)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                      perms[perm.key] ? 'bg-primary border-primary' : 'border-dark-border bg-dark-card-2'
                    }`}
                  >
                    {perms[perm.key] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-text-secondary">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Message (optional)</label>
            <textarea
              rows={2}
              placeholder="Add a message for the invitation"
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
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
