import React, { useState, useContext, useEffect } from "react";
import "./cell.css";

const Cell = ({ cell, onClick }) => {
  let content;

  if (cell.wasClicked) {
    if (cell.isBomb) {
      content = "💣";
    } else {
      content = cell.adjacentBombCount > 0 ? cell.adjacentBombCount : "";
    }
  }

  return (
    <div
      className={`cell ${cell.wasClicked ? "clicked" : ""}`}
      onClick={onClick}
    >
      {content}
    </div>
  );
};

export default Cell;
