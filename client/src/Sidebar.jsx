import React, { useState, useEffect } from "react";
import { useDnD } from "./DnDContext";
import { LuDot } from "react-icons/lu";
import { baseURL } from "./utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDelete } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { MdDone } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default () => {
  const [_, setType] = useDnD();
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [taskName, setTaskName] = useState("");
  let completedTask = 0;
  const totalTasks = tasks.length;

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  tasks.map((task) => {
    if (task.isCompleted) {
      completedTask++;
    }
  });
  const completionPercentage = totalTasks
    ? (completedTask / totalTasks) * 100
    : 0;

  const handleTaskSave = async (e) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseURL}/api/tasks/save-task`,
        {
          title: taskName,
          userId: currentUser.id,
          isCompleted: false,
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

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${baseURL}/api/tasks/delete-task/${taskId}`,
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

  const getAllTasks = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseURL}/api/tasks/get-task/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Can't Load from DB");
    }
  };

  const handleCheckboxChange = async (taskId, currentStatus) => {
    console.log("asdasd");
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${baseURL}/api/tasks/update-task/${taskId}`,
        {
          isCompleted: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, isCompleted: !currentStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
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

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (user) {
        await getAllTasks(user.id);
      }
    };
    fetchData();
    console.log(tasks);
  }, []);

  return (
    <aside className="flex flex-col items-center justify-between">
      <div className="flex flex-col gap-2">
        <div>
          <div className="description">
            You can drag these nodes to the pane on the right.
          </div>
          <div className="flex flex-col space-y-3 mb-3">
            {/* <div
              className="text-center bg-transparen outline outline-2 outline-blue-600"
              onDragStart={(event) => onDragStart(event, "allSideConnects")}
              draggable
            >
              All Side Connects
            </div> */}
            <div
              className="text-center bg-transparen outline outline-2 outline-blue-600"
              onDragStart={(event) => onDragStart(event, "horizontalConnects")}
              draggable
            >
              Horizontal Connects
            </div>
            <div
              className="text-center bg-transparen outline outline-2 outline-blue-600"
              onDragStart={(event) => onDragStart(event, "verticalConnects")}
              draggable
            >
              Vertical Connects
            </div>
            <div
              className="text-center bg-transparen outline outline-2 outline-blue-600"
              onDragStart={(event) => onDragStart(event, "topConnect")}
              draggable
            >
              Top Connect
            </div>
            <div
              className="text-center bg-transparen outline outline-2 outline-blue-600"
              onDragStart={(event) => onDragStart(event, "bottomConnect")}
              draggable
            >
              Bottom Connect
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-start items-baseline">
              <LuDot />
              <p>Select and press 'Delete' key to delete a node</p>
            </div>
            <div className="flex justify-start items-center">
              <LuDot />
              <p>Double click an edge to delete a edge</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%]">
        <div className="mb-10 flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            <Label>Tasks Progress: {Math.round(completionPercentage)}%</Label>
            <div className="bg-green-500 rounded-full p-1">
              <MdDone className="text-lg text-white" />
            </div>
          </div>
          <div>
            <Progress value={completionPercentage} />
            <Label className="text-xs">Progress Indicator</Label>
          </div>
        </div>
        <ScrollArea className="max-w-[100%] h-64 rounded-md border">
          <div className="p-4">
            <div className="flex flex-row items-start justify-between">
              <h4 className="mb-4 text-lg font-medium leading-none">Tasks</h4>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger className="bg-black p-1 rounded-full">
                    <IoAddOutline className="text-lg cursor-pointer text-white font-bold" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Enter Task Title</DialogTitle>
                    <Input
                      type="name"
                      placeholder="Task"
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                    />
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        onClick={async () => {
                          handleTaskSave();
                          const user = await getCurrentUser();
                          if (user) {
                            await getAllTasks(user.id);
                          }
                        }}
                      >
                        <span className="text-white">Add Task</span>
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {tasks.map((task) => (
              <div key={task._id} className="mt-[3%]">
                <Card className="overflow-hidden">
                  <CardHeader className="p-2 flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-2 items-center w-full">
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={() =>
                          handleCheckboxChange(task._id, task.isCompleted)
                        }
                      />
                      <CardTitle
                        className={`truncate max-w-28 ${
                          task.isCompleted ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </CardTitle>
                    </div>
                    <div className="flex flex-row items-center">
                      <MdDelete
                        className="cursor-pointer text-xl"
                        onClick={async () => {
                          handleDelete(task._id);
                          const user = await getCurrentUser();
                          if (user) {
                            await getAllTasks(user.id);
                          }
                        }}
                      />
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
