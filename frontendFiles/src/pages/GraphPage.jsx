import React, { useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import dagre from "dagre";

// 🔷 Layout function (like Neo4j)
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x-75,
        y: pos.y-25,
      },
      sourcePosition: "bottom",
      targetPosition: "top",
    };
  });

  return { nodes: layoutedNodes, edges };
};

function GraphPage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [service, setService] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [failedService, setFailedService] = useState("");
  const [impactedNodes, setImpactedNodes] = useState([]);

  // 🔹 Fetch Graph
  const fetchGraph = async () => {
    const res = await axios.get("http://localhost:8080/api/graph");
    const data = res.data;

    const nodeSet = new Set();
    const newNodes = [];
    const newEdges = [];

    data.forEach((item, index) => {
      nodeSet.add(item.source);
      nodeSet.add(item.target);

      newEdges.push({
        id: "e" + index,
        source: item.source,
        target: item.target,
        type: "smoothstep",
      });
    });

    nodeSet.forEach((n) => {
      let color = "#87CEEB"; // default

      if (n === failedService) {
        color = "red";
      } else if (impactedNodes.includes(n)) {
        color = "yellow";
      }

      newNodes.push({
        id: n,
        data: { label: n },
        position: { x: 0, y: 0 },
        style: {
          background: color,
          color: "black",
          border: "1px solid #333",
          padding: 10,
        },
      });
    });

    const layouted = getLayoutedElements(newNodes, newEdges);

    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  };

  // 🔹 Add Service
  const addService = async () => {
    await axios.post("http://localhost:8080/api/service", {
      name: service,
    });
    setService("");
  };

  // 🔹 Add Dependency
  const addDependency = async () => {
    await axios.post("http://localhost:8080/api/dependency", {
      from,
      to,
    });
    setFrom("");
    setTo("");
  };

  // 🔹 Get Impact
  const getImpact = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/impact?service=${failedService}`
    );
    setImpactedNodes(res.data);
  };

  return (
    <div style={{ height: "100vh", padding: 20 }}>
      <h2>API Dependency Graph</h2>

      {/* Add Service */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Service Name"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <button onClick={addService}>Add Service</button>
      </div>

      {/* Add Dependency */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={addDependency}>Add Dependency</button>
      </div>

      {/* Blast Radius */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Failed Service"
          value={failedService}
          onChange={(e) => setFailedService(e.target.value)}
        />
        <button onClick={getImpact}>Show Impact</button>
      </div>

      {/* Visualize */}
      <button onClick={fetchGraph}>Visualize Graph</button>

      {/* Graph */}
      <div style={{ height: "80%", marginTop: 20 }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default GraphPage;