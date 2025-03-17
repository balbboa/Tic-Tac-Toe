import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { simulateSocketEvents } from "../lib/socket";
import { supabase } from "../lib/supabase";

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: "online" | "offline" | "in-game";
  lastSeen?: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

interface FriendContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  sendFriendRequest: (email: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  inviteFriendToGame: (friendId: string, roomCode: string) => Promise<void>;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketEvents = simulateSocketEvents();

  // Load friends and requests when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFriendsAndRequests();

      // Set up realtime subscription for friend requests
      const friendsSubscription = supabase
        .channel("friends-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friends",
          },
          (payload) => {
            console.log("Friends change received:", payload);
            loadFriendsAndRequests();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(friendsSubscription);
      };
    } else {
      // Reset state when logged out
      setFriends([]);
      setFriendRequests([]);
    }
  }, [isAuthenticated, user]);

  const loadFriendsAndRequests = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get accepted friends
      const { data: acceptedFriendsData, error: acceptedFriendsError } =
        await supabase
          .from("friends")
          .select(
            `
          id,
          friend_id,
          users!friends_friend_id_fkey(id, name, avatar_url)
        `,
          )
          .eq("user_id", user.id)
          .eq("status", "accepted");

      if (acceptedFriendsError) throw acceptedFriendsError;

      // Get friends where current user is the friend
      const { data: reverseFriendsData, error: reverseFriendsError } =
        await supabase
          .from("friends")
          .select(
            `
          id,
          user_id,
          users!friends_user_id_fkey(id, name, avatar_url)
        `,
          )
          .eq("friend_id", user.id)
          .eq("status", "accepted");

      if (reverseFriendsError) throw reverseFriendsError;

      // Get pending friend requests
      const { data: pendingRequestsData, error: pendingRequestsError } =
        await supabase
          .from("friends")
          .select(
            `
          id,
          user_id,
          users!friends_user_id_fkey(id, name, avatar_url),
          created_at
        `,
          )
          .eq("friend_id", user.id)
          .eq("status", "pending");

      if (pendingRequestsError) throw pendingRequestsError;

      // Transform the data
      const friendsList: Friend[] = [];

      // Add accepted friends where user is the requester
      acceptedFriendsData?.forEach((friend) => {
        friendsList.push({
          id: friend.friend_id,
          name: friend.users.name,
          avatarUrl: friend.users.avatar_url,
          status: "online", // We would need a presence system for real status
        });
      });

      // Add accepted friends where user is the accepter
      reverseFriendsData?.forEach((friend) => {
        friendsList.push({
          id: friend.user_id,
          name: friend.users.name,
          avatarUrl: friend.users.avatar_url,
          status: "online", // We would need a presence system for real status
        });
      });

      // Transform pending requests
      const requestsList: FriendRequest[] =
        pendingRequestsData?.map((request) => ({
          id: request.id,
          senderId: request.user_id,
          senderName: request.users.name,
          senderAvatar: request.users.avatar_url,
          status: "pending",
          createdAt: request.created_at,
        })) || [];

      setFriends(friendsList);
      setFriendRequests(requestsList);
    } catch (err) {
      console.error("Error loading friends:", err);
      setError("Failed to load friends. Please try again.");

      // Fallback to mock data
      const mockFriends: Friend[] = [
        {
          id: "friend1",
          name: "MovieBuddy",
          avatarUrl:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuddy",
          status: "online",
        },
        {
          id: "friend2",
          name: "FilmFriend",
          avatarUrl:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=FilmFriend",
          status: "in-game",
        },
        {
          id: "friend3",
          name: "CinePal",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=CinePal",
          status: "offline",
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      const mockRequests: FriendRequest[] = [
        {
          id: "req1",
          senderId: "sender1",
          senderName: "NewFriend",
          senderAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=NewFriend",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ];

      setFriends(mockFriends);
      setFriendRequests(mockRequests);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (email: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) {
        if (userError.code === "PGRST116") {
          throw new Error("User not found with that email");
        }
        throw userError;
      }

      if (!userData) {
        throw new Error("User not found with that email");
      }

      // Check if friend request already exists
      const { data: existingRequest, error: existingRequestError } =
        await supabase
          .from("friends")
          .select("id, status")
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          .or(`friend_id.eq.${userData.id},user_id.eq.${userData.id}`)
          .single();

      if (existingRequestError && existingRequestError.code !== "PGRST116") {
        throw existingRequestError;
      }

      if (existingRequest) {
        if (existingRequest.status === "accepted") {
          throw new Error("You are already friends with this user");
        } else {
          throw new Error(
            "A friend request already exists between you and this user",
          );
        }
      }

      // Create friend request
      const { data, error } = await supabase.from("friends").insert([
        {
          user_id: user.id,
          friend_id: userData.id,
          status: "pending",
        },
      ]);

      if (error) throw error;

      // Simulate socket event for real-time notification
      await socketEvents.emitFriendRequest(userData.id);

      console.log(`Friend request sent to ${email}`);
    } catch (err) {
      console.error("Error sending friend request:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send friend request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the request in local state
      const request = friendRequests.find((req) => req.id === requestId);
      if (!request) throw new Error("Request not found");

      // Update the request status in the database
      const { error } = await supabase
        .from("friends")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (error) throw error;

      // Update local state
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));

      // Add to friends list
      const newFriend: Friend = {
        id: request.senderId,
        name: request.senderName,
        avatarUrl: request.senderAvatar,
        status: "online",
      };

      setFriends((prev) => [...prev, newFriend]);

      // Simulate socket event for real-time notification
      await socketEvents.emitFriendAccept(request.senderId);
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Failed to accept friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Delete the request from the database
      const { error } = await supabase
        .from("friends")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      // Remove from local state
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("Error declining friend request:", err);
      setError("Failed to decline friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Delete the friendship from the database (both directions)
      const { error: error1 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", user.id)
        .eq("friend_id", friendId);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", friendId)
        .eq("friend_id", user.id);

      if (error2) throw error2;

      // Update local state
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (err) {
      console.error("Error removing friend:", err);
      setError("Failed to remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inviteFriendToGame = async (friendId: string, roomCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate socket event
      await socketEvents.emitGameInvite(friendId, roomCode);
    } catch (err) {
      setError("Failed to send game invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FriendContext.Provider
      value={{
        friends,
        friendRequests,
        isLoading,
        error,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        inviteFriendToGame,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendProvider");
  }
  return context;
};
