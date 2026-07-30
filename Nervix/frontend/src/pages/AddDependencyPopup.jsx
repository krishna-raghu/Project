import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createDependency, listServices } from '../api';

const TYPES = ['REST_API', 'DATABASE', 'EVENT', 'QUEUE', 'CACHE', 'GRPC', 'GRAPHQL', 'FILE', 'EXTERNAL'];
const CRITICALITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const PROTOCOLS = ['HTTP', 'HTTPS', 'GRPC', 'JDBC', 'AMQP', 'KAFKA', 'REDIS', 'TCP', 'UDP', 'WEBHOOK', 'OTHER'];
const inputClass = 'w-full px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary';

export default function AddDependencyPopup({ project, onClose, onCreated }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    sourceServiceId: '', targetServiceId: '', dependencyType: 'REST_API',
    criticality: 'MEDIUM', communicationProtocol: 'HTTPS',
    direction: 'UNIDIRECTIONAL', latencyMs: '', description: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!project?.workspaceId || !project?.id || project?.demo) return;
    listServices(project.workspaceId, project.id).then(setServices)
      .catch((requestError) => setError(requestError.message));
  }, [project]);

  const change = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (form.sourceServiceId === form.targetServiceId) {
      setError('Source and target services must be different.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createDependency(project.workspaceId, project.id, {
        ...form,
        latencyMs: form.latencyMs === '' ? null : Number(form.latencyMs),
        description: form.description || null,
      });
      onCreated?.();
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-dark-card border border-dark-border rounded-xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-text-primary">Add Dependency</h2>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {error && <div className="col-span-2 text-sm text-danger bg-danger/10 rounded-lg p-3">{error}</div>}
          <Field label="Source Service">
            <select required name="sourceServiceId" value={form.sourceServiceId} onChange={change} className={inputClass}>
              <option value="">Select source service</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </Field>
          <Field label="Target Service">
            <select required name="targetServiceId" value={form.targetServiceId} onChange={change} className={inputClass}>
              <option value="">Select target service</option>
              {services.filter((service) => service.id !== form.sourceServiceId).map((service) =>
                <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </Field>
          <SelectField label="Dependency Type" name="dependencyType" values={TYPES} form={form} change={change} />
          <SelectField label="Criticality" name="criticality" values={CRITICALITIES} form={form} change={change} />
          <SelectField label="Communication Protocol" name="communicationProtocol" values={PROTOCOLS} form={form} change={change} />
          <SelectField label="Direction" name="direction" values={['UNIDIRECTIONAL', 'BIDIRECTIONAL']} form={form} change={change} />
          <Field label="Expected Latency (ms)">
            <input type="number" min="0" name="latencyMs" value={form.latencyMs} onChange={change} className={inputClass} placeholder="Optional" />
          </Field>
          <Field label="Description">
            <input name="description" maxLength="2000" value={form.description} onChange={change} className={inputClass} placeholder="Optional relationship notes" />
          </Field>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-dark-border">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-text-secondary">Cancel</button>
          <button disabled={saving || services.length < 2} className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg text-sm font-medium">
            {saving ? 'Creating…' : 'Create Dependency'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="block text-sm text-text-secondary mb-1.5">{label}</span>{children}</label>;
}
function SelectField({ label, name, values, form, change }) {
  return <Field label={label}><select name={name} value={form[name]} onChange={change} className={inputClass}>
    {values.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}
  </select></Field>;
}
