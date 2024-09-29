import React from "react";

const ChartExporter = () => {
  const chartData = {
    name: "Chart 2",
    item: [
      {
        id: "1",
        type: "input",
        data: {
          label: "Root",
          position: {
            x: 238.51,
            y: -56,
          },
        },
        position: {
          x: 233.88172231229487,
          y: -54.68049208922711,
        },
        measured: {
          width: 150,
          height: 40,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "dndnode_0",
        type: "default",
        position: {
          x: 233.2588988734077,
          y: 47.99999999999999,
        },
        data: {
          label: "Node 1",
          position: {
            x: 235.01,
            y: 47.99999999999999,
          },
        },
        measured: {
          width: 150,
          height: 40,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "dndnode_1",
        type: "default",
        position: {
          x: 231.45056271163355,
          y: 155.49705961297482,
        },
        data: {
          label: "Node 2",
          position: {
            x: 234.07221440152193,
            y: 158.97926186615933,
          },
        },
        measured: {
          width: 150,
          height: 40,
        },
        selected: false,
        dragging: false,
      },
      {
        id: "dndnode_2",
        type: "output",
        position: {
          x: 231.11533730068004,
          y: 273.1650449303349,
        },
        data: {
          label: "Node 3",
          position: {
            x: 234.6075395538645,
            y: 281,
          },
        },
        measured: {
          width: 150,
          height: 40,
        },
        selected: false,
        dragging: false,
      },
    ],
  };

  // Function to handle exporting chartData as a JSON file
  const exportData = () => {
    const fileData = JSON.stringify(chartData, null, 2); // Convert the data to a string
    const blob = new Blob([fileData], { type: "application/json" }); // Create a Blob with the JSON data
    const url = URL.createObjectURL(blob); // Create a link to the Blob

    // Create a temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "chartData.json"; // The filename of the exported file
    document.body.appendChild(link);
    link.click(); // Simulate click to download the file
    document.body.removeChild(link); // Remove the link from the DOM
  };

  return (
    <div>
      <button
        onClick={exportData}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Export Chart Data
      </button>
    </div>
  );
};

export default ChartExporter;
