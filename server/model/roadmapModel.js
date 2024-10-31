const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  title: { type: String, unique: true },
  userId: { type: String },
  username: { type: String },
  isPublic: { type: Boolean },
});

exports.Graph = mongoose.model("Graph", graphSchema);
