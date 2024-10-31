const { Graph } = require("../model/roadmapModel");

exports.saveGraph = async (req, res) => {
  try {
    const newGraph = new Graph(req.body);
    await newGraph.save();
    res.status(201).send({ message: "Saved!", success: true });
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error saving data", error);
  }
};

exports.getPrivateGraphs = async (req, res) => {
  const { userId } = req.params;

  try {
    const graphs = await Graph.find({ userId });
    res.status(201).json(graphs);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to fetch graphs" });
  }
};

exports.getPublicGraphs = async (req, res) => {
  try {
    const graphs = await Graph.find({ isPublic: true });
    res.status(201).json(graphs);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to fetch graphs" });
  }
};

exports.getGraphById = async (req, res) => {
  const { graphId } = req.params;

  try {
    const response = await Graph.find({ _id: graphId });
    if (!response) {
      res.status(404).json("Graph not found!");
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to fetch graph" });
  }
};

exports.deleteGraphById = async (req, res) => {
  const { graphId } = req.params;

  try {
    await Graph.deleteOne({ _id: graphId });
    res.status(201).json("Deleted");
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ message: "Failed to delete graph" });
  }
};
