import React, { useState } from "react";
import { useFriends } from "../../context/FriendContext";
import { useGame } from "../../context/GameContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Check, X, UserPlus, Clock, User, Gamepad2 } from "lucide-react";

const FriendList = () => {
  const {
    friends,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    isLoading,
    error,
  } = useFriends();
  const { createGame, inviteFriendToGame } = useGame();
  const [nickname, setNickname] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<string | null>(null);
  const [invitingFriend, setInvitingFriend] = useState<string | null>(null);

  const handleSendRequest = async () => {
    if (nickname.trim()) {
      await sendFriendRequest(nickname.trim());
      setNickname("");
      setShowAddFriend(false);
    }
  };

  const handleInviteToGame = async (friendId: string) => {
    try {
      setInvitingFriend(friendId);
      // Create a new game room
      const roomCode = await createGame({
        roomName: "Movie Night",
        movieGenre: "Sci-Fi",
        isPrivate: true,
        timeLimit: 180,
      });

      // Send invite to friend
      await inviteFriendToGame(friendId, roomCode);

      // Show success message
      alert(`Game invitation sent! Room code: ${roomCode}`);
    } catch (err) {
      console.error("Failed to invite friend to game", err);
    } finally {
      setInvitingFriend(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "in-game":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string, lastSeen?: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "in-game":
        return "In Game";
      default:
        return lastSeen
          ? `Last seen ${new Date(lastSeen).toLocaleTimeString()}`
          : "Offline";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl">Friends</CardTitle>
        <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Friend</DialogTitle>
              <DialogDescription>
                Enter your friend's nickname to send them a friend request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="friendNickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSendRequest}
                disabled={!nickname.trim() || isLoading}
              >
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Tabs defaultValue="friends">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="friends">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({friendRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any friends yet.</p>
                <p className="text-sm">Add friends to play games together!</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                        <AvatarFallback>
                          {friend.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                          friend.status,
                        )}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getStatusText(friend.status, friend.lastSeen)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInviteToGame(friend.id)}
                      disabled={
                        friend.status === "offline" ||
                        isLoading ||
                        invitingFriend === friend.id
                      }
                      className="flex items-center gap-1"
                    >
                      <Gamepad2 className="h-4 w-4" />
                      {invitingFriend === friend.id ? "Inviting..." : "Invite"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFriendToRemove(friend.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {friendRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No pending friend requests.</p>
              </div>
            ) : (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={request.senderAvatar}
                        alt={request.senderName}
                      />
                      <AvatarFallback>
                        {request.senderName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.senderName}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptFriendRequest(request.id)}
                      disabled={isLoading}
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => declineFriendRequest(request.id)}
                      disabled={isLoading}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Confirm Remove Friend Dialog */}
      <AlertDialog
        open={!!friendToRemove}
        onOpenChange={(open) => !open && setFriendToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this friend? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (friendToRemove) {
                  await removeFriend(friendToRemove);
                  setFriendToRemove(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FriendList;
