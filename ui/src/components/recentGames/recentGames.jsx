import React, { useState, useEffect, useContext } from "react";
import { RecentGamesContext } from "../../App";
import "./recentGames.css";

const RecentGames = () => {
  const { recentGames } = useContext(RecentGamesContext);

  useEffect(() => {
    localStorage.setItem(
      "minesweeper-recent-games",
      JSON.stringify(recentGames)
    );
  }, [recentGames]);

  return (
    <div className="recent-games-container">
      <h2 className="recent-games-header">Recently Played Games:</h2>
      <ul className="recent-games-ul">
        {recentGames.map((game, i) => (
          <li className="recent-games-item" key={i}>
            {`Difficulty: ${game.difficulty}, Time: ${game.time}, Won: ${game.won}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentGames;
