import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox } from "@/components/ui/checkbox";

const VerticalConnects = ({ id, data }) => {
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
        {data.label === "verticalConnects node"
          ? "Vertical Connects"
          : data.label}
      </p>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        isConnectableEnd={true}
        className="dot"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectableStart={true}
        isConnectable={true}
        className="dot"
      />
    </div>
  );
};

export default VerticalConnects;
