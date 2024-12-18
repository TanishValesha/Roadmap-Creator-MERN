import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox } from "@/components/ui/checkbox";

const TopConnect = ({ id, data }) => {
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
        {data.label === "topConnect node" ? "Top Connect" : data.label}
      </p>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        isConnectableEnd={true}
        className="dot"
      />
    </div>
  );
};

export default TopConnect;