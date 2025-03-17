import React, { useState, useEffect } from "react";
import { Trophy, Users, Medal, Star, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

interface LeaderboardPlayerProps {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  wins: number;
  triviaScore: number;
  isCurrentUser?: boolean;
}

const LeaderboardPlayer = ({
  rank = 1,
  name = "Player Name",
  avatar = "",
  score = 1000,
  wins = 10,
  triviaScore = 85,
  isCurrentUser = false,
}: LeaderboardPlayerProps) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${isCurrentUser ? "bg-primary/10" : "hover:bg-muted/50"} transition-colors`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold">
          {rank <= 3 ? (
            <span className="text-yellow-500">
              {rank === 1 && <Trophy size={16} />}
              {rank === 2 && <Medal size={16} />}
              {rank === 3 && <Star size={16} />}
            </span>
          ) : (
            rank
          )}
        </div>
        <Avatar>
          <AvatarImage
            src={
              avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            }
            alt={name}
          />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium flex items-center gap-2">
            {name}
            {isCurrentUser && (
              <Badge variant="secondary" className="text-xs">
                You
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{wins} wins</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Trivia</div>
          <div className="font-medium">{triviaScore}%</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Score</div>
          <div className="font-medium">{score}</div>
        </div>
      </div>
    </div>
  );
};

interface LeaderboardProps {
  globalPlayers?: LeaderboardPlayerProps[];
  friendPlayers?: LeaderboardPlayerProps[];
  currentUserId?: string;
}

const Leaderboard = ({ currentUserId }: LeaderboardProps) => {
  const { user } = useAuth();
  const [globalPlayers, setGlobalPlayers] = useState<LeaderboardPlayerProps[]>(
    [],
  );
  const [friendPlayers, setFriendPlayers] = useState<LeaderboardPlayerProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch global leaderboard
        const { data: leaderboardData, error: leaderboardError } =
          await supabase
            .from("leaderboard")
            .select("*")
            .order("total_points", { ascending: false })
            .limit(10);

        if (leaderboardError) throw leaderboardError;

        // Transform data to match our component props
        const transformedGlobalData: LeaderboardPlayerProps[] =
          leaderboardData.map((player, index) => ({
            rank: index + 1,
            name: player.name,
            avatar: player.avatar_url || "",
            score: player.total_points,
            wins: player.games_won,
            triviaScore: player.win_percentage,
            isCurrentUser: player.id === (user?.id || currentUserId),
          }));

        setGlobalPlayers(transformedGlobalData);

        // Fetch friend leaderboard if user is logged in
        if (user?.id) {
          const { data: friendsData, error: friendsError } = await supabase
            .from("friends")
            .select("friend_id")
            .eq("user_id", user.id)
            .eq("status", "accepted");

          if (friendsError) throw friendsError;

          if (friendsData && friendsData.length > 0) {
            const friendIds = friendsData.map((f) => f.friend_id);

            // Add current user to the list
            friendIds.push(user.id);

            const {
              data: friendLeaderboardData,
              error: friendLeaderboardError,
            } = await supabase
              .from("leaderboard")
              .select("*")
              .in("id", friendIds)
              .order("total_points", { ascending: false });

            if (friendLeaderboardError) throw friendLeaderboardError;

            const transformedFriendData: LeaderboardPlayerProps[] =
              friendLeaderboardData.map((player, index) => ({
                rank: index + 1,
                name: player.name,
                avatar: player.avatar_url || "",
                score: player.total_points,
                wins: player.games_won,
                triviaScore: player.win_percentage,
                isCurrentUser: player.id === user.id,
              }));

            setFriendPlayers(transformedFriendData);
          } else {
            // No friends, just show current user
            const currentUserData = transformedGlobalData.find(
              (p) => p.isCurrentUser,
            );
            if (currentUserData) {
              setFriendPlayers([
                {
                  ...currentUserData,
                  rank: 1,
                },
              ]);
            } else {
              setFriendPlayers([]);
            }
          }
        } else {
          // Not logged in, use mock data for friends
          setFriendPlayers([
            {
              rank: 1,
              name: "ReelDeal",
              avatar: "",
              score: 6540,
              wins: 30,
              triviaScore: 85,
              isCurrentUser: true,
            },
            {
              rank: 2,
              name: "MovieBuddy",
              avatar: "",
              score: 5120,
              wins: 23,
              triviaScore: 79,
            },
            {
              rank: 3,
              name: "FilmFriend",
              avatar: "",
              score: 4350,
              wins: 19,
              triviaScore: 76,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data");

        // Use mock data as fallback
        setGlobalPlayers([
          {
            rank: 1,
            name: "MovieMaster",
            avatar: "",
            score: 9850,
            wins: 42,
            triviaScore: 95,
          },
          {
            rank: 2,
            name: "CinemaWizard",
            avatar: "",
            score: 8720,
            wins: 38,
            triviaScore: 92,
          },
          {
            rank: 3,
            name: "FilmBuff",
            avatar: "",
            score: 7650,
            wins: 35,
            triviaScore: 88,
          },
          {
            rank: 4,
            name: "ReelDeal",
            avatar: "",
            score: 6540,
            wins: 30,
            triviaScore: 85,
            isCurrentUser: true,
          },
          {
            rank: 5,
            name: "SceneQueen",
            avatar: "",
            score: 5980,
            wins: 27,
            triviaScore: 82,
          },
        ]);

        setFriendPlayers([
          {
            rank: 1,
            name: "ReelDeal",
            avatar: "",
            score: 6540,
            wins: 30,
            triviaScore: 85,
            isCurrentUser: true,
          },
          {
            rank: 2,
            name: "MovieBuddy",
            avatar: "",
            score: 5120,
            wins: 23,
            triviaScore: 79,
          },
          {
            rank: 3,
            name: "FilmFriend",
            avatar: "",
            score: 4350,
            wins: 19,
            triviaScore: 76,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user, currentUserId]);
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Leaderboard</CardTitle>
              <CardDescription>
                See how you rank against other players
              </CardDescription>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="global">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="global">
                <Users className="mr-2 h-4 w-4" />
                Global Rankings
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Users className="mr-2 h-4 w-4" />
                Friend Rankings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="global" className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading leaderboard...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <p className="text-sm">Please try again later.</p>
                </div>
              ) : (
                globalPlayers.map((player) => (
                  <LeaderboardPlayer
                    key={`global-${player.rank}-${player.name}`}
                    {...player}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="friends" className="space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading friends...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <p className="text-sm">Please try again later.</p>
                </div>
              ) : friendPlayers.length > 0 ? (
                friendPlayers.map((player) => (
                  <LeaderboardPlayer
                    key={`friend-${player.rank}-${player.name}`}
                    {...player}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You don't have any friends yet.
                  </p>
                  <p className="text-sm">
                    Play games and connect with other players to see your friend
                    rankings.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
