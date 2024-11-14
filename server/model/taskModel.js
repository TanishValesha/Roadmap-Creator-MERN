const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  userId: { type: String },
  isCompleted: { type: Boolean },
});

exports.Task = mongoose.model("Task", taskSchema);
