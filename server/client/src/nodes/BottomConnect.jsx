import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

const BottomConnect = ({ id, data }) => {
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
        {data.label === "bottomConnect node" ? "Bottom Connect" : data.label}
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={true}
        isConnectableStart={true}
        className="dot"
      />
    </div>
  );
};

export default BottomConnect;
