import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";
import "./index.css";
import { FaRegSave } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa6";
import { BiImport } from "react-icons/bi";
import toast from "react-hot-toast";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Root" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const [editValue, setEditValue] = useState("");
  const [_id, setId] = useState();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  const onNodeClick = (e, node) => {
    setEditValue(node.data.label);
    setSelectedNodeId(node.id);
    setId(node.id);
  };

  const onEdgeClick = (e, edge) => {
    setSelectedEdgeId(edge.id);
    handleDeleteEdge(selectedEdgeId);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleEdit = () => {
    const res = nodes.map((item) => {
      if (item.id === _id) {
        console.log(item);
        item.data = {
          ...item.data,
          label: editValue,
          position: {
            // Slightly change the position to force a re-render
            ...item.position,
            x: item.position.x + 0.01, // A minor nudge
          },
        };
      }
      return item;
    });
    setNodes((prevNodes) => [...prevNodes]); // Force a new array
    onNodesChange(res); // Manually trigger node changes
    setEditValue("");
  };

  const handleDeleteEdge = (edgeId) => {
    const updatedEdges = edges.filter((edge) => edge.id !== edgeId);
    setEdges(updatedEdges); // Update edges state
  };

  const handleDeleteNode = (nodeId) => {
    // Filter out the node to be deleted
    const updatedNodes = nodes.filter((node) => node.id !== nodeId);
    // Filter out any edges connected to the deleted node
    const updatedEdges = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(updatedNodes); // Update nodes state
    setEdges(updatedEdges); // Update edges state
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedNodeId) {
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNodeId]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

  const handleTempSave = () => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    toast.success("Saved!");
  };

  const getDataOnReload = () => {};

  const handleSave = () => {
    const nodeData = nodes;
    const edgeData = edges;
    const fileData = { nodeData, edgeData };
    const fileDataJSON = JSON.stringify(fileData, null, 2);
    const blob = new Blob([fileDataJSON], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "chartData.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event) => {
    const file = event.target.files[0]; // Get the first selected file

    if (file) {
      const reader = new FileReader(); // Create a new FileReader object

      // When the file is read successfully
      reader.onload = (e) => {
        try {
          const fileContents = e.target.result; // Get the file content as a string
          const jsonChartData = JSON.parse(fileContents); // Parse the JSON content// Optional: Log the data
          setNodes(jsonChartData["nodeData"]);
          setEdges(jsonChartData["edgeData"]);
          console.log(jsonChartData[1]);

          // onNodesChange(jsonChartData.item);
        } catch (error) {
          console.error("Error parsing JSON:", error); // Handle any JSON parsing errors
        }
      };

      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");
    if (savedNodes) {
      const restoredNodes = JSON.parse(savedNodes);
      const restoredEdges = JSON.parse(savedEdges);
      setNodes(restoredNodes);
      setEdges(restoredEdges);
      toast.success("Restored Previous Session");
    }
  }, []);

  return (
    <div className="dndflow">
      <div className="flex flex-col items-start bg-blue-500 w-[20%] p-6 gap-4 shadow-lg">
        <label className="text-2xl text-white ">Label: </label>
        <input
          type="text"
          className="text-black p-1 rounded w-56"
          value={editValue}
          onChange={handleChange}
        />
        <button
          className="rounded border p-2 text-pretty text-white shadow"
          onClick={handleEdit}
        >
          Update label
        </button>
      </div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(e, node) => {
            onNodeClick(e, node);
          }}
          onEdgeClick={(e, edge) => {
            onEdgeClick(e, edge);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background variant="lines" />
          <Controls />
          <div className="flex gap-4 px-4 py-2 absolute top-[10px] left-[10px] z-10">
            <div className="flex flex-row justify-center items-center">
              <Button
                className="bg-white text-black gap-2 hover:bg-white shadow"
                onClick={handleTempSave}
              >
                <FaRegSave className="text-xl" />
                Save
              </Button>
            </div>
            <div className="flex flex-row justify-center items-center">
              <Button
                className="bg-white text-black gap-2 hover:bg-white shadow"
                onClick={handleSave}
              >
                <FaFileExport className="text-xl" />
                Export as JSON
              </Button>
            </div>
          </div>
          <div className="flex gap-4 px-4 py-2 absolute top-[10px] left-[750px] z-10">
            <div className="flex flex-row justify-center items-center">
              <div>
                <input
                  type="file"
                  accept=".json" // Accept only .json files
                  onChange={handleImport} // Event handler for file upload
                  className="mb-4"
                />
              </div>
            </div>
          </div>
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
