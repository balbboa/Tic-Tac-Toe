import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../lib/socket";

interface GameRoom {
  id: string;
  code: string;
  name: string;
  hostId: string;
  players: GamePlayer[];
  gameState: GameState | null;
  settings: GameSettings;
  status: "waiting" | "playing" | "completed";
  createdAt: string;
}

interface GamePlayer {
  id: string;
  name: string;
  avatarUrl?: string;
  isReady: boolean;
  isHost: boolean;
  score?: number;
}

interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  moveHistory: {
    player: string;
    position: number;
    timestamp: string;
  }[];
}

interface GameSettings {
  roomName: string;
  movieGenre: string;
  isPrivate: boolean;
  timeLimit: number;
}

interface GameContextType {
  currentRoom: GameRoom | null;
  gameInvites: GameInvite[];
  isLoading: boolean;
  error: string | null;
  createGame: (settings: GameSettings) => Promise<string>;
  joinGame: (roomCode: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  setPlayerReady: (isReady: boolean) => Promise<void>;
  startGame: () => Promise<void>;
  makeMove: (position: number) => Promise<void>;
  restartGame: () => Promise<void>;
  acceptGameInvite: (inviteId: string) => Promise<void>;
  declineGameInvite: (inviteId: string) => Promise<void>;
}

interface GameInvite {
  id: string;
  senderId: string;
  senderName: string;
  roomCode: string;
  createdAt: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [gameInvites, setGameInvites] = useState<GameInvite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for socket events
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // In a real app, these would be actual socket listeners
    const handleGameInvite = (invite: GameInvite) => {
      setGameInvites((prev) => [...prev, invite]);
    };

    const handleGameUpdate = (updatedRoom: GameRoom) => {
      if (currentRoom && currentRoom.id === updatedRoom.id) {
        setCurrentRoom(updatedRoom);
      }
    };

    // Simulate receiving a game invite after 5 seconds (for demo purposes)
    const inviteTimeout = setTimeout(() => {
      if (isAuthenticated && !currentRoom) {
        const mockInvite: GameInvite = {
          id: `invite_${Math.random().toString(36).substring(2, 9)}`,
          senderId: "friend1",
          senderName: "MovieBuddy",
          roomCode: "ABC123",
          createdAt: new Date().toISOString(),
        };
        handleGameInvite(mockInvite);
      }
    }, 5000);

    return () => {
      clearTimeout(inviteTimeout);
      // In a real app: socket.off('game:invite', handleGameInvite);
      // In a real app: socket.off('game:update', handleGameUpdate);
    };
  }, [isAuthenticated, user, currentRoom]);

  const createGame = async (settings: GameSettings): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a random room code
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create a mock room
      const newRoom: GameRoom = {
        id: `room_${Math.random().toString(36).substring(2, 9)}`,
        code: roomCode,
        name: settings.roomName,
        hostId: user?.id || "",
        players: [
          {
            id: user?.id || "",
            name: user?.name || "",
            avatarUrl: user?.avatarUrl,
            isReady: true,
            isHost: true,
          },
        ],
        gameState: null,
        settings,
        status: "waiting",
        createdAt: new Date().toISOString(),
      };

      setCurrentRoom(newRoom);
      return roomCode;
    } catch (err) {
      setError("Failed to create game. Please try again.");
      throw new Error("Failed to create game");
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (roomCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a mock room for joining
      const mockRoom: GameRoom = {
        id: `room_${Math.random().toString(36).substring(2, 9)}`,
        code: roomCode,
        name: "Movie Night",
        hostId: "host123",
        players: [
          {
            id: "host123",
            name: "MovieHost",
            avatarUrl:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=MovieHost",
            isReady: true,
            isHost: true,
          },
          {
            id: user?.id || "",
            name: user?.name || "",
            avatarUrl: user?.avatarUrl,
            isReady: false,
            isHost: false,
          },
        ],
        gameState: null,
        settings: {
          roomName: "Movie Night",
          movieGenre: "Sci-Fi",
          isPrivate: false,
          timeLimit: 180,
        },
        status: "waiting",
        createdAt: new Date().toISOString(),
      };

      setCurrentRoom(mockRoom);
    } catch (err) {
      setError(
        "Failed to join game. Please check the room code and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGame = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentRoom(null);
    } catch (err) {
      setError("Failed to leave game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const setPlayerReady = async (isReady: boolean) => {
    if (!currentRoom || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setCurrentRoom((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          players: prev.players.map((player) =>
            player.id === user.id ? { ...player, isReady } : player,
          ),
        };
      });
    } catch (err) {
      setError("Failed to update ready status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    if (!currentRoom || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setCurrentRoom((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          status: "playing",
          gameState: {
            board: Array(9).fill(null),
            currentPlayer: "X",
            winner: null,
            isDraw: false,
            moveHistory: [],
          },
        };
      });
    } catch (err) {
      setError("Failed to start game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const makeMove = async (position: number) => {
    if (!currentRoom || !currentRoom.gameState || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update local state
      setCurrentRoom((prev) => {
        if (!prev || !prev.gameState) return prev;

        const newBoard = [...prev.gameState.board];
        newBoard[position] = prev.gameState.currentPlayer;

        const newMoveHistory = [
          ...prev.gameState.moveHistory,
          {
            player: prev.gameState.currentPlayer,
            position,
            timestamp: new Date().toISOString(),
          },
        ];

        // Check for winner or draw (simplified)
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

        let winner = null;
        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (
            newBoard[a] &&
            newBoard[a] === newBoard[b] &&
            newBoard[a] === newBoard[c]
          ) {
            winner = newBoard[a];
            break;
          }
        }

        const isDraw = !winner && newBoard.every((cell) => cell !== null);

        return {
          ...prev,
          status: winner || isDraw ? "completed" : "playing",
          gameState: {
            ...prev.gameState,
            board: newBoard,
            currentPlayer: prev.gameState.currentPlayer === "X" ? "O" : "X",
            winner,
            isDraw,
            moveHistory: newMoveHistory,
          },
        };
      });
    } catch (err) {
      setError("Failed to make move. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = async () => {
    if (!currentRoom || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setCurrentRoom((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          status: "playing",
          gameState: {
            board: Array(9).fill(null),
            currentPlayer: "X",
            winner: null,
            isDraw: false,
            moveHistory: [],
          },
        };
      });
    } catch (err) {
      setError("Failed to restart game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const acceptGameInvite = async (inviteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the invite
      const invite = gameInvites.find((inv) => inv.id === inviteId);
      if (!invite) throw new Error("Invite not found");

      // Remove the invite
      setGameInvites((prev) => prev.filter((inv) => inv.id !== inviteId));

      // Join the game
      await joinGame(invite.roomCode);
    } catch (err) {
      setError("Failed to accept game invite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const declineGameInvite = async (inviteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove the invite
      setGameInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      setError("Failed to decline game invite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentRoom,
        gameInvites,
        isLoading,
        error,
        createGame,
        joinGame,
        leaveGame,
        setPlayerReady,
        startGame,
        makeMove,
        restartGame,
        acceptGameInvite,
        declineGameInvite,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
