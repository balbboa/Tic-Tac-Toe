import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Gamepad2,
  Users,
  Trophy,
  ArrowLeft,
  Film,
  Sparkles,
  Zap,
} from "lucide-react";
import GameConfig, { GameConfigOptions } from "./GameConfig";
import MovieTicTacToe from "./MovieTicTacToe";
import { motion } from "framer-motion";

type GameMode =
  | "practice"
  | "ranked"
  | "friends"
  | "select"
  | "config-practice";

interface GameModeSelectorProps {
  onReturnToMenu?: () => void;
}

const GameModeSelector = ({
  onReturnToMenu = () => {},
}: GameModeSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>("select");
  const [gameConfig, setGameConfig] = useState<GameConfigOptions>({
    gameLength: "best3",
    timeLimit: "normal",
    enableSteals: true,
    enableGridBuilder: false,
    categories: {
      movies: true,
      actors: true,
      directors: true,
      genres: false,
      awards: false,
      studios: false,
    },
    movieGenre: "action",
    roomName: "Movie Night",
    isPrivate: true,
  });

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleBackToModeSelect = () => {
    setSelectedMode("select");
  };

  if (selectedMode === "select") {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-card dark:bg-card/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              Select Game Mode
            </span>
            <Button variant="ghost" size="sm" onClick={onReturnToMenu}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="cursor-pointer hover:border-primary transition-all bg-card dark:bg-card/90 hover:shadow-md"
                onClick={() => handleSelectMode("config-practice")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary mb-4">
                    <Gamepad2 size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Practice Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Play against AI opponents of varying difficulty to improve
                    your skills
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card
                className="cursor-pointer hover:border-primary transition-all bg-card dark:bg-card/90 hover:shadow-md"
                onClick={() => handleSelectMode("ranked")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-700/30 dark:to-amber-600/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                    <Trophy size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ranked Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Compete against players of similar skill level to climb the
                    leaderboard
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card
                className="cursor-pointer hover:border-primary transition-all bg-card dark:bg-card/90 hover:shadow-md"
                onClick={() => handleSelectMode("friends")}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-700/30 dark:to-indigo-600/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Play with Friends</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a private game room or join one with a room code
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToModeSelect}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Game Modes
        </Button>
      </div>

      {selectedMode === "config-practice" && (
        <GameConfig
          onCreateGame={(config) => {
            console.log("Creating practice game with config:", config);
            setGameConfig(config);
            setSelectedMode("practice");
          }}
          onJoinGame={(roomCode) => {
            console.log("Joining game with room code:", roomCode);
            setSelectedMode("practice");
          }}
          onBack={handleBackToModeSelect}
        />
      )}

      {selectedMode === "practice" && (
        <MovieTicTacToe
          botMode={{ enabled: true, difficulty: "medium" }}
          onGameEnd={(winner, points) => console.log(winner, points)}
          onRestart={handleBackToModeSelect}
          gameConfig={gameConfig}
        />
      )}

      {selectedMode === "ranked" && (
        <MovieTicTacToe
          botMode={{ enabled: true, difficulty: "hard" }}
          onGameEnd={(winner, points) => console.log(winner, points)}
          onRestart={handleBackToModeSelect}
          gameConfig={{
            ...gameConfig,
            timeLimit: "normal",
            enableSteals: false,
          }}
        />
      )}

      {selectedMode === "friends" && (
        <GameConfig
          onCreateGame={(config) => {
            console.log("Creating game with config:", config);
            setGameConfig(config);
            setSelectedMode("practice");
          }}
          onJoinGame={(roomCode) => {
            console.log("Joining game with room code:", roomCode);
            setSelectedMode("practice");
          }}
          onBack={handleBackToModeSelect}
        />
      )}
    </div>
  );
};

export default GameModeSelector;
