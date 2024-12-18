import React, { useState } from "react";
import * as FaIcons from "react-icons/fa"; // FontAwesome
import * as MdIcons from "react-icons/md"; // Material Design
import * as AiIcons from "react-icons/ai"; // Import all icons
import * as GiIcons from "react-icons/gi"; // Import all icons
import { IconContext } from "react-icons";

const IconPicker = () => {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Get all icon names
  const Icons = { ...FaIcons, ...MdIcons, ...AiIcons, ...GiIcons };
  const iconNames = Object.keys(Icons);

  // Filter icons based on search query
  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Icon Picker</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "100%" }}
      />

      {/* Icon Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
          gap: "10px",
        }}
      >
        {filteredIcons.map((iconName) => {
          const IconComponent = Icons[iconName];
          return (
            <div
              key={iconName}
              onClick={() => setSelectedIcon(iconName)}
              style={{
                padding: "10px",
                textAlign: "center",
                border:
                  selectedIcon === iconName
                    ? "2px solid blue"
                    : "1px solid gray",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <IconContext.Provider value={{ size: "24px" }}>
                <IconComponent />
              </IconContext.Provider>
              <p style={{ fontSize: "12px", marginTop: "5px" }}>{iconName}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Icon */}
      {selectedIcon && (
        <div style={{ marginTop: "20px" }}>
          <h2>Selected Icon:</h2>
          <IconContext.Provider value={{ size: "48px", color: "blue" }}>
            {React.createElement(Icons[selectedIcon])}
          </IconContext.Provider>
          <p>{selectedIcon}</p>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
