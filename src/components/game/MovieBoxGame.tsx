import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Circle, Film, Trophy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameStatus = "playing" | "won" | "draw" | null;

interface MovieBoxGameProps {
  onGameEnd?: (winner: Player | "draw") => void;
  onRestart?: () => void;
  currentPlayer?: Player;
  isPlayerTurn?: boolean;
  movieTheme?: "scifi" | "western" | "fantasy" | "horror";
  botMode?: {
    enabled: boolean;
    difficulty: "easy" | "medium" | "hard";
  };
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
  horror: {
    background: "bg-gradient-to-r from-gray-900 to-red-900",
    boardBg: "bg-gray-950/50",
    cellBg: "bg-gray-900/30",
    cellBorder: "border-red-500/50",
    xColor: "text-red-500",
    oColor: "text-gray-400",
    winnerBg: "bg-gradient-to-r from-red-800 to-gray-800",
  },
};

const MovieBoxGame = ({
  onGameEnd = () => {},
  onRestart = () => {},
  currentPlayer = "X",
  isPlayerTurn = true,
  movieTheme = "scifi",
  botMode = { enabled: false, difficulty: "medium" },
}: MovieBoxGameProps) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>(currentPlayer);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    null,
  );
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  const theme = themes[movieTheme as keyof typeof themes] || themes.scifi;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "draw") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus("draw");
          onGameEnd("draw");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, onGameEnd]);

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

  // Bot move logic
  useEffect(() => {
    if (!botMode.enabled || player === "X" || gameStatus !== "playing") return;

    // Add a small delay to make it feel more natural
    const botDelay = setTimeout(() => {
      makeBotMove();
    }, 800);

    return () => clearTimeout(botDelay);
  }, [player, gameStatus, botMode.enabled]);

  const makeBotMove = () => {
    if (gameStatus !== "playing") return;

    let moveIndex: number;

    switch (botMode.difficulty) {
      case "easy":
        moveIndex = makeRandomMove();
        break;
      case "medium":
        // 70% chance of making a smart move, 30% random
        moveIndex = Math.random() < 0.7 ? makeSmartMove() : makeRandomMove();
        break;
      case "hard":
        moveIndex = makeSmartMove();
        break;
      default:
        moveIndex = makeRandomMove();
    }

    if (moveIndex !== -1) {
      const newBoard = [...board];
      newBoard[moveIndex] = player;
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
    }
  };

  const makeRandomMove = (): number => {
    // Find all empty cells
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length === 0) return -1;

    // Pick a random empty cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const makeSmartMove = (): number => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length === 0) return -1;

    // Check if bot can win in the next move
    for (const index of emptyCells) {
      const newBoard = [...board];
      newBoard[index] = player; // O
      const [status] = checkWinner(newBoard);
      if (status === "won") return index;
    }

    // Check if player can win in the next move and block
    for (const index of emptyCells) {
      const newBoard = [...board];
      newBoard[index] = "X"; // Player is X
      const [status] = checkWinner(newBoard);
      if (status === "won") return index;
    }

    // Take center if available
    if (board[4] === null) return 4;

    // Take corners if available
    const corners = [0, 2, 6, 8].filter((index) => board[index] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available edge
    const edges = [1, 3, 5, 7].filter((index) => board[index] === null);
    if (edges.length > 0) {
      return edges[Math.floor(Math.random() * edges.length)];
    }

    // Fallback to random move
    return makeRandomMove();
  };

  const handleCellClick = (index: number) => {
    if (
      board[index] ||
      gameStatus === "won" ||
      gameStatus === "draw" ||
      !isPlayerTurn ||
      (botMode.enabled && player !== "X") // Prevent clicking when it's bot's turn
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
    setTimeLeft(180); // Reset timer to 3 minutes
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
        <div className="text-white text-xl font-bold flex items-center gap-2">
          <Film className="h-5 w-5" />
          <span>Movie Tic-Tac-Toe</span>
        </div>
        <div className="bg-white/20 text-white font-bold py-1 px-3 rounded-md text-xl">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-white text-lg">
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

export default MovieBoxGame;
