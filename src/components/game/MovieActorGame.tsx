import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Film, Award, Clock, Check, X, Search, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Player = "X" | "O";
type BoardState = (string | null)[];
type GameStatus = "playing" | "won" | "draw" | null;

interface Actor {
  id: string;
  name: string;
  birthdate: string;
  imageUrl: string;
  movies: string[];
  awards: string[];
}

interface MovieActorGameProps {
  onGameEnd?: (winner: Player | "draw", pointsEarned: number) => void;
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

// Mock data for actors
const mockActors: Actor[] = [
  {
    id: "1",
    name: "Leonardo DiCaprio",
    birthdate: "November 11, 1974",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=leo",
    movies: ["Inception", "Shutter Island", "Titanic", "The Revenant"],
    awards: ["Oscar", "Golden Globe", "BAFTA"],
  },
  {
    id: "2",
    name: "Tom Hanks",
    birthdate: "July 9, 1956",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
    movies: [
      "Forrest Gump",
      "Cast Away",
      "Saving Private Ryan",
      "The Green Mile",
    ],
    awards: ["Oscar", "Golden Globe", "Emmy"],
  },
  {
    id: "3",
    name: "Meryl Streep",
    birthdate: "June 22, 1949",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=meryl",
    movies: [
      "The Devil Wears Prada",
      "Sophie's Choice",
      "The Iron Lady",
      "Mamma Mia!",
    ],
    awards: ["Oscar", "Golden Globe", "BAFTA", "Emmy"],
  },
  {
    id: "4",
    name: "Denzel Washington",
    birthdate: "December 28, 1954",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=denzel",
    movies: ["Training Day", "Malcolm X", "The Equalizer", "Flight"],
    awards: ["Oscar", "Golden Globe", "Tony"],
  },
  {
    id: "5",
    name: "Jennifer Lawrence",
    birthdate: "August 15, 1990",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
    movies: [
      "The Hunger Games",
      "Silver Linings Playbook",
      "American Hustle",
      "Winter's Bone",
    ],
    awards: ["Oscar", "Golden Globe", "BAFTA"],
  },
  {
    id: "6",
    name: "Robert Downey Jr.",
    birthdate: "April 4, 1965",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    movies: ["Iron Man", "Sherlock Holmes", "Tropic Thunder", "Chaplin"],
    awards: ["Golden Globe", "BAFTA", "Emmy"],
  },
  {
    id: "7",
    name: "Cate Blanchett",
    birthdate: "May 14, 1969",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cate",
    movies: ["Blue Jasmine", "Elizabeth", "The Aviator", "Thor: Ragnarok"],
    awards: ["Oscar", "Golden Globe", "BAFTA", "Tony"],
  },
  {
    id: "8",
    name: "Brad Pitt",
    birthdate: "December 18, 1963",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=brad",
    movies: [
      "Fight Club",
      "Once Upon a Time in Hollywood",
      "Se7en",
      "Inglourious Basterds",
    ],
    awards: ["Oscar", "Golden Globe", "BAFTA"],
  },
  {
    id: "9",
    name: "Viola Davis",
    birthdate: "August 11, 1965",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=viola",
    movies: ["Fences", "The Help", "Doubt", "Widows"],
    awards: ["Oscar", "Emmy", "Tony", "BAFTA"],
  },
  {
    id: "10",
    name: "Tom Cruise",
    birthdate: "July 3, 1962",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=cruise",
    movies: ["Top Gun", "Mission: Impossible", "Jerry Maguire", "Rain Man"],
    awards: ["Golden Globe"],
  },
  {
    id: "11",
    name: "Emma Stone",
    birthdate: "November 6, 1988",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    movies: ["La La Land", "The Favourite", "Easy A", "Birdman"],
    awards: ["Oscar", "Golden Globe", "BAFTA"],
  },
  {
    id: "12",
    name: "Morgan Freeman",
    birthdate: "June 1, 1937",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=morgan",
    movies: [
      "The Shawshank Redemption",
      "Million Dollar Baby",
      "Se7en",
      "Bruce Almighty",
    ],
    awards: ["Oscar", "Golden Globe", "SAG"],
  },
];

// Mock data for movies and awards (row and column headers)
const rowHeaders = [
  { type: "movie", name: "Inception" },
  { type: "movie", name: "Forrest Gump" },
  { type: "award", name: "Oscar" },
];

const columnHeaders = [
  { type: "movie", name: "Shutter Island" },
  { type: "award", name: "Golden Globe" },
  { type: "movie", name: "Titanic" },
];

const MovieActorGame = ({
  onGameEnd = () => {},
  onRestart = () => {},
  currentPlayer = "X",
  isPlayerTurn = true,
  movieTheme = "scifi",
  botMode = { enabled: false, difficulty: "medium" },
}: MovieActorGameProps) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>(currentPlayer);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    null,
  );
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<number | null>(null);

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
          onGameEnd("draw", calculatePoints(false));
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
    }, 1500);

    return () => clearTimeout(botDelay);
  }, [player, gameStatus, botMode.enabled]);

  const makeBotMove = () => {
    if (gameStatus !== "playing") return;

    // Find an empty cell
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length === 0) return;

    // Pick a random empty cell
    const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Get row and column for the cell
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;

    // Find a valid actor for this cell
    const rowHeader = rowHeaders[row];
    const colHeader = columnHeaders[col];

    // Find actors that match both headers
    const validActors = mockActors.filter((actor) => {
      if (rowHeader.type === "movie" && colHeader.type === "movie") {
        return (
          actor.movies.includes(rowHeader.name) &&
          actor.movies.includes(colHeader.name)
        );
      } else if (rowHeader.type === "movie" && colHeader.type === "award") {
        return (
          actor.movies.includes(rowHeader.name) &&
          actor.awards.includes(colHeader.name)
        );
      } else if (rowHeader.type === "award" && colHeader.type === "movie") {
        return (
          actor.awards.includes(rowHeader.name) &&
          actor.movies.includes(colHeader.name)
        );
      } else {
        return (
          actor.awards.includes(rowHeader.name) &&
          actor.awards.includes(colHeader.name)
        );
      }
    });

    if (validActors.length > 0) {
      // Pick a random valid actor
      const actor = validActors[Math.floor(Math.random() * validActors.length)];

      // Update the board
      const newBoard = [...board];
      newBoard[cellIndex] = actor.name;
      setBoard(newBoard);

      // Check for winner
      const [status, winningPattern] = checkWinner(newBoard);
      setGameStatus(status);
      setWinningCombination(winningPattern);

      if (status === "playing") {
        setPlayer(player === "X" ? "O" : "X");
      } else if (status === "won") {
        onGameEnd(player, calculatePoints(true));
      } else if (status === "draw") {
        onGameEnd("draw", calculatePoints(false));
      }
    } else {
      // If no valid actor found, try another cell
      makeBotMove();
    }
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

    setSelectedCell(index);
    setOpenPopover(true);
    setSearchTerm("");
  };

  const handleActorSelect = (actor: Actor) => {
    if (selectedCell === null) return;

    // Check if the actor is valid for this cell
    const row = Math.floor(selectedCell / 3);
    const col = selectedCell % 3;
    const rowHeader = rowHeaders[row];
    const colHeader = columnHeaders[col];

    let isValid = false;

    if (rowHeader.type === "movie" && colHeader.type === "movie") {
      isValid =
        actor.movies.includes(rowHeader.name) &&
        actor.movies.includes(colHeader.name);
    } else if (rowHeader.type === "movie" && colHeader.type === "award") {
      isValid =
        actor.movies.includes(rowHeader.name) &&
        actor.awards.includes(colHeader.name);
    } else if (rowHeader.type === "award" && colHeader.type === "movie") {
      isValid =
        actor.awards.includes(rowHeader.name) &&
        actor.movies.includes(colHeader.name);
    } else {
      isValid =
        actor.awards.includes(rowHeader.name) &&
        actor.awards.includes(colHeader.name);
    }

    if (isValid) {
      // Update the board
      const newBoard = [...board];
      newBoard[selectedCell] = actor.name;
      setBoard(newBoard);

      // Update score
      setScore((prev) => prev + 50);
      setStreak((prev) => prev + 1);
      setLastCorrect(selectedCell);

      // Check for winner
      const [status, winningPattern] = checkWinner(newBoard);
      setGameStatus(status);
      setWinningCombination(winningPattern);

      if (status === "playing") {
        setPlayer(player === "X" ? "O" : "X");
      } else if (status === "won") {
        onGameEnd(player, calculatePoints(true));
      } else if (status === "draw") {
        onGameEnd("draw", calculatePoints(false));
      }
    } else {
      // Incorrect selection
      setStreak(0);
    }

    setOpenPopover(false);
    setSelectedCell(null);
  };

  const calculatePoints = (isWinner: boolean): number => {
    const basePoints = score;
    const timeBonus = Math.floor(timeLeft / 10);
    const streakBonus = streak * 10;
    const winnerBonus = isWinner ? 100 : 0;

    return basePoints + timeBonus + streakBonus + winnerBonus;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer(currentPlayer);
    setGameStatus(null);
    setWinningCombination(null);
    setTimeLeft(180); // Reset timer to 3 minutes
    setScore(0);
    setStreak(0);
    setLastCorrect(null);
    onRestart();
  };

  const filteredActors = mockActors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderCell = (index: number) => {
    const isWinningCell = winningCombination?.includes(index);
    const cellContent = board[index];
    const isLastCorrect = lastCorrect === index;
    const row = Math.floor(index / 3);
    const col = index % 3;

    return (
      <motion.div
        key={index}
        className={`
          ${theme.cellBg} ${theme.cellBorder} border-2 rounded-md
          flex items-center justify-center cursor-pointer
          transition-all duration-200 h-full w-full
          ${isWinningCell ? "ring-4 ring-yellow-400 scale-105" : ""}
          ${isLastCorrect ? "ring-2 ring-green-400" : ""}
        `}
        whileHover={{ scale: board[index] ? 1 : 1.05 }}
        whileTap={{ scale: board[index] ? 1 : 0.95 }}
        onClick={() => handleCellClick(index)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {cellContent ? (
          <div className="text-center p-1">
            <p
              className={`text-sm font-medium ${player === "X" ? theme.xColor : theme.oColor}`}
            >
              {cellContent}
            </p>
          </div>
        ) : (
          <div className="text-xs text-center opacity-50 p-1">
            <p>{rowHeaders[row].name}</p>
            <p>+</p>
            <p>{columnHeaders[col].name}</p>
          </div>
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
          <span>Movie Actor Match</span>
        </div>
        <div className="bg-white/20 text-white font-bold py-1 px-3 rounded-md text-xl">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/10 text-white">
              Score: {score}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white">
              Streak: {streak}x
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetGame}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="col-span-1"></div>
        {columnHeaders.map((header, i) => (
          <div
            key={i}
            className="col-span-1 p-2 text-center rounded bg-white/10 text-white text-sm font-medium flex flex-col items-center justify-center"
          >
            {header.type === "movie" ? (
              <Film className="h-4 w-4 mb-1" />
            ) : (
              <Award className="h-4 w-4 mb-1" />
            )}
            {header.name}
          </div>
        ))}
      </div>

      <div className={`${theme.boardBg} p-3 rounded-lg shadow-inner`}>
        <div className="grid grid-cols-4 gap-2">
          {rowHeaders.map((header, i) => (
            <div
              key={i}
              className="col-span-1 p-2 text-center rounded bg-white/10 text-white text-sm font-medium flex flex-col items-center justify-center"
            >
              {header.type === "movie" ? (
                <Film className="h-4 w-4 mb-1" />
              ) : (
                <Award className="h-4 w-4 mb-1" />
              )}
              {header.name}
            </div>
          ))}

          {Array(9)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="col-span-1">
                {renderCell(index)}
              </div>
            ))}
        </div>
      </div>

      {gameStatus === "won" || gameStatus === "draw" ? (
        <motion.div
          className={`${theme.winnerBg} mt-6 p-4 rounded-lg text-white text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-lg font-bold mb-2">
            {gameStatus === "won" ? (
              <span className="flex items-center justify-center gap-2">
                <Trophy className="text-yellow-400" /> Player {player} Wins!
              </span>
            ) : (
              "Time's up! It's a Draw!"
            )}
          </p>
          <p className="mb-4">
            Total Points: {calculatePoints(gameStatus === "won")}
          </p>
          <Button onClick={resetGame} className="bg-white/20 hover:bg-white/30">
            Play Again
          </Button>
        </motion.div>
      ) : null}

      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <div className="hidden">Open</div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="center">
          <Command>
            <CommandInput
              placeholder="Search for an actor..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No actors found.</CommandEmpty>
              <CommandGroup heading="Actors">
                {filteredActors.map((actor) => (
                  <CommandItem
                    key={actor.id}
                    onSelect={() => handleActorSelect(actor)}
                    className="flex items-center gap-2 py-2"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                      <img
                        src={actor.imageUrl}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{actor.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {actor.birthdate}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MovieActorGame;
