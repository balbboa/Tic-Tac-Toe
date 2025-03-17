import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bot, Brain, Zap } from "lucide-react";
import MovieBoxGame from "./MovieBoxGame";
import GameResult from "./GameResult";

type GameStage = "setup" | "playing" | "result";
type BotDifficulty = "easy" | "medium" | "hard";
type Player = "X" | "O";

interface BotGameModeProps {
  onReturnToMenu?: () => void;
}

const BotGameMode = ({ onReturnToMenu = () => {} }: BotGameModeProps) => {
  const [gameStage, setGameStage] = useState<GameStage>("setup");
  const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");
  const [theme, setTheme] = useState<
    "scifi" | "western" | "fantasy" | "horror"
  >("scifi");
  const [gameResult, setGameResult] = useState<{
    winner?: string;
    isWinner?: boolean;
    isDraw?: boolean;
    pointsEarned?: number;
  }>({});

  const handleStartGame = () => {
    setGameStage("playing");
  };

  const handleGameEnd = (winner: Player | "draw") => {
    const isWinner = winner === "X"; // Player is always X
    const isDraw = winner === "draw";

    // Points based on difficulty
    const basePoints = isDraw ? 25 : isWinner ? 50 : 10;
    const difficultyMultiplier =
      difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2; // hard

    const pointsEarned = Math.round(basePoints * difficultyMultiplier);

    setGameResult({
      winner: isDraw ? undefined : isWinner ? "You" : "Bot",
      isWinner,
      isDraw,
      pointsEarned,
    });

    setGameStage("result");
  };

  const handlePlayAgain = () => {
    setGameStage("playing");
  };

  const renderGameStage = () => {
    switch (gameStage) {
      case "setup":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Practice Against Bot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Difficulty</h3>
                <Tabs
                  defaultValue={difficulty}
                  onValueChange={(value) =>
                    setDifficulty(value as BotDifficulty)
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="easy"
                      className="flex items-center gap-1"
                    >
                      <Brain className="h-3 w-3" /> Easy
                    </TabsTrigger>
                    <TabsTrigger
                      value="medium"
                      className="flex items-center gap-1"
                    >
                      <Brain className="h-3 w-3" /> Medium
                    </TabsTrigger>
                    <TabsTrigger
                      value="hard"
                      className="flex items-center gap-1"
                    >
                      <Brain className="h-3 w-3" /> Hard
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="mt-2 p-3 bg-muted/50 rounded-md">
                  {difficulty === "easy" && (
                    <p className="text-sm">
                      The bot makes random moves. Perfect for beginners or
                      casual play.
                    </p>
                  )}
                  {difficulty === "medium" && (
                    <p className="text-sm">
                      The bot can block your winning moves and make some
                      strategic decisions.
                    </p>
                  )}
                  {difficulty === "hard" && (
                    <p className="text-sm">
                      The bot uses optimal strategy and will be very challenging
                      to beat.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Theme</h3>
                <Tabs
                  defaultValue={theme}
                  onValueChange={(value) =>
                    setTheme(
                      value as "scifi" | "western" | "fantasy" | "horror",
                    )
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="scifi">Sci-Fi</TabsTrigger>
                    <TabsTrigger value="western">Western</TabsTrigger>
                    <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
                    <TabsTrigger value="horror">Horror</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onReturnToMenu}
                >
                  Back to Menu
                </Button>
                <Button className="flex-1" onClick={handleStartGame}>
                  Start Game
                </Button>
              </div>
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
                <Bot className="h-3 w-3" />
                <span className="capitalize">{difficulty} Bot</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                <Zap className="h-3 w-3" />
                <span>Practice Mode</span>
              </Badge>
            </div>
            <MovieBoxGame
              onGameEnd={handleGameEnd}
              movieTheme={theme}
              botMode={{
                enabled: true,
                difficulty: difficulty,
              }}
            />
          </div>
        );
      case "result":
        return (
          <GameResult
            winner={gameResult.winner}
            playerName="You"
            opponentName="Bot"
            pointsEarned={gameResult.pointsEarned}
            isWinner={gameResult.isWinner}
            isDraw={gameResult.isDraw}
            onPlayAgain={handlePlayAgain}
            onReturnToMenu={onReturnToMenu}
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

export default BotGameMode;
