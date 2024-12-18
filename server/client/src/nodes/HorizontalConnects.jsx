import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox } from "@/components/ui/checkbox";

const HorizontalConnects = ({ id, data }) => {
  const handleCheckboxChange = (checked) => {
    checked = !checked;
    data.onCheckboxChange(data.id, checked);
  };

  return (
    <div className="p-[10px] border border-solid border-black bg-white relative flex gap-2 rounded justify-center items-center">
      <Checkbox
        checked={data.checked || false}
        onCheckedChange={handleCheckboxChange}
      />
      <p className="text-sm">
        {data.label === "horizontalConnects node"
          ? "Horizontal Connects"
          : data.label}
      </p>

      {/* Right-side handle for outgoing edges */}
      <Handle
        type="source" // This specifies it's an outgoing edge
        position={Position.Right}
        isConnectable={true}
        isConnectableStart={true} // Position the handle on the right
        id="right" // Optional ID for specific handle identification
        className="dot"
      />
      <Handle
        type="target" // This specifies it's an outgoing edge
        position={Position.Left}
        isConnectable={true}
        isConnectableStart={true} // Position the handle on the right
        id="left" // Optional ID for specific handle identification
        className="dot"
      />
    </div>
  );
};

export default HorizontalConnects;
