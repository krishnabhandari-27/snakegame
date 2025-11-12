import React, { useState, useEffect } from "react";
import "./App.css";

const BOARD_SIZE = 15;
const SPEED = 150; // lower = faster

export default function App() {
  const [snake, setSnake] = useState([[2, 2]]);
  const [food, setFood] = useState(randomFood());
  const [dir, setDir] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [moving, setMoving] = useState(true);

  function randomFood() {
    return [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE),
    ];
  }

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (!moving) return;
      switch (e.key) {
        case "ArrowUp":
          if (dir !== "DOWN") setDir("UP");
          break;
        case "ArrowDown":
          if (dir !== "UP") setDir("DOWN");
          break;
        case "ArrowLeft":
          if (dir !== "RIGHT") setDir("LEFT");
          break;
        case "ArrowRight":
          if (dir !== "LEFT") setDir("RIGHT");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir, moving]);

  // Movement loop
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => moveSnake(), SPEED);
    return () => clearInterval(timer);
  }, [snake, dir, gameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[newSnake.length - 1]];

    if (dir === "UP") head[1] -= 1;
    if (dir === "DOWN") head[1] += 1;
    if (dir === "LEFT") head[0] -= 1;
    if (dir === "RIGHT") head[0] += 1;

    // wall collision
    if (
      head[0] < 0 ||
      head[0] >= BOARD_SIZE ||
      head[1] < 0 ||
      head[1] >= BOARD_SIZE
    ) {
      setGameOver(true);
      setMoving(false);
      return;
    }

    // self collision
    for (let part of newSnake) {
      if (part[0] === head[0] && part[1] === head[1]) {
        setGameOver(true);
        setMoving(false);
        return;
      }
    }

    newSnake.push(head);

    // food eaten
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(randomFood());
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  const restart = () => {
    setMoving(false);
    setTimeout(() => {
      setSnake([[2, 2]]);
      setDir("RIGHT");
      setFood(randomFood());
      setGameOver(false);
      setMoving(true);
    }, 500); // smooth restart delay
  };

  const renderBoard = () => {
    const cells = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        let className = "cell";
        for (let part of snake) {
          if (part[0] === x && part[1] === y) className = "cell snake";
        }
        if (food[0] === x && food[1] === y) className = "cell food";
        cells.push(<div key={`${x}-${y}`} className={className}></div>);
      }
    }
    return cells;
  };

  return (
    <div className="game">
      <h1>🐍 Snake Game</h1>
      <div
        className={`board ${gameOver ? "shake" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {renderBoard()}
      </div>
      <p>Score: {snake.length - 1}</p>
      {gameOver && (
        <>
          <h2>💀 Game Over!</h2>
          <button onClick={restart}>Restart</button>
        </>
      )}
    </div>
  );
}
