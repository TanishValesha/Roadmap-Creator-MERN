// CustomNode.js
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox } from "@/components/ui/checkbox";

const CustomNode = ({ data }) => {
  return (
    <div className="bg-white">
      <Checkbox id="terms" />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default CustomNode;
