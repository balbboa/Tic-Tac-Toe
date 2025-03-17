import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Circle, Trophy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameStatus = "playing" | "won" | "draw" | null;

interface TicTacToeBoardProps {
  onGameEnd?: (winner: Player | "draw") => void;
  onRestart?: () => void;
  currentPlayer?: Player;
  isPlayerTurn?: boolean;
  movieTheme?: string;
}

const themes = {
  scifi: {
    background: "bg-gradient-to-r from-blue-900 to-purple-900",
    boardBg: "bg-black/50",
    cellBg: "bg-blue-950/30",
    cellBorder: "border-blue-500/50",
    xColor: "text-cyan-400",
    oColor: "text-purple-400",
    winnerBg: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  western: {
    background: "bg-gradient-to-r from-amber-800 to-yellow-700",
    boardBg: "bg-amber-950/50",
    cellBg: "bg-amber-900/30",
    cellBorder: "border-amber-600/50",
    xColor: "text-red-600",
    oColor: "text-amber-400",
    winnerBg: "bg-gradient-to-r from-amber-700 to-red-700",
  },
  fantasy: {
    background: "bg-gradient-to-r from-emerald-900 to-teal-800",
    boardBg: "bg-emerald-950/50",
    cellBg: "bg-emerald-900/30",
    cellBorder: "border-emerald-500/50",
    xColor: "text-amber-400",
    oColor: "text-teal-400",
    winnerBg: "bg-gradient-to-r from-emerald-700 to-teal-600",
  },
};

const TicTacToeBoard = ({
  onGameEnd = () => {},
  onRestart = () => {},
  currentPlayer = "X",
  isPlayerTurn = true,
  movieTheme = "scifi",
}: TicTacToeBoardProps) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>(currentPlayer);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    null,
  );

  const theme = themes[movieTheme as keyof typeof themes] || themes.scifi;

  const checkWinner = (
    boardState: BoardState,
  ): [GameStatus, number[] | null] => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return ["won", pattern];
      }
    }

    // Check for draw
    if (boardState.every((cell) => cell !== null)) {
      return ["draw", null];
    }

    return ["playing", null];
  };

  const handleCellClick = (index: number) => {
    if (
      board[index] ||
      gameStatus === "won" ||
      gameStatus === "draw" ||
      !isPlayerTurn
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const [status, winningPattern] = checkWinner(newBoard);
    setGameStatus(status);
    setWinningCombination(winningPattern);

    if (status === "playing") {
      setPlayer(player === "X" ? "O" : "X");
    } else if (status === "won") {
      onGameEnd(player);
    } else if (status === "draw") {
      onGameEnd("draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer(currentPlayer);
    setGameStatus(null);
    setWinningCombination(null);
    onRestart();
  };

  const renderCell = (index: number) => {
    const isWinningCell = winningCombination?.includes(index);
    const cellContent = board[index];

    return (
      <motion.div
        key={index}
        className={`
          ${theme.cellBg} ${theme.cellBorder} border-2 rounded-md
          flex items-center justify-center cursor-pointer
          transition-all duration-200 h-full w-full
          ${isWinningCell ? "ring-4 ring-yellow-400 scale-105" : ""}
        `}
        whileHover={{ scale: board[index] ? 1 : 1.05 }}
        whileTap={{ scale: board[index] ? 1 : 0.95 }}
        onClick={() => handleCellClick(index)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {cellContent === "X" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${theme.xColor} w-2/3 h-2/3`}
          >
            <X className="w-full h-full" />
          </motion.div>
        )}
        {cellContent === "O" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`${theme.oColor} w-2/3 h-2/3`}
          >
            <Circle className="w-full h-full" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      className={`${theme.background} p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-white text-xl font-bold">
          {gameStatus === "won" ? (
            <span className="flex items-center gap-2">
              <Trophy className="text-yellow-400" /> Player {player} Wins!
            </span>
          ) : gameStatus === "draw" ? (
            "It's a Draw!"
          ) : (
            `Player ${player}'s Turn`
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={resetGame}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className={`${theme.boardBg} p-3 rounded-lg shadow-inner`}>
        <div className="grid grid-cols-3 gap-3 aspect-square">
          {Array(9)
            .fill(null)
            .map((_, index) => renderCell(index))}
        </div>
      </div>

      {gameStatus === "won" || gameStatus === "draw" ? (
        <motion.div
          className={`${theme.winnerBg} mt-6 p-4 rounded-lg text-white text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg font-bold mb-2">
            {gameStatus === "won" ? `Player ${player} Wins!` : "It's a Draw!"}
          </p>
          <Button
            onClick={resetGame}
            className="mt-2 bg-white/20 hover:bg-white/30"
          >
            Play Again
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
};

export default TicTacToeBoard;
