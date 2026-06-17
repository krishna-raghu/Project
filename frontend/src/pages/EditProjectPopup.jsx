import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EditProjectPopup({ onClose, project }) {
  const [tags, setTags] = useState(['Payment', 'Banking', 'Microservices']);

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Edit Project</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Project Name</label>
            <input
              type="text"
              defaultValue={project?.name || 'Payment Gateway V2'}
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Description</label>
            <textarea
              rows={3}
              defaultValue={project?.desc || 'Microservice architecture for payment processing system'}
              className="w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Project Type</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary">
                <option>Microservices</option>
                <option>Monolith</option>
                <option>Serverless</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Visibility</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary">
                <option>Private</option>
                <option>Team</option>
                <option>Organization</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Tags</label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-dark-card-2 border border-dark-border rounded-lg min-h-[40px]">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-dark-border rounded text-xs text-text-secondary">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-text-muted hover:text-danger transition-colors ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+"
                className="bg-transparent text-sm text-text-primary outline-none w-8 placeholder:text-text-muted"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setTags([...tags, e.target.value.trim()]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-dark-border space-y-3">
          <div className="flex items-center justify-end gap-3">
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
              Save Changes
            </button>
          </div>
          <button className="w-full px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 rounded-lg text-sm font-medium transition-colors">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
