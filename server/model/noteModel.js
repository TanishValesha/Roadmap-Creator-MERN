const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: { type: String },
  isGlobal: { type: Boolean },
  userId: { type: String },
});

exports.Note = mongoose.model("Note", noteSchema);
