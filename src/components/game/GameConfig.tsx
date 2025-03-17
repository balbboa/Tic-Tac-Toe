import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import {
  Film,
  Clock,
  Zap,
  Grid3X3,
  Award,
  User,
  Flag,
  Video,
  Popcorn,
  Clapperboard,
} from "lucide-react";
import { motion } from "framer-motion";

type GameLength = "best3" | "best5" | "best7" | "unlimited";
type TimeLimit = "quick" | "normal" | "extended" | "unlimited";

interface GameConfigProps {
  onCreateGame: (config: GameConfigOptions) => void;
  onJoinGame: (roomCode: string) => void;
  onBack: () => void;
}

export interface GameConfigOptions {
  gameLength: GameLength;
  timeLimit: TimeLimit;
  enableSteals: boolean;
  enableGridBuilder: boolean;
  categories: {
    movies: boolean;
    actors: boolean;
    directors: boolean;
    genres: boolean;
    awards: boolean;
    studios: boolean;
    countries: boolean;
  };
  movieGenre: string;
  roomName?: string;
  isPrivate?: boolean;
}

const GameConfig = ({ onCreateGame, onJoinGame, onBack }: GameConfigProps) => {
  const [roomCode, setRoomCode] = useState("");
  const [config, setConfig] = useState<GameConfigOptions>({
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
      countries: false,
    },
    movieGenre: "action",
    roomName: "Movie Night",
    isPrivate: true,
  });

  const handleCreateGame = () => {
    onCreateGame(config);
  };

  const handleJoinGame = () => {
    if (roomCode.trim()) {
      onJoinGame(roomCode);
    }
  };

  const updateConfig = (key: keyof GameConfigOptions, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateCategory = (
    category: keyof GameConfigOptions["categories"],
    value: boolean,
  ) => {
    setConfig((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: value },
    }));
  };

  const genres = [
    { id: "action", name: "Action", icon: <Zap className="h-6 w-6" /> },
    { id: "comedy", name: "Comedy", icon: <Popcorn className="h-6 w-6" /> },
    { id: "drama", name: "Drama", icon: <Clapperboard className="h-6 w-6" /> },
    { id: "scifi", name: "Sci-Fi", icon: <Film className="h-6 w-6" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Game Setup</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Rooms</h3>
          <div className="flex gap-2">
            <Input
              placeholder="ENTER CODE"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleJoinGame}
              disabled={!roomCode.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Join Room
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-foreground">
            Create Room: Settings
          </h3>

          {/* Game Length */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={config.gameLength === "best3" ? "default" : "outline"}
              className={config.gameLength === "best3" ? "bg-primary" : ""}
              onClick={() => updateConfig("gameLength", "best3")}
            >
              Best of 3
            </Button>
            <Button
              variant={config.gameLength === "best5" ? "default" : "outline"}
              className={config.gameLength === "best5" ? "bg-primary" : ""}
              onClick={() => updateConfig("gameLength", "best5")}
            >
              Best of 5
            </Button>
            <Button
              variant={config.gameLength === "best7" ? "default" : "outline"}
              className={config.gameLength === "best7" ? "bg-primary" : ""}
              onClick={() => updateConfig("gameLength", "best7")}
            >
              Best of 7
            </Button>
            <Button
              variant={
                config.gameLength === "unlimited" ? "default" : "outline"
              }
              className={config.gameLength === "unlimited" ? "bg-primary" : ""}
              onClick={() => updateConfig("gameLength", "unlimited")}
            >
              Unlimited
            </Button>
          </div>

          {/* Time Limit */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={config.timeLimit === "quick" ? "default" : "outline"}
              className={config.timeLimit === "quick" ? "bg-primary" : ""}
              onClick={() => updateConfig("timeLimit", "quick")}
            >
              <div className="text-center">
                <div>Quick</div>
                <div className="text-xs">15s turns</div>
              </div>
            </Button>
            <Button
              variant={config.timeLimit === "normal" ? "default" : "outline"}
              className={config.timeLimit === "normal" ? "bg-primary" : ""}
              onClick={() => updateConfig("timeLimit", "normal")}
            >
              <div className="text-center">
                <div>Normal</div>
                <div className="text-xs">40s turns</div>
              </div>
            </Button>
            <Button
              variant={config.timeLimit === "extended" ? "default" : "outline"}
              className={config.timeLimit === "extended" ? "bg-primary" : ""}
              onClick={() => updateConfig("timeLimit", "extended")}
            >
              <div className="text-center">
                <div>Extended</div>
                <div className="text-xs">60s turns</div>
              </div>
            </Button>
            <Button
              variant={config.timeLimit === "unlimited" ? "default" : "outline"}
              className={config.timeLimit === "unlimited" ? "bg-primary" : ""}
              onClick={() => updateConfig("timeLimit", "unlimited")}
            >
              <div className="text-center">
                <div>Unlimited</div>
                <div className="text-xs">No limit</div>
              </div>
            </Button>
          </div>

          {/* Game Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-foreground">Steals</div>
                  <div className="text-sm text-muted-foreground">
                    Players can steal occupied squares
                  </div>
                </div>
              </div>
              <Switch
                checked={config.enableSteals}
                onCheckedChange={(checked) =>
                  updateConfig("enableSteals", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-foreground">
                    Grid Builder
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Take turns to pick the grid
                  </div>
                </div>
              </div>
              <Switch
                checked={config.enableGridBuilder}
                onCheckedChange={(checked) =>
                  updateConfig("enableGridBuilder", checked)
                }
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-2 text-foreground">Categories</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which categories appear on the grid
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="movies"
                  checked={config.categories.movies}
                  onChange={(e) => updateCategory("movies", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="movies" className="text-foreground">
                  Movies
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actors"
                  checked={config.categories.actors}
                  onChange={(e) => updateCategory("actors", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="actors" className="text-foreground">
                  Actors
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="directors"
                  checked={config.categories.directors}
                  onChange={(e) =>
                    updateCategory("directors", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="directors" className="text-foreground">
                  Directors
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="genres"
                  checked={config.categories.genres}
                  onChange={(e) => updateCategory("genres", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="genres" className="text-foreground">
                  Genres
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="awards"
                  checked={config.categories.awards}
                  onChange={(e) => updateCategory("awards", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="awards" className="text-foreground">
                  Awards
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="studios"
                  checked={config.categories.studios}
                  onChange={(e) => updateCategory("studios", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="studios" className="text-foreground">
                  Studios
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="countries"
                  checked={config.categories.countries}
                  onChange={(e) =>
                    updateCategory("countries", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="countries" className="text-foreground">
                  Countries
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Play Button */}
      <div className="flex justify-center mt-6">
        <Button
          size="lg"
          className="w-full max-w-md py-6 text-lg font-bold"
          onClick={handleCreateGame}
        >
          START GAME
        </Button>
      </div>
    </div>
  );
};

export default GameConfig;
