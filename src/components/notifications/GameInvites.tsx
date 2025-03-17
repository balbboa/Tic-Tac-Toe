import React from "react";
import { useGame } from "../../context/GameContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Gamepad2, Clock, Check, X } from "lucide-react";

const GameInvites = () => {
  const { gameInvites, acceptGameInvite, declineGameInvite, isLoading } =
    useGame();

  if (gameInvites.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full space-y-4">
      {gameInvites.map((invite) => (
        <Card
          key={invite.id}
          className="w-full border-2 border-primary/20 shadow-lg animate-in slide-in-from-right"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Game Invitation
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => declineGameInvite(invite.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              You've been invited to join a game!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.senderName}`}
                  alt={invite.senderName}
                />
                <AvatarFallback>
                  {invite.senderName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{invite.senderName}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Just now</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-sm font-medium">
                Room Code: {invite.roomCode}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              size="sm"
              onClick={() => declineGameInvite(invite.id)}
              disabled={isLoading}
            >
              Decline
            </Button>
            <Button
              className="flex-1"
              size="sm"
              onClick={() => acceptGameInvite(invite.id)}
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Game"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GameInvites;
