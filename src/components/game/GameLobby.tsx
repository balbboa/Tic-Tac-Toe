import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Copy, Users, Play } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  isReady: boolean;
}

interface GameLobbyProps {
  roomCode?: string;
  players?: Player[];
  isHost?: boolean;
  onStartGame?: () => void;
  onCopyCode?: () => void;
  onLeaveRoom?: () => void;
}

const GameLobby = ({
  roomCode = "ABC123",
  players = [
    {
      id: "1",
      name: "Player 1",
      isReady: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
    },
    {
      id: "2",
      name: "Player 2",
      isReady: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
    },
  ],
  isHost = true,
  onStartGame = () => console.log("Start game"),
  onCopyCode = () => console.log("Code copied"),
  onLeaveRoom = () => console.log("Leave room"),
}: GameLobbyProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyCode();
  };

  const allPlayersReady = players.every((player) => player.isReady);
  const canStartGame = isHost && allPlayersReady && players.length >= 2;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Game Lobby</h2>

      <div className="flex items-center justify-center mb-6 w-full">
        <div className="flex items-center bg-white rounded-lg p-3 shadow-sm w-full max-w-xs">
          <span className="font-medium mr-2">Room Code:</span>
          <span className="font-bold text-lg">{roomCode}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={handleCopyCode}
          >
            <Copy size={18} />
          </Button>
          {copied && (
            <span className="text-xs text-green-600 ml-2">Copied!</span>
          )}
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="flex items-center mb-4">
          <Users size={20} className="mr-2" />
          <h3 className="text-xl font-semibold">
            Players ({players.length}/2)
          </h3>
        </div>

        <div className="space-y-3 w-full">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>
                    {player.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm ${player.isReady ? "text-green-600" : "text-amber-600"}`}
                >
                  {player.isReady ? "Ready" : "Not Ready"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button variant="outline" className="flex-1" onClick={onLeaveRoom}>
          Leave Room
        </Button>

        <Button
          className="flex-1 gap-2"
          disabled={!canStartGame}
          onClick={onStartGame}
        >
          <Play size={18} />
          Start Game
        </Button>
      </div>

      {isHost && !canStartGame && players.length < 2 && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Waiting for more players to join...
        </p>
      )}

      {isHost && !canStartGame && !allPlayersReady && players.length >= 2 && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Waiting for all players to be ready...
        </p>
      )}
    </div>
  );
};

export default GameLobby;
