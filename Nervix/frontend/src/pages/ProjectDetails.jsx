import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Edit2, Clock, Shield, Filter, Plus, Link2,
  Search, Layers, ZoomIn, ZoomOut, Maximize2,
  Pencil, Trash2, ExternalLink,
} from 'lucide-react';
import EditProjectPopup from './EditProjectPopup';
import AddServicePopup from './AddServicePopup';
import FilterPopup from './FilterPopup';
import ViewServiceDetailsPopup from './ViewServiceDetailsPopup';
import ServiceFullDetailsPopup from './ServiceFullDetailsPopup';
import GraphVisualization from './GraphVisualization';
import {
  deleteDependency,
  deleteService,
  getDependencySummary,
  getProjectTeam,
  getServiceSummary,
  listDependencies,
  listServices,
  getArchitectureGraph,
} from '../api';

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

const healthBadge = (h) => ({ Healthy: 'bg-success/10 text-success', HEALTHY: 'bg-success/10 text-success', Warning: 'bg-warning/10 text-warning', WARNING: 'bg-warning/10 text-warning', Error: 'bg-danger/10 text-danger', ERROR: 'bg-danger/10 text-danger', UNKNOWN: 'bg-dark-card-2 text-text-muted' }[h] || 'bg-dark-card-2 text-text-muted');
const critBadge = (c) => ({ Critical: 'bg-danger/10 text-danger', CRITICAL: 'bg-danger/10 text-danger', High: 'bg-warning/10 text-warning', HIGH: 'bg-warning/10 text-warning', Medium: 'bg-amber-500/10 text-amber-400', MEDIUM: 'bg-amber-500/10 text-amber-400', Low: 'bg-success/10 text-success', LOW: 'bg-success/10 text-success' }[c] || 'bg-dark-card-2 text-text-muted');

/* ─── Tab components ─── */

function OverviewTab({ services, summary, dependencySummary }) {
  const total = summary?.total ?? services.length;
  const health = summary?.byHealth || {};
  const serviceHealthSummary = [
    { label: 'Healthy', value: health.HEALTHY || 0, color: 'bg-success' },
    { label: 'Warning', value: health.WARNING || 0, color: 'bg-warning' },
    { label: 'Error', value: health.ERROR || 0, color: 'bg-danger' },
    { label: 'Unknown', value: health.UNKNOWN || 0, color: 'bg-dark-border' },
  ].map((item) => ({ ...item, percent: total ? `${Math.round((item.value / total) * 100)}%` : '0%' }));
  const types = summary?.byType || {};
  const serviceArchSummary = [
    { label: 'Total Nodes', value: total },
    { label: 'APIs', value: types.API || 0 },
    { label: 'Databases', value: types.DATABASE || 0 },
    { label: 'Caches', value: types.CACHE || 0 },
    { label: 'Gateways', value: types.GATEWAY || 0 },
    { label: 'Queues', value: types.QUEUE || 0 },
    { label: 'Dependencies', value: dependencySummary?.total || 0 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Services', value: total, color: 'bg-primary' },
          { label: 'Dependencies', value: dependencySummary?.total || 0, color: 'bg-purple-500' },
          { label: 'Critical Dependencies', value: dependencySummary?.critical || 0, color: 'bg-danger' },
          { label: 'Blast Radius Score', value: 0, color: 'bg-warning', sub: 'Available after graph analysis' },
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
                <span className="text-xl font-bold text-text-primary">{total}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {serviceHealthSummary.map((h) => (
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
            {serviceArchSummary.map((row) => (
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

function ServicesTab({ services, loading, error, canEdit, canManage, onAddService, onEditService, onDeleteService, onAddDependency }) {
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
        {canEdit && <button
          onClick={onAddDependency}
          className="flex items-center gap-2 px-4 py-2 bg-dark-card-2 border border-dark-border hover:border-primary text-text-primary rounded-lg text-sm font-medium transition-colors"
        >
          <Link2 size={16} />
          Add Dependency
        </button>}
        {canEdit && <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Service
        </button>}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        {error && <div className="p-4 text-danger text-sm">{error}</div>}
        {loading && <div className="p-10 text-center text-text-muted">Loading services…</div>}
        {!loading && !services.length && <div className="p-10 text-center text-text-muted">No services in this project yet.</div>}
        {!loading && services.length > 0 &&
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              {['Service Name', 'Type', 'Version', 'Health', 'Dependencies', 'Dependents', 'Owner', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs text-text-muted font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id} className="border-b border-dark-border/50 hover:bg-dark-card-2/50 transition-colors">
                <td className="px-4 py-3"><span className="text-sm text-text-primary font-medium">{svc.name}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.serviceType}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-muted font-mono">{svc.versionLabel}</span></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${healthBadge(svc.healthStatus)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {svc.healthStatus}
                  </span>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.dependencyCount}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.dependentCount}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{svc.ownerName || 'Unassigned'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {canEdit && <button onClick={() => onEditService(svc)} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><Pencil size={13} /></button>}
                    {svc.repositoryUrl && <a href={svc.repositoryUrl} target="_blank" rel="noreferrer" className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors"><ExternalLink size={13} /></a>}
                    {canManage && <button onClick={() => onDeleteService(svc)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>

      {showFilter && <FilterPopup onClose={() => setShowFilter(false)} />}
    </div>
  );
}

function DependenciesTab({ dependencies, loading, error, canEdit, onAddDependency, onDeleteDependency }) {
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
        {canEdit && <button
          onClick={onAddDependency}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Dependency
        </button>}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        {error && <div className="p-4 text-danger text-sm">{error}</div>}
        {loading && <div className="p-10 text-center text-text-muted">Loading dependencies…</div>}
        {!loading && !dependencies.length && <div className="p-10 text-center text-text-muted">No dependencies in this project yet.</div>}
        {!loading && dependencies.length > 0 &&
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              {['Source Service', 'Target Service', 'Type', 'Criticality', 'Protocol', 'Direction', 'Latency', 'Created At', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs text-text-muted font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dependencies.map((dep) => (
              <tr key={dep.id} className="border-b border-dark-border/50 hover:bg-dark-card-2/50 transition-colors">
                <td className="px-4 py-3"><span className="text-sm text-text-primary font-medium">{dep.sourceServiceName}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.targetServiceName}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.dependencyType.replaceAll('_', ' ')}</span></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${critBadge(dep.criticality)}`}>{dep.criticality}</span>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.communicationProtocol}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.direction.replaceAll('_', ' ')}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-secondary">{dep.latencyMs == null ? '—' : `${dep.latencyMs}ms`}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-text-muted">{new Date(dep.createdAt).toLocaleDateString()}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span title={dep.description || `${dep.sourceServiceName} → ${dep.targetServiceName}`} className="p-1.5 text-text-muted"><Link2 size={13} /></span>
                    {canEdit && <button onClick={() => onDeleteDependency(dep)} className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded transition-colors"><Trash2 size={13} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>

      {showFilter && <FilterPopup onClose={() => setShowFilter(false)} />}
    </div>
  );
}

function GraphTab({ project, onBlastRadius }) {

  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);

  const [selectedNode, setSelectedNode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [showViewService, setShowViewService] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);


  function getNodeColor(status){

    switch(status){

      case "HEALTHY":
        return "#10B981";

      case "WARNING":
        return "#F59E0B";

      case "ERROR":
        return "#EF4444";

      default:
        return "#6B7280";

    }

  }


  useEffect(()=>{


    async function loadGraph(){

     const graph = await getArchitectureGraph(
         project.workspaceId,
         project.id
     );


     const nodes = graph.nodes.map(node => ({

         id: node.id,

         label: node.label,

         x: Math.random() * 600,
         y: Math.random() * 450,

         color: getNodeColor(node.healthStatus),

         type: node.type,

         version: node.version,

         owner: node.owner,

         deps: 0,

         dependents: 0,

         responseTime: "-",

         desc: ""

     }));


     const edges = graph.edges.map(edge => ({

         from: edge.source,

         to: edge.target

     }));


     setGraphNodes(nodes);
     setGraphEdges(edges);
     }


    loadGraph();


  },[project]);



  useEffect(()=>{

    if(graphNodes.length){

      setSelectedNode(graphNodes[0]);

    }

  },[graphNodes]);




  if(loading){

    return (
      <div className="p-20 text-center text-text-muted">
        Loading architecture graph...
      </div>
    );

  }


  if(error){

    return (
      <div className="p-20 text-danger">
        {error}
      </div>
    );

  }



  const incomingDeps =
    graphEdges
    .filter(e=>e.to===selectedNode?.id)
    .map(e=>graphNodes.find(n=>n.id===e.from)?.label)
    .filter(Boolean);



  const outgoingDeps =
    graphEdges
    .filter(e=>e.from===selectedNode?.id)
    .map(e=>graphNodes.find(n=>n.id===e.to)?.label)
    .filter(Boolean);



  return (

<div className="space-y-4">


<div className="flex items-center justify-between">

<div></div>


<div className="flex gap-2">

<button
onClick={()=>setShowFilter(true)}
className="px-3 py-2 border border-dark-border rounded-lg"
>
<Filter size={14}/>
Filter
</button>


<button
onClick={onBlastRadius}
className="px-4 py-2 bg-primary text-white rounded-lg"
>
Blast Radius Analysis
</button>


</div>

</div>




<div className="flex gap-4" style={{height:"500px"}}>


<div className="flex-1 bg-dark-card border border-dark-border rounded-xl">


<svg
className="w-full h-full"
viewBox="0 0 740 580"
>


<defs>

<marker
id="arrow"
markerWidth="8"
markerHeight="8"
refX="7"
refY="3"
orient="auto"
>

<polygon
points="0 0,8 3,0 6"
fill="#4B5563"
/>

</marker>

</defs>



{
graphEdges.map((edge,i)=>{


const from =
graphNodes.find(n=>n.id===edge.from);


const to =
graphNodes.find(n=>n.id===edge.to);



if(!from || !to)
return null;



return (

<line
key={i}
x1={from.x}
y1={from.y}
x2={to.x}
y2={to.y}
stroke="#4B5563"
markerEnd="url(#arrow)"
/>

)


})
}




{
graphNodes.map(node=>(

<g
key={node.id}
onClick={()=>setSelectedNode(node)}
>


<circle
cx={node.x}
cy={node.y}
r="20"
fill={node.color}
/>


<text
x={node.x}
y={node.y+35}
textAnchor="middle"
fill="#9CA3AF"
fontSize="10"
>

{node.label}

</text>


</g>

))

}



</svg>


</div>




{
selectedNode &&

<div className="w-60 bg-dark-card border border-dark-border rounded-xl p-4">


<h3 className="font-semibold">
{selectedNode.label}
</h3>


<div className="text-sm mt-3 space-y-2">

<div>
Type: {selectedNode.type}
</div>


<div>
Version: {selectedNode.version}
</div>


<div>
Owner: {selectedNode.owner}
</div>


<div>
Dependencies: {selectedNode.deps}
</div>


<div>
Dependents: {selectedNode.dependents}
</div>


</div>



</div>

}



</div>



</div>


  );


}
/* ─── Main component ─── */

export default function ProjectDetails({ project, onBack, onNavigate, onAddService, onAddDependency, dependencyRevision }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProject, setShowEditProject] = useState(false);
  const [, setProjectRevision] = useState(0);
  const [team, setTeam] = useState({ members: [], currentUserRole: project?.currentUserRole || 'VIEWER' });
  const [services, setServices] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [serviceEditor, setServiceEditor] = useState(undefined);
  const [showServiceEditor, setShowServiceEditor] = useState(false);
  const [dependencies, setDependencies] = useState([]);
  const [dependencySummary, setDependencySummary] = useState(null);
  const [dependenciesLoading, setDependenciesLoading] = useState(true);
  const [dependenciesError, setDependenciesError] = useState('');

  useEffect(() => {
    let active = true;
    if (project?.workspaceId && project?.id && !project?.demo) {
      getProjectTeam(project.workspaceId, project.id)
        .then((result) => { if (active) setTeam(result); })
        .catch(() => {});
    }
    return () => { active = false; };
  }, [project?.workspaceId, project?.id, project?.demo]);

  const loadServices = async () => {
    if (!project?.workspaceId || !project?.id || project?.demo) {
      setServices(project?.demo ? projectServices : []);
      setServiceSummary(null);
      setServicesLoading(false);
      return;
    }
    setServicesLoading(true);
    setServicesError('');
    try {
      const [items, summary] = await Promise.all([
        listServices(project.workspaceId, project.id),
        getServiceSummary(project.workspaceId, project.id),
      ]);
      setServices(items);
      setServiceSummary(summary);
    } catch (requestError) {
      setServicesError(requestError.message);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, [project?.workspaceId, project?.id, project?.demo, dependencyRevision]);

  const loadDependencies = async () => {
    if (!project?.workspaceId || !project?.id || project?.demo) {
      setDependencies(project?.demo ? projectDependencies.map((value, index) => ({
        id: `demo-${index}`, sourceServiceName: value.source, targetServiceName: value.target,
        dependencyType: value.type.replace(' ', '_').toUpperCase(), criticality: value.criticality.toUpperCase(),
        communicationProtocol: 'HTTPS', direction: 'UNIDIRECTIONAL', latencyMs: value.latency,
        createdAt: '2024-05-10T00:00:00Z',
      })) : []);
      setDependenciesLoading(false);
      return;
    }
    setDependenciesLoading(true);
    setDependenciesError('');
    try {
      const [items, summary] = await Promise.all([
        listDependencies(project.workspaceId, project.id),
        getDependencySummary(project.workspaceId, project.id),
      ]);
      setDependencies(items);
      setDependencySummary(summary);
    } catch (requestError) {
      setDependenciesError(requestError.message);
    } finally {
      setDependenciesLoading(false);
    }
  };

  useEffect(() => { loadDependencies(); }, [project?.workspaceId, project?.id, project?.demo, dependencyRevision]);

  const owner = team.members.find((member) => member.role === 'OWNER');
  const memberPreview = team.members.slice(0, 5);
  const extraMembers = Math.max(0, team.members.length - memberPreview.length);
  const canEdit = ['OWNER', 'ADMIN', 'EDITOR'].includes(team.currentUserRole);
  const canManage = ['OWNER', 'ADMIN'].includes(team.currentUserRole);
  const projectHealth = services.some((service) => service.healthStatus === 'ERROR') ? 'Error'
    : services.some((service) => service.healthStatus === 'WARNING') ? 'Warning'
      : services.length && services.every((service) => service.healthStatus === 'HEALTHY') ? 'Healthy' : 'Unknown';
  const memberInitials = (member) => (member?.displayName || member?.email || '?')
    .split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

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
      case 'overview': return <OverviewTab services={services} summary={serviceSummary} dependencySummary={dependencySummary} />;
      case 'services': return <ServicesTab services={services} loading={servicesLoading} error={servicesError}
        canEdit={canEdit} canManage={canManage}
        onAddService={() => { setServiceEditor(undefined); setShowServiceEditor(true); }}
        onEditService={(service) => { setServiceEditor(service); setShowServiceEditor(true); }}
        onDeleteService={async (service) => {
          if (!window.confirm(`Delete "${service.name}"?`)) return;
          try { await deleteService(project.workspaceId, project.id, service.id); await loadServices(); }
          catch (requestError) { setServicesError(requestError.message); }
        }}
        onAddDependency={onAddDependency} />;
      case 'dependencies': return <DependenciesTab dependencies={dependencies} loading={dependenciesLoading}
        error={dependenciesError} canEdit={canEdit} onAddDependency={onAddDependency}
        onDeleteDependency={async (dependency) => {
          if (!window.confirm(`Delete dependency "${dependency.sourceServiceName} → ${dependency.targetServiceName}"?`)) return;
          try {
            await deleteDependency(project.workspaceId, project.id, dependency.id);
            await Promise.all([loadDependencies(), loadServices()]);
          } catch (requestError) { setDependenciesError(requestError.message); }
        }} />;
      case 'graph':
          return (
              <GraphVisualization
                  project={project}
                  onBack={() => setActiveTab('overview')}
                  onBlastRadius={() => onNavigate('blast-radius')}
              />
          );
      default: return <OverviewTab services={services} summary={serviceSummary} dependencySummary={dependencySummary} />;
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
              <span className={`px-2 py-0.5 text-xs rounded-full ${healthBadge(projectHealth)}`}>{projectHealth}</span>
            </div>
            <p className="text-sm text-text-muted mt-0.5">{project?.description || project?.desc || 'No description'}</p>
          </div>
        </div>
        {canEdit && <button onClick={() => setShowEditProject(true)} className="px-3 py-2 text-sm text-text-secondary border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
          <Edit2 size={14} />
          Edit Project
        </button>}
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs">{memberInitials(owner)}</div>
          <div>
            <div className="text-xs text-text-muted">Project Owner</div>
            <div className="text-text-primary font-medium text-xs">{owner?.displayName || owner?.email || 'Loading…'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {memberPreview.map((member) => (
              <div key={member.userId} title={`${member.displayName} · ${member.role}`} className="w-7 h-7 rounded-full bg-dark-card-2 border-2 border-dark-card flex items-center justify-center text-white font-semibold text-xs">{memberInitials(member)}</div>
            ))}
            {extraMembers > 0 && <div className="w-7 h-7 rounded-full bg-dark-card-2 border-2 border-dark-card flex items-center justify-center text-text-muted text-xs">+{extraMembers}</div>}
          </div>
          <div className="text-xs text-text-muted">Team Members</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-text-muted" />
          <div>
            <div className="text-xs text-text-muted">Created At</div>
            <div className="text-xs text-text-primary font-medium">{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}</div>
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

      {showEditProject && <EditProjectPopup project={project}
        onUpdated={() => setProjectRevision((value) => value + 1)}
        onClose={() => setShowEditProject(false)} />}
      {showServiceEditor && <AddServicePopup project={project} service={serviceEditor}
        members={team.members}
        onSaved={loadServices}
        onClose={() => setShowServiceEditor(false)} />}
    </div>
  );
}
