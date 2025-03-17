import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import GameModeSelector from "../components/game/GameModeSelector";
import GameLobby from "../components/game/GameLobby";
import MovieBoxGame from "../components/game/MovieBoxGame";
import GameResult from "../components/game/GameResult";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

type GameStage = "mode-select" | "lobby" | "playing" | "result";

const PlayPage = () => {
  const { user, logout } = useAuth();
  const { currentRoom, createGame, joinGame, leaveGame, startGame } = useGame();
  const [gameStage, setGameStage] = useState<GameStage>("mode-select");
  const [gameResult, setGameResult] = useState<{
    winner?: string;
    isWinner?: boolean;
    isDraw?: boolean;
    pointsEarned?: number;
  }>({});
  const navigate = useNavigate();

  const handleCreateGame = async (settings: any) => {
    await createGame(settings);
    setGameStage("lobby");
  };

  const handleJoinGame = async (roomCode: string) => {
    await joinGame(roomCode);
    setGameStage("lobby");
  };

  const handleStartGame = async () => {
    await startGame();
    setGameStage("playing");
  };

  const handleGameEnd = (winner: "X" | "O" | "draw") => {
    const isWinner = winner === "X"; // Assuming player is always X in this demo
    const isDraw = winner === "draw";
    const pointsEarned = isDraw ? 50 : isWinner ? 100 : 25;

    setGameResult({
      winner: isDraw ? undefined : isWinner ? user?.name : "Opponent",
      isWinner,
      isDraw,
      pointsEarned,
    });

    setGameStage("result");
  };

  const handlePlayAgain = () => {
    setGameStage("playing");
  };

  const handleReturnToMenu = () => {
    leaveGame();
    navigate("/");
  };

  const renderGameStage = () => {
    switch (gameStage) {
      case "mode-select":
        return <GameModeSelector onReturnToMenu={handleReturnToMenu} />;
      case "lobby":
        return (
          <GameLobby
            roomCode={currentRoom?.code}
            players={currentRoom?.players.map((p) => ({
              id: p.id,
              name: p.name,
              avatar: p.avatarUrl,
              isReady: p.isReady,
            }))}
            isHost={currentRoom?.players.find((p) => p.id === user?.id)?.isHost}
            onStartGame={handleStartGame}
            onLeaveRoom={() => {
              leaveGame();
              setGameStage("mode-select");
            }}
          />
        );
      case "playing":
        return (
          <div className="max-w-md mx-auto">
            <MovieBoxGame onGameEnd={handleGameEnd} movieTheme="scifi" />
          </div>
        );
      case "result":
        return (
          <GameResult
            winner={gameResult.winner}
            playerName={user?.name}
            opponentName="Opponent"
            pointsEarned={gameResult.pointsEarned}
            isWinner={gameResult.isWinner}
            isDraw={gameResult.isDraw}
            onPlayAgain={handlePlayAgain}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          {renderGameStage()}
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
