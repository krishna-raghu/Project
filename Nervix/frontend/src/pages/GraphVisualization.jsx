import React, { useEffect, useState } from 'react';

import {
  ArrowLeft,
  Search,
  Filter,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { getArchitectureGraph } from "../api";
import ServiceFullDetailsPopup from "./ServiceFullDetailsPopup";

// GraphVisualization receives the current project
// from ProjectDetails so it can fetch that project's graph
export default function GraphVisualization({ project, onBack, onBlastRadius }) {


  // Stores nodes received from backend
  const [graphNodes, setGraphNodes] = useState([]);


  // Stores dependency connections received from backend
  const [graphEdges, setGraphEdges] = useState([]);


  // Controls loading state while API request is running
  const [loading, setLoading] = useState(true);

  // Stores the service node selected by the user
  // Used to show details of the clicked service
  const [selectedNode, setSelectedNode] = useState(null);

  //search a service
  const [searchTerm, setSearchTerm] = useState("");

  // filter option for services
  const [selectedHealth, setSelectedHealth] = useState("ALL");

  // Current graph layout
  const [layout, setLayout] = useState("TREE");

  // Controls the Service Details popup
  const [showServiceDetails, setShowServiceDetails] = useState(false);



  // Fetch graph whenever project changes
  useEffect(() => { fetchArchitectureGraph(); }, [project]);

  // Fetch layout positions
  useEffect(() => {

      setGraphNodes(nodes => applyLayout(nodes, layout));

  }, [layout]);

  // Fetch architecture graph from Spring Boot backend
  async function fetchArchitectureGraph() {

    if (!project?.id) return;


    try {
      setLoading(true);
      // Calls:
      // GET /api/projects/{projectId}/architecture/graph
      const graph = await getArchitectureGraph(project.id);

      // Convert backend nodes into format used by SVG
      const nodes = graph.nodes.map((node, index) => ({
        id: node.id,
        label: node.label,



        // Node colour based on health
        color: getNodeColor(node.healthStatus),

        // Extra metadata
        type: node.type,
        owner: node.owner,
        version: node.version,
        healthStatus: node.healthStatus


      }));


      // Convert backend edges into SVG connection format
      const edges = graph.edges.map(edge => ({
          id: edge.id,
          from: edge.source,
          to: edge.target
      }));




     setGraphNodes(applyLayout(nodes, layout));
     setGraphEdges(edges);


    } catch(error) {

      console.error(
        "Architecture graph loading failed:",
        error
      );


    } finally {
      setLoading(false);

    }


  }



  // Converts backend health status into node colors
  function getNodeColor(status) {

    switch(status) {

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

//to get nodes names for service details
function getNodeName(id){

 const node = graphNodes.find(
    node => node.id === id
 );

 return node ? node.label : id;

}



// Filters graph nodes based on search and health status
const filteredNodes = graphNodes.filter(node => {

  const matchesSearch =
    node.label
      .toLowerCase()
      .includes(searchTerm.toLowerCase());


  const matchesHealth =
    selectedHealth === "ALL" ||
    node.healthStatus === selectedHealth;


  return matchesSearch && matchesHealth;

});

// layout function
function applyLayout(nodes, layout) {

    return nodes.map((node, index) => {

        let x;
        let y;

        if(layout === "VERTICAL"){

            x = 400;
            y = 100 + index * 120;

        }

        else if(layout === "CIRCLE"){

            const angle = (2 * Math.PI * index) / nodes.length;

            x = 400 + 220 * Math.cos(angle);
            y = 260 + 180 * Math.sin(angle);

        }

        // ⭐ Tree Layout
        else if(layout === "TREE"){

            // Root node
            if(index === 0){

                x = 400;
                y = 80;

            }

            // Second level
            else if(index <= 2){

                x = 250 + (index - 1) * 300;
                y = 220;

            }

            // Third level
            else{

                const childIndex = index - 3;

                x = 120 + childIndex * 160;
                y = 380;

            }

        }

        // Default Grid Layout
        else{

            x = 150 + (index % 4) * 180;
            y = 120 + Math.floor(index / 4) * 150;

        }

        return {
            ...node,
            x,
            y
        };

    });

}




// Services this node depends on
      const outgoingRelationships = selectedNode
        ? graphEdges.filter(
            edge => edge.from === selectedNode.id
          )
        : [];

 // Services that depend on this node
      const incomingRelationships = selectedNode
        ? graphEdges.filter(
            edge => edge.to === selectedNode.id
          )
        : [];



  // Loading screen while fetching graph
  if (loading) {

    return (
      <div className="p-6 text-center text-text-muted">

        Loading architecture graph...

      </div>

    );

  }



  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <button
            onClick={onBack}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors"
          >

            <ArrowLeft size={20} />

          </button>


          <div>

            <h1 className="text-xl font-semibold text-text-primary">
                Architecture Graph - {project?.name}
            </h1>

          </div>

        </div>


        <div className="flex items-center gap-3">

          <div className="relative">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={14}
            />

           <input
             type="text"
             placeholder="Search nodes in graph..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-9 pr-4 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary w-48"
           />

          </div>

         {/* filtering dropdown */}
          <select
            value={selectedHealth}
            onChange={(e) => setSelectedHealth(e.target.value)}
            className="px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary"
          >
            <option value="ALL">All</option>
            <option value="HEALTHY">Healthy</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>

           {/* layout dropdown */}
          <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="px-3 py-2 bg-dark-card-2 border border-dark-border rounded-lg text-sm text-text-primary"
          >
              <option value="TREE">Tree</option>
              <option value="CIRCLE">Circle</option>
               <option value="GRID">Grid</option>
               <option value="VERTICAL">Vertical</option>

          </select>


          <button
            onClick={onBlastRadius}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >

            Blast Radius Analysis

          </button>

        </div>

      </div>


           <div
              className="bg-dark-card border border-dark-border rounded-xl p-4"
              style={{ height: '600px' }}
            >

              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-4">


                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-success"></div>

                    <span className="text-xs text-text-secondary">
                      Healthy
                    </span>

                  </div>


                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-warning"></div>

                    <span className="text-xs text-text-secondary">
                      Warning
                    </span>

                  </div>


                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-danger"></div>

                    <span className="text-xs text-text-secondary">
                      Error
                    </span>

                  </div>


                </div>



                <div className="flex items-center gap-2">


                  <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">

                    <ZoomOut size={16} />

                  </button>


                  <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">

                    <ZoomIn size={16} />

                  </button>


                  <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-card-2 rounded-lg transition-colors">

                    <Maximize2 size={16} />

                  </button>


                </div>


              </div>





              {/* SVG Architecture Graph */}

              <svg
                width="100%"
                height="520"
                viewBox="0 0 800 600"
                className="bg-dark-bg/50 rounded-lg border border-dark-border"
              >


                <defs>

                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >

                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill="#374151"
                    />

                  </marker>


                </defs>





                {/* Draw dependency lines */}

                {graphEdges.map((edge, i) => {


                  const fromNode =
                    graphNodes.find(
                      node => node.id === edge.from
                    );


                  const toNode =
                    graphNodes.find(
                      node => node.id === edge.to
                    );



                  if (!fromNode || !toNode)
                    return null;



                  return (

                    <line

                      key={edge.id}

                      x1={fromNode.x}

                      y1={fromNode.y}

                      x2={toNode.x}

                      y2={toNode.y}

                      stroke="#374151"

                      strokeWidth="2"

                      markerEnd="url(#arrowhead)"

                    />

                  );


                })}





                {/* Draw graph nodes */}

                {filteredNodes.map((node) => (

                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer"
                  >


                    {/* Outer glow */}

                    <circle

                      cx={node.x}

                      cy={node.y}

                      r="28"

                      fill={node.color}

                      opacity="0.15"

                    />



                    {/* Main node */}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={selectedNode?.id === node.id ? "16" : "12"}
                      fill={node.color}
                    />



                    {/* Node name */}

                    <text

                      x={node.x}

                      y={node.y + 28}

                      textAnchor="middle"

                      fill="#9CA3AF"

                      fontSize="12"

                      fontWeight="500"

                    >

                      {node.label}

                    </text>


                  </g>

                ))}



              </svg>


            </div>





            {/* Node Details Section */}

            <div className="bg-dark-card border border-dark-border rounded-xl p-5">


              <h3 className="text-sm font-semibold text-text-primary mb-4">

                Node Details

              </h3>




              <div className="space-y-4">


                {selectedNode ? (

                <div className="flex items-center justify-between p-3 bg-dark-card-2 rounded-lg border border-dark-border">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />

                    <span className="text-sm text-text-primary font-medium">
                      {selectedNode.label}
                    </span>

                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                      {selectedNode.healthStatus}
                    </span>

                  </div>


                  <div className="flex items-center gap-6 text-sm text-text-secondary">

                    <span>
                      Type: {selectedNode.type}
                    </span>

                    <span>
                      Version: {selectedNode.version}
                    </span>

                    <span>
                      Owner: {selectedNode.owner}
                    </span>

                  </div>


                  <button
                      onClick={() => setShowServiceDetails(true)}
                      className="px-3 py-1.5 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                      View Service Details
                  </button>


                </div>

                ) : (

                <div className="text-sm text-text-muted">
                  Click a service node to view details
                </div>

                )}


            {/*  dependency details for selected node  */}
            {selectedNode && (

            <div className="grid grid-cols-2 gap-4">


            <div className="bg-dark-card border border-dark-border rounded-xl p-4">

            <h3 className="text-sm font-semibold text-text-primary mb-3">
            Outgoing Dependencies
            </h3>


            {
            outgoingRelationships.length > 0 ?

            outgoingRelationships.map(edge => (

            <div
             key={edge.id}
             className="text-sm text-text-secondary py-2"
            >
            → {getNodeName(edge.to)}
            </div>

            ))

            :

            <div className="text-sm text-text-muted">
            No outgoing dependencies
            </div>

            }


            </div>



            <div className="bg-dark-card border border-dark-border rounded-xl p-4">


            <h3 className="text-sm font-semibold text-text-primary mb-3">
            Incoming Dependencies
            </h3>


            {
            incomingRelationships.length > 0 ?

            incomingRelationships.map(edge => (

            <div
             key={edge.id}
             className="text-sm text-text-secondary py-2"
            >
            ← {getNodeName(edge.from)}
            </div>

            ))

            :

            <div className="text-sm text-text-muted">
            No incoming dependencies
            </div>

            }
            </div>

            </div>

            )}

              </div>

            </div>

           {showServiceDetails && (
             <ServiceFullDetailsPopup
               node={selectedNode}
               onClose={() => setShowServiceDetails(false)}
             />
           )}

          </div>

        );


      }