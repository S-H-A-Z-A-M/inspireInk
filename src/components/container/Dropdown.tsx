import React, { useState } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option click
  const handleOptionClick = (option) => {
    console.log("Selected option:", option);
    setIsOpen(false); // Close dropdown
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Dropdown button */}
      <button
        onClick={toggleDropdown}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        Select an option
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            listStyleType: "none",
            padding: "0",
            margin: "0",
            width: "150px",
            zIndex: 1,
          }}
        >
          {["Option 1", "Option 2", "Option 3"].map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
