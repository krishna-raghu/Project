import React, { useState } from 'react';
import { X } from 'lucide-react';



export default function ServiceFullDetailsPopup({ node, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['Overview', 'Dependencies', 'Metrics', 'Alerts', 'Configuration'];

 const service = node;

 if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-dark-border flex-shrink-0">
          <h2 className="text-base font-semibold text-text-primary"> Service Details - {service.label}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 border-b border-dark-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: service.color || '#F59E0B' }}
              >
               {service.label.charAt(0)}
              </div>
             <span className="text-sm font-semibold text-text-primary">
              {service.label}
             </span>

             <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                service.healthStatus?.toLowerCase() === "healthy"
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
              }`}
             >
              {service.healthStatus}
             </span>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-1 px-5 border-b border-dark-border flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">General Information</h3>
                  <div className="space-y-2.5">
                    {[
                       { label: 'Service Type', value: service.type || 'Unknown' },
                       { label: 'Version', value: service.version || 'Not available' },
                       { label: 'Owner', value: service.owner || 'Not assigned' },
                       { label: 'Status', value: service.healthStatus || 'Unknown' },
                     ].map(({ label, value }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="text-xs text-text-muted w-28 flex-shrink-0">{label}</span>
                        <span className="text-xs text-text-secondary">{value}</span>
                      </div>
                    ))}

                  </div>
                </div>

                <div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-3">
                      Identity
                    </h3>

                    <div className="space-y-2.5">

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-28">
                          Service ID
                        </span>

                        <span className="text-xs text-text-secondary">
                          {service.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-28">
                          Label
                        </span>

                        <span className="text-xs text-text-secondary">
                          {service.label}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                 <h3 className="text-sm font-semibold text-text-primary mb-3">
                   Dependencies
                 </h3>

                 <div className="text-xs text-text-muted">
                   Dependency visualization available from architecture graph.
                 </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="text-sm text-text-muted flex items-center justify-center h-32">
              Dependencies view coming soon
            </div>
          )}
          {activeTab === 'metrics' && (
            <div className="text-sm text-text-muted flex items-center justify-center h-32">
              Metrics view coming soon
            </div>
          )}
          {activeTab === 'alerts' && (
            <div className="text-sm text-text-muted flex items-center justify-center h-32">
              Alerts view coming soon
            </div>
          )}
          {activeTab === 'configuration' && (
            <div className="text-sm text-text-muted flex items-center justify-center h-32">
              Configuration view coming soon
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-dark-border flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
