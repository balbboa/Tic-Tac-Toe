import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Shield, Trophy, Users, Timer, X } from "lucide-react";
import MovieBoxGame from "./MovieBoxGame";
import GameResult from "./GameResult";
import { useAuth } from "../../context/AuthContext";

type GameStage = "matchmaking" | "playing" | "result";
type Player = "X" | "O";

interface RankedGameModeProps {
  onReturnToMenu?: () => void;
}

const RankedGameMode = ({ onReturnToMenu = () => {} }: RankedGameModeProps) => {
  const { user } = useAuth();
  const [gameStage, setGameStage] = useState<GameStage>("matchmaking");
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<{
    name: string;
    rank: string;
    level: number;
    avatarUrl?: string;
  } | null>(null);
  const [gameResult, setGameResult] = useState<{
    winner?: string;
    isWinner?: boolean;
    isDraw?: boolean;
    pointsEarned?: number;
    rankChange?: number;
  }>({});
  const [theme, setTheme] = useState<
    "scifi" | "western" | "fantasy" | "horror"
  >("scifi");

  // Randomly select a theme when starting matchmaking
  useEffect(() => {
    const themes = ["scifi", "western", "fantasy", "horror"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)] as
      | "scifi"
      | "western"
      | "fantasy"
      | "horror";
    setTheme(randomTheme);
  }, []);

  // Simulate matchmaking
  useEffect(() => {
    if (gameStage !== "matchmaking") return;

    const interval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    // Find opponent after random time (3-8 seconds)
    const matchTime = Math.floor(Math.random() * 5000) + 3000;
    const timeout = setTimeout(() => {
      // Generate random opponent
      const names = [
        "MovieMaster",
        "CinemaWizard",
        "FilmBuff",
        "ReelDeal",
        "SceneQueen",
      ];
      const ranks = ["Novice", "Amateur", "Expert", "Master", "Legend"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const randomLevel = Math.floor(Math.random() * 10) + 1;

      setOpponent({
        name: randomName,
        rank: randomRank,
        level: randomLevel,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName}`,
      });

      // Start game after finding opponent
      setTimeout(() => {
        setGameStage("playing");
      }, 1500);
    }, matchTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [gameStage]);

  const handleCancelMatchmaking = () => {
    onReturnToMenu();
  };

  const handleGameEnd = (winner: Player | "draw") => {
    const isWinner = winner === "X"; // Player is always X
    const isDraw = winner === "draw";

    // Calculate points and rank change
    const basePoints = isDraw ? 50 : isWinner ? 100 : 25;
    const rankChange = isDraw
      ? 0
      : isWinner
        ? Math.floor(Math.random() * 15) + 5
        : -(Math.floor(Math.random() * 10) + 5);

    setGameResult({
      winner: isDraw ? undefined : isWinner ? user?.name : opponent?.name,
      isWinner,
      isDraw,
      pointsEarned: basePoints,
      rankChange,
    });

    setGameStage("result");
  };

  const handlePlayAgain = () => {
    // Go back to matchmaking for a new game
    setSearchTime(0);
    setOpponent(null);
    setGameStage("matchmaking");
  };

  const formatSearchTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderGameStage = () => {
    switch (gameStage) {
      case "matchmaking":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Ranked Matchmaking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!opponent ? (
                <div className="text-center space-y-6">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Searching for opponent...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Looking for a player with similar skill level
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Search time</span>
                      <span>{formatSearchTime(searchTime)}</span>
                    </div>
                    <Progress
                      value={(searchTime % 30) * (100 / 30)}
                      className="h-2"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleCancelMatchmaking}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-lg font-medium text-green-600">
                    Opponent Found!
                  </p>

                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2 overflow-hidden">
                        <img
                          src={user?.avatarUrl}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium">{user?.name}</p>
                      <Badge variant="outline" className="mt-1">
                        Level {Math.floor(Math.random() * 10) + 1}
                      </Badge>
                    </div>

                    <div className="text-2xl font-bold">VS</div>

                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2 overflow-hidden">
                        <img
                          src={opponent.avatarUrl}
                          alt={opponent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium">{opponent.name}</p>
                      <Badge variant="outline" className="mt-1">
                        Level {opponent.level}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Game starting in a moment...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "playing":
        return (
          <div className="max-w-md mx-auto">
            <div className="mb-4 flex justify-between items-center">
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                <Shield className="h-3 w-3" />
                <span>Ranked Match</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                <Timer className="h-3 w-3" />
                <span>3:00</span>
              </Badge>
            </div>
            <MovieBoxGame
              onGameEnd={handleGameEnd}
              movieTheme={theme}
              botMode={{
                enabled: true, // Using bot for simulation
                difficulty: "medium",
              }}
            />
          </div>
        );
      case "result":
        return (
          <GameResult
            winner={gameResult.winner}
            playerName={user?.name || "You"}
            opponentName={opponent?.name || "Opponent"}
            pointsEarned={gameResult.pointsEarned}
            isWinner={gameResult.isWinner}
            isDraw={gameResult.isDraw}
            onPlayAgain={handlePlayAgain}
            onReturnToMenu={onReturnToMenu}
            rankChange={gameResult.rankChange}
          />
        );
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      {renderGameStage()}
    </div>
  );
};

export default RankedGameMode;
