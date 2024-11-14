const { Task } = require("../model/taskModel");

exports.saveTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).send({ message: "Saved!", success: true });
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error saving data", error);
  }
};

exports.getAllTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId });
    res.status(201).json(tasks);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  try {
    const { isCompleted } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { isCompleted },
      { new: true }
    );
    if (!updatedTask) {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    await Task.deleteOne({ _id: taskId });
    res.status(201).json("Deleted");
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
