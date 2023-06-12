import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GamePage, LoginPage } from "./pages/index.js";
import "./App.css";

export const RecentGamesContext = React.createContext();

function App() {
  const [recentGames, setRecentGames] = useState(() => {
    const recentGames = localStorage.getItem("minesweeper-recent-games");
    return recentGames ? JSON.parse(recentGames) : [];
  });

  const addGame = (game) => {
    setRecentGames((prevGames) => [game, ...prevGames]);
  };

  return (
    <Router>
      <RecentGamesContext.Provider value={{ recentGames, addGame }}>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </RecentGamesContext.Provider>
    </Router>
  );
}

export default App;
