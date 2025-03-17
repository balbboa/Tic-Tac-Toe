import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Film, Award, Settings, Edit, Save, X } from "lucide-react";
import StatsPanel from "./StatsPanel";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UnlockedItem {
  id: string;
  name: string;
  type: "piece" | "board" | "effect";
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  isEquipped: boolean;
}

interface UserProfileProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  joinDate?: string;
  achievements?: Achievement[];
  unlockedItems?: UnlockedItem[];
  stats?: {
    wins?: number;
    losses?: number;
    draws?: number;
    triviaCorrect?: number;
    triviaTotal?: number;
    winStreak?: number;
    rank?: string;
    level?: number;
    xp?: number;
    nextLevelXp?: number;
  };
}

const UserProfile = ({
  username = "MovieFan123",
  email = "user@example.com",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=moviefan",
  bio = "Movie enthusiast and tic-tac-toe strategist. I love sci-fi films and challenging opponents!",
  joinDate = "March 15, 2023",
  achievements = [
    {
      id: "a1",
      title: "First Victory",
      description: "Win your first game",
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      unlocked: true,
    },
    {
      id: "a2",
      title: "Trivia Master",
      description: "Answer 50 trivia questions correctly",
      icon: <Film className="h-6 w-6 text-purple-500" />,
      unlocked: true,
      progress: 78,
      maxProgress: 50,
    },
    {
      id: "a3",
      title: "Winning Streak",
      description: "Win 5 games in a row",
      icon: <Award className="h-6 w-6 text-blue-500" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5,
    },
    {
      id: "a4",
      title: "Collection Complete",
      description: "Unlock all movie-themed game pieces",
      icon: <Film className="h-6 w-6 text-green-500" />,
      unlocked: false,
      progress: 8,
      maxProgress: 12,
    },
  ],
  unlockedItems = [
    {
      id: "i1",
      name: "Sci-Fi X",
      type: "piece",
      rarity: "rare",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=scifi",
      isEquipped: true,
    },
    {
      id: "i2",
      name: "Western O",
      type: "piece",
      rarity: "common",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=western",
      isEquipped: false,
    },
    {
      id: "i3",
      name: "Horror Board",
      type: "board",
      rarity: "epic",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=horror",
      isEquipped: true,
    },
    {
      id: "i4",
      name: "Comedy Effect",
      type: "effect",
      rarity: "legendary",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=comedy",
      isEquipped: false,
    },
  ],
  stats = {
    wins: 42,
    losses: 18,
    draws: 5,
    triviaCorrect: 78,
    triviaTotal: 100,
    winStreak: 3,
    rank: "Movie Buff",
    level: 7,
    xp: 350,
    nextLevelXp: 500,
  },
}: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedBio, setEditedBio] = useState(bio);

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUsername(username);
    setEditedBio(bio);
    setIsEditing(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-slate-200 text-slate-800";
      case "rare":
        return "bg-blue-200 text-blue-800";
      case "epic":
        return "bg-purple-200 text-purple-800";
      case "legendary":
        return "bg-amber-200 text-amber-800";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="bg-card">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">Profile</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveProfile}
                    >
                      <Save className="h-5 w-5 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback>
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="h-24"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{username}</h2>
                    <Badge className="mt-2 mb-4">{stats.rank}</Badge>
                    <p className="text-muted-foreground text-sm">{bio}</p>
                  </>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span>{joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span>{stats.level}</span>
                </div>
              </div>

              <Separator />

              <div className="pt-2">
                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6">
              <StatsPanel {...stats} />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${achievement.unlocked ? "border-green-500/50 bg-green-50/10" : "border-gray-200 bg-gray-50/10"}`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${achievement.unlocked ? "bg-green-100" : "bg-gray-100"}`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">
                                {achievement.title}
                              </h3>
                              {achievement.unlocked && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  Unlocked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                            {achievement.progress !== undefined &&
                              achievement.maxProgress && (
                                <div className="mt-2">
                                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${achievement.unlocked ? "bg-green-500" : "bg-blue-500"}`}
                                      style={{
                                        width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-right mt-1 text-muted-foreground">
                                    {achievement.progress}/
                                    {achievement.maxProgress}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collection" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unlocked Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {unlockedItems.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden bg-card"
                      >
                        <div className="aspect-square relative bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {item.isEquipped && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500">Equipped</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{item.name}</h3>
                            <Badge className={getRarityColor(item.rarity)}>
                              {item.rarity.charAt(0).toUpperCase() +
                                item.rarity.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </p>
                          <Button
                            variant={item.isEquipped ? "outline" : "default"}
                            size="sm"
                            className="w-full mt-3"
                          >
                            {item.isEquipped ? "Unequip" : "Equip"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
