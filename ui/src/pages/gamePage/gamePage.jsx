import React, { useState, useContext, useEffect } from "react";
import { GameBoard, RecentGames } from "../../components/index.js";
import "./gamePage.css";

const GamePage = () => {
  const [size, setSize] = useState(() => {
    const savedGameSize = localStorage.getItem("minesweeper-game-size");
    return savedGameSize ? JSON.parse(savedGameSize) : 10;
  });

  const initialCell = {
    wasClicked: false,
    isBomb: false,
    adjacentBombCount: 0,
  };

  const generateBoard = (size) => {
    return Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({ ...initialCell }))
      );
  };

  const changeSize = (e) => {
    setSize(Number(e.target.value));
  };

  return (
    <>
      <div className="title-container">
        <h3 className="game-title-extra">Don't</h3>
        <h1 className="game-title">Find the Mine!</h1>
        <h4 className="game-title-author">By: Alexander True</h4>
      </div>
      <div className="gameOptions-container">
        <select className="diff-select" onChange={changeSize}>
          <option className="diff-option" value="10">
            Easy
          </option>
          <option className="diff-option" value="14">
            Normal
          </option>
          <option className="diff-option" value="18">
            Hard
          </option>
          <option className="diff-option" value="22">
            Extreme
          </option>
          <option className="diff-option" value="2">
            Coin Toss
          </option>
        </select>
      </div>
      <GameBoard size={size} generateBoard={generateBoard} />

      <RecentGames />
    </>
  );
};

export default GamePage;
