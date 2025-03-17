import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Gamepad2, Users, Film, ArrowLeft } from "lucide-react";

interface GameSetupProps {
  onCreateGame?: (settings: any) => void;
  onJoinGame?: (roomCode: string) => void;
  onBack?: () => void;
}

const GameSetup = ({
  onCreateGame = () => console.log("Create game"),
  onJoinGame = () => console.log("Join game"),
  onBack,
}: GameSetupProps) => {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [roomCode, setRoomCode] = useState("");
  const [gameSettings, setGameSettings] = useState({
    roomName: "Movie Night",
    movieGenre: "Sci-Fi",
    isPrivate: true,
    timeLimit: 180,
  });

  const handleCreateGame = () => {
    onCreateGame(gameSettings);
  };

  const handleJoinGame = () => {
    if (roomCode.trim()) {
      onJoinGame(roomCode.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Play with Friends</span>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "create" | "join")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-1">
              <Gamepad2 className="h-4 w-4" />
              Create Game
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Join Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name</Label>
                <Input
                  id="room-name"
                  placeholder="Movie Night"
                  value={gameSettings.roomName}
                  onChange={(e) =>
                    setGameSettings({
                      ...gameSettings,
                      roomName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="movie-genre">Movie Genre</Label>
                <Select
                  value={gameSettings.movieGenre}
                  onValueChange={(value) =>
                    setGameSettings({ ...gameSettings, movieGenre: value })
                  }
                >
                  <SelectTrigger id="movie-genre" className="w-full">
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sci-Fi">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Sci-Fi</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Western">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Western</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Fantasy">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Fantasy</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Horror">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>Horror</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private-game"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={gameSettings.isPrivate}
                  onChange={(e) =>
                    setGameSettings({
                      ...gameSettings,
                      isPrivate: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="private-game">Private Game</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                <Select
                  value={gameSettings.timeLimit.toString()}
                  onValueChange={(value) =>
                    setGameSettings({
                      ...gameSettings,
                      timeLimit: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="time-limit" className="w-full">
                    <SelectValue placeholder="Select time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="180">3 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-4" onClick={handleCreateGame}>
                Create Game Room
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="join" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-code">Room Code</Label>
                <Input
                  id="room-code"
                  placeholder="Enter 6-digit code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="uppercase"
                  maxLength={6}
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleJoinGame}
                disabled={!roomCode.trim()}
              >
                Join Game
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GameSetup;
