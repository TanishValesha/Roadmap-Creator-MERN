const { Note } = require("../model/noteModel");

exports.saveNote = async (req, res) => {
  try {
    const newNote = new Note(req.body);
    await newNote.save();
    res.status(201).send({ message: "Saved!", success: true });
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error saving data", error);
  }
};

exports.getNote = async (req, res) => {
  const { userId } = req.params;
  try {
    const note = await Note.find({ userId });
    res.status(201).json(note);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.updateNote = async (req, res) => {
  const { noteId } = req.params;
  const content = req.body.notes;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content: content },
      {
        new: true,
      }
    );

    res.status(201).send({ message: "Updated!", updatedNote, success: true });
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error saving data", error);
  }
};
