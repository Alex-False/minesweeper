import React, { useState, useContext, useEffect } from "react";
import useInterval from "./useInterval.jsx";
import { Cell, RecentGames } from "../index.js";
import "./gameBoard.css";

import { RecentGamesContext } from "../../App";

const GameBoard = ({ size, generateBoard }) => {
  const [board, setBoard] = useState(() => {
    const savedGame = localStorage.getItem("minesweeper-game");
    return savedGame ? JSON.parse(savedGame) : generateBoard(size);
  });

  const [didWin, setDidWin] = useState(() => {
    const savedGameStatus = localStorage.getItem("minesweeper-game-status");
    return savedGameStatus ? JSON.parse(savedGameStatus) : null;
  });
  const [timeStamp, setTimeStamp] = useState(() => {
    const savedGameTimeStamp = localStorage.getItem(
      "minesweeper-game-timeStamp"
    );
    return savedGameTimeStamp ? JSON.parse(savedGameTimeStamp) : null;
  });

  const [timer, setTimer] = useState(() => {
    const savedGameTimer = localStorage.getItem("minesweeper-game-timer");
    return savedGameTimer ? JSON.parse(savedGameTimer) : 0;
  });

  const [started, setStarted] = useState(() => {
    const savedGameStarted = localStorage.getItem("minesweeper-game-started");
    return savedGameStarted ? JSON.parse(savedGameStarted) : false;
  });

  const { addGame } = useContext(RecentGamesContext);

  const handleCellClick = (i, j) => {
    setBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      if (!started) {
        setStarted(true);
        setTimeStamp(Date.now);
      }

      if (newBoard[i][j].isBomb) {
        handleLoss(newBoard);
      } else {
        handleClickHelper(newBoard, i, j);
        if (checkWin(newBoard)) {
          handleWin();
        }
      }
      return newBoard;
    });
  };

  const handleClickHelper = (board, i, j) => {
    if (board[i][j].wasClicked || board[i][j].isBomb) return;

    board[i][j].wasClicked = true;

    if (board[i][j].adjacentBombCount === 0) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          let ni = i + x;
          let nj = j + y;

          if (ni >= 0 && ni < board.length && nj >= 0 && nj < board.length) {
            handleClickHelper(board, ni, nj);
          }
        }
      }
    }
  };

  function handleLoss(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].isBomb) {
          board[i][j].wasClicked = true;
        }
      }
    }
    setDidWin("No");
    addGame({
      difficulty: size,
      time: timer,
      won: false,
    });
  }

  const handleWin = () => {
    setDidWin("Yes");
    addGame({
      difficulty: size,
      time: timer,
      won: true,
    });
  };

  const checkWin = (board) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j].isBomb && !board[i][j].wasClicked) {
          return false;
        }
      }
    }
    return true;
  };

  const populateBombs = (board, bombCount) => {
    let size = board.length;
    if (bombCount > 10) {
      bombCount = bombCount * 2;
    }
    while (bombCount > 0) {
      let i = Math.floor(Math.random() * size);
      let j = Math.floor(Math.random() * size);

      if (!board[i][j].isBomb) {
        board[i][j].isBomb = true;
        bombCount--;
      }
    }
  };

  const calculateAdjacentCounts = (board) => {
    let size = board.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!board[i][j].isBomb) {
          board[i][j].adjacentBombCount = getAdjacentBombCount(board, i, j);
        }
      }
    }
  };

  const getAdjacentBombCount = (board, i, j) => {
    let size = board.length;
    let count = 0;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        let ni = i + x;
        let nj = j + y;

        if (
          ni >= 0 &&
          ni < size &&
          nj >= 0 &&
          nj < size &&
          board[ni][nj].isBomb
        ) {
          count++;
        }
      }
    }

    return count;
  };

  const resetGame = () => {
    setDidWin(null);
    setTimeStamp(null);
    setStarted(false);
    setTimer(0);
    let newBoard = generateBoard(size);
    populateBombs(newBoard, size);
    calculateAdjacentCounts(newBoard);
    setBoard(newBoard);
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    localStorage.setItem("minesweeper-game", JSON.stringify(board));
    localStorage.setItem("minesweeper-game-status", JSON.stringify(didWin));
    localStorage.setItem(
      "minesweeper-game-timeStamp",
      JSON.stringify(timeStamp)
    );
    localStorage.setItem("minesweeper-game-timer", JSON.stringify(timer));
    localStorage.setItem("minesweeper-game-size", JSON.stringify(size));
  }, [board, didWin, timeStamp, timer, size]);

  useInterval(() => {
    if (started && didWin !== "Yes" && didWin !== "No") {
      setTimer(Math.floor((Date.now() - timeStamp) / 1000));
    }
  }, 1000);

  return (
    <div className="board-container">
      <div className="timer-container">
        <p className="timer">{timer}</p>
      </div>
      <div className="board">
        {didWin === "Yes" ? (
          <div className="win-modal">
            <h1>You Won! :O</h1>
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : null}
        {didWin === "No" ? (
          <div className="lose-modal">
            <h1>You lost! :c</h1>
            <button onClick={resetGame}>Play Again</button>
          </div>
        ) : null}
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <Cell key={j} cell={cell} onClick={() => handleCellClick(i, j)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
