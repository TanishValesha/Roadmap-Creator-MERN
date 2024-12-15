import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";
import "./index.css";
import { FaRegSave } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa6";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AnimatedCircularProgressBar from "./components/ui/animated-circular-progress-bar";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { baseURL } from "./utils/constants";
import HorizontalConnects from "./nodes/HorizontalConnects";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import VerticalConnects from "./nodes/VerticalConnects";
import BottomConnect from "./nodes/BottomConnect";
import TopConnect from "./nodes/TopConnect";
import AllSideConnects from "./nodes/AllSideConnects";
import IconPicker from "./pages/IconPicker";
import QuillToolbar from "./pages/EditorToolbar";
import JoditEditor from "jodit-react";
import { placeholder } from "jodit/esm/plugins/placeholder/placeholder";
import { Editor } from "react-draft-wysiwyg";
import "../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const initialNodes = [];

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

  const [currentUser, setCurrentUser] = useState(null);

  const [roadmapName, setRoadmapName] = useState("");

  const [dbGraphs, setDbgraphs] = useState([]);
  const [publicGraphs, setPublicGraphs] = useState([]);

  const [isEnabled, setIsEnabled] = useState(false);

  const [notes, setNotes] = useState();

  const editor = useRef(null);

  const config = {
    height: 300,
    readOnly: false,
    placeholder: "Start Typing.....",
  };

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
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId() + uuidv4(),
        type,
        position,
        data: { label: `${type} node` },
      };
      console.log(newNode);
      console.log("Set Node");

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

  const handleTempSave = () => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    toast.success("Saved!");
  };

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
  const handleDBSave = async (e) => {
    const nodeData = nodes;
    const edgeData = edges;
    const fileData = { nodeData, edgeData };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseURL}/api/chart/save`,
        {
          data: fileData,
          title: roadmapName,
          userId: currentUser.id,
          username: currentUser.name,
          isPublic: isEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status == 201) {
        toast.success("Saved in DB, Hit Reload");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Unable to save");
    }
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

          // onNodesChange(jsonChartData.item);
        } catch (error) {
          console.error("Error parsing JSON:", error); // Handle any JSON parsing errors
        }
      };

      reader.readAsText(file);
    }
  };

  const handleDownload = async (graphId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseURL}/api/chart/graphs-db/import/${graphId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data[0].data.nodeData);
      setNodes(response.data[0].data.nodeData);
      setEdges(response.data[0].data.edgeData);
      toast.success("Imported Succesfully");
    } catch (error) {
      console.log(error);
      toast.error("Can't Load from DB");
    }
  };

  const handleDelete = async (graphId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${baseURL}/api/chart/graphs-db/delete/${graphId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 201) {
        toast.success("Deleted Successfully, Hit Refresh");
      } else {
        console.log(error);
        toast.error("Can't Delete from DB");
      }
    } catch (error) {
      console.log(error);
      toast.error("Can't Delete from DB");
    }
  };

  // const handleSaveState = () => {
  //   const localNodes = localStorage.getItem("nodes");
  //   const localEdges = localStorage.getItem("edges");
  //   console.log("Running");

  //   if (localEdges == edges && localNodes == nodes) {
  //     setSaved(true);
  //   } else {
  //     setSaved(false);
  //   }
  // };

  const handleCheckboxChange = (nodeId, isChecked) => {
    isChecked = !isChecked;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, checked: isChecked } : node
      )
    );
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseURL}/api/user/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCurrentUser(response.data.data);
    return response.data.data;
  };

  const getPriavteDBgraphs = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseURL}/api/chart/graphs-db/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDbgraphs(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Can't Load from DB");
    }
  };

  const getPublicGraphs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseURL}/api/chart/graphs-db`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublicGraphs(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Can't Load from DB");
    }
  };

  const handleExistingNote = async () => {
    const token = localStorage.getItem("token");
    const user = await getCurrentUser();
    try {
      const response = await axios.get(
        `${baseURL}/api/notes/get-note/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const existingNote = response.data;
      if (existingNote.length != 0) {
        setNotes(existingNote[0].content);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unexpected Error!");
    }
  };

  const handleNotes = async () => {
    const token = localStorage.getItem("token");
    const user = await getCurrentUser();
    let existingNote = null;
    try {
      const response = await axios.get(
        `${baseURL}/api/notes/get-note/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      existingNote = response.data;
      console.log(existingNote);
      if (existingNote.length === 0) {
        try {
          const response = await axios.post(
            `${baseURL}/api/notes/save-note`,
            {
              content: notes,
              isGlobal: true,
              userId: user.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Notes Saved");
        } catch (error) {
          console.log(error);
          toast.error("Unexpected Error!");
        }
      } else {
        try {
          console.log(notes);
          const response = await axios.put(
            `${baseURL}/api/notes/update-note/${existingNote[0]._id}`,
            { notes },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          toast.success("Notes Updated!");
        } catch (error) {
          console.log(error);
          toast.error("Unexpected Error!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Unexpected Error!");
    }

    //
  };

  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("nodes", "");
    localStorage.setItem("edges", "");
    navigate("/");
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

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (user) {
        await getPriavteDBgraphs(user.id);
      }
    };
    fetchData();
    getPublicGraphs();
  }, []);

  const nodeTypes = {
    allSideConnects: AllSideConnects,
    horizontalConnects: HorizontalConnects,
    verticalConnects: VerticalConnects,
    topConnect: TopConnect,
    bottomConnect: BottomConnect,
  };

  const navigate = useNavigate();
  const totalNodes = nodes.length;
  let checkedNodes = 0;
  {
    nodes.map((node) => {
      if (node.checked == true) {
        checkedNodes++;
      }
    });
  }
  let value = 0;
  if (totalNodes != 0) {
    value = Math.floor((checkedNodes / totalNodes) * 100);
  }

  return (
    <div className="dndflow">
      <div className="flex flex-col items-start bg-blue-600 w-[20%] h-[50%] p-6 gap-4 shadow-lg">
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
      <div className="absolute bottom-0 w-[20%] h-[50%]">
        <Tabs defaultValue="account" className="w-[100%]">
          <TabsList className="w-[100%] flex justify-evenly">
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
          </TabsList>
          <TabsContent value="private" className="h-[100%] outline-none">
            <ScrollArea className="rounded-md border">
              <div className="p-3 flex flex-col">
                <div className="flex justify-between">
                  <h4 className="mb-4 text-lg font-medium leading-none">
                    My Roadmaps
                  </h4>
                </div>
                {dbGraphs.length != 0 ? (
                  dbGraphs.map((graph) => (
                    <div key={graph._id}>
                      <div className="flex justify-between items-center px-2">
                        <div className="text-sm">{graph.title}</div>
                        <div className="flex gap-2">
                          <MdDelete
                            className="cursor-pointer text-xl text-red-500"
                            onClick={async () => {
                              handleDelete(graph._id);
                              const user = await getCurrentUser();
                              if (user) {
                                await getPriavteDBgraphs(user.id);
                                await getPublicGraphs();
                              }
                            }}
                          />
                          <IoMdDownload
                            className="cursor-pointer text-xl"
                            onClick={() => {
                              handleDownload(graph._id);
                            }}
                          />
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="public">
            <ScrollArea className="rounded-md border">
              <div className="p-3 flex flex-col">
                <div className="flex justify-between">
                  <h4 className="mb-4 text-lg font-medium leading-none">
                    Publically Available Roadmaps
                  </h4>
                </div>
                {publicGraphs.length != 0 ? (
                  publicGraphs.map((graph) => (
                    <div key={graph._id} className="flex flex-col gap-[2px]">
                      <div className="flex justify-between items-center px-2">
                        <div className="flex justify-start items-center gap-1">
                          <FaGlobeAmericas />
                          <div className="text-sm">{graph.title}</div>
                        </div>
                        <div className="flex gap-2">
                          <IoMdDownload
                            className="cursor-pointer text-xl"
                            onClick={() => {
                              handleDownload(graph._id);
                            }}
                          />
                        </div>
                      </div>
                      <div className="pl-2 flex justify-start items-center gap-1">
                        <IoPerson className="text-sm" />
                        <span>
                          Owner:{" "}
                          <span className="font-bold">{graph.username}</span>
                        </span>
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              id: node.id,
              onCheckboxChange: handleCheckboxChange,
              checked: node.checked, // Ensure this is added dynamically
            },
          }))}
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
          nodeTypes={nodeTypes}
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
            <div className="flex flex-row justify-center items-center">
              <Dialog>
                <DialogTrigger className="bg-white font-semibold py-[0.35rem] px-3 rounded-md text-black gap-2 hover:bg-white shadow flex flex-row justify-center items-center">
                  <FaDatabase className="text-xl" />
                  Save in DB
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Enter Roadmap Details</DialogTitle>
                  <Input
                    type="name"
                    placeholder="Roadmap Title"
                    onChange={(e) => {
                      setRoadmapName(e.target.value);
                    }}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(value) => setIsEnabled(value)}
                    />
                    <Label htmlFor="public">Public</Label>
                  </div>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      onClick={async () => {
                        handleDBSave();
                        const user = await getCurrentUser();
                        if (user) {
                          await getPriavteDBgraphs(user.id);
                          await getPublicGraphs();
                        }
                      }}
                    >
                      <span className="text-white">Save</span>
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-row justify-center items-center">
              <Dialog>
                <DialogTrigger className="bg-white font-semibold py-[0.35rem] px-3 rounded-md text-black gap-2 hover:bg-white shadow flex flex-row justify-center items-center">
                  <IoLogOut className="text-2xl" />
                  Logout
                </DialogTrigger>
                <DialogContent className="max-w-[350px]">
                  <DialogHeader>
                    <DialogTitle>Are your sure you want logout ?</DialogTitle>
                    <DialogDescription>
                      Make sure you have saved your changes permanently on the
                      DB.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <div className=" mt-4 flex gap-6 justify-center">
                      <Button type="submit" onClick={() => {}}>
                        <span className="text-white">No</span>
                      </Button>
                      <Button
                        type="submit"
                        className="bg-transparent  hover:bg-transparent"
                        onClick={handleLogout}
                      >
                        <span className="text-blue-600">Yes</span>
                      </Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="absolute left-16 bottom-6 z-10">
            <Dialog>
              <DialogTrigger
                onClick={handleExistingNote}
                className="bg-white font-semibold py-[0.35rem] px-3 rounded-md text-black gap-2 hover:bg-white shadow flex flex-row justify-center items-center"
              >
                <CgNotes className="text-xl" />
                Notes
              </DialogTrigger>
              <DialogContent className="min-w-[1400px]">
                <DialogHeader>
                  <DialogTitle>Notes</DialogTitle>
                </DialogHeader>
                <div className="min-h-[500px] pb-10">
                  <ReactQuill theme="snow" value={notes} onChange={setNotes} />;
                </div>
                <Button onClick={handleNotes}>Save</Button>
              </DialogContent>
            </Dialog>
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
          <div className="absolute bottom-0 right-0 scale-75 z-10">
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={value}
              gaugePrimaryColor="#2563EB"
              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
            />
          </div>
          {/* <IconPicker className="z-10" /> */}
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
