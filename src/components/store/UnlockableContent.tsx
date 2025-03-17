import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Film, ShoppingBag, Ticket, Lock, Unlock } from "lucide-react";
import WatchAdModal from "../ads/WatchAdModal";

interface StoreItem {
  id: string;
  name: string;
  type: "piece" | "board" | "effect";
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
  cost: number;
  image: string;
  isUnlocked: boolean;
}

const UnlockableContent = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [activeTab, setActiveTab] = useState("pieces");
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch store items and user's unlocked items
  useEffect(() => {
    const fetchStoreData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all store items
        const { data: storeItemsData, error: storeItemsError } = await supabase
          .from("store_items")
          .select("*")
          .order("cost", { ascending: true });

        if (storeItemsError) throw storeItemsError;

        // Fetch user's points if logged in
        let userPoints = 250; // Default for guests
        if (user) {
          const { data: pointsData, error: pointsError } = await supabase
            .from("user_points")
            .select("points")
            .eq("user_id", user.id)
            .single();

          if (pointsError && pointsError.code !== "PGRST116") {
            throw pointsError;
          }

          if (pointsData) {
            userPoints = pointsData.points;
          } else {
            // Create initial points record if it doesn't exist
            const { error: insertError } = await supabase
              .from("user_points")
              .insert([{ user_id: user.id, points: 250 }]);

            if (insertError) throw insertError;
            userPoints = 250;
          }
        }

        // Fetch user's unlocked items if logged in
        let unlockedItemIds: string[] = [];
        if (user) {
          const { data: userItemsData, error: userItemsError } = await supabase
            .from("user_items")
            .select("item_id")
            .eq("user_id", user.id);

          if (userItemsError) throw userItemsError;

          unlockedItemIds = userItemsData.map((item) => item.item_id);
        }

        // Transform store items to match our component state
        const transformedItems: StoreItem[] = storeItemsData.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type as "piece" | "board" | "effect",
          rarity: item.rarity as "common" | "rare" | "epic" | "legendary",
          description: item.description,
          cost: item.cost,
          image: item.image,
          isUnlocked: unlockedItemIds.includes(item.id),
        }));

        setStoreItems(transformedItems);
        setPoints(userPoints);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("Failed to load store data");

        // Fallback to mock data
        setStoreItems([
          {
            id: "p1",
            name: "Sci-Fi X",
            type: "piece",
            rarity: "rare",
            description: "A futuristic X piece with glowing blue edges",
            cost: 200,
            image: "https://api.dicebear.com/7.x/shapes/svg?seed=scifi-x",
            isUnlocked: true,
          },
          {
            id: "p2",
            name: "Western O",
            type: "piece",
            rarity: "common",
            description: "A rustic O piece with a lasso design",
            cost: 100,
            image: "https://api.dicebear.com/7.x/shapes/svg?seed=western-o",
            isUnlocked: true,
          },
          {
            id: "p3",
            name: "Fantasy X",
            type: "piece",
            rarity: "epic",
            description: "A magical X piece with mystical runes",
            cost: 300,
            image: "https://api.dicebear.com/7.x/shapes/svg?seed=fantasy-x",
            isUnlocked: false,
          },
          {
            id: "p4",
            name: "Horror O",
            type: "piece",
            rarity: "legendary",
            description: "A spooky O piece with eerie details",
            cost: 500,
            image: "https://api.dicebear.com/7.x/shapes/svg?seed=horror-o",
            isUnlocked: false,
          },
          {
            id: "b1",
            name: "Sci-Fi Board",
            type: "board",
            rarity: "epic",
            description: "A high-tech board with neon grid lines",
            cost: 400,
            image:
              "https://api.dicebear.com/7.x/identicon/svg?seed=scifi-board",
            isUnlocked: true,
          },
          {
            id: "b2",
            name: "Western Board",
            type: "board",
            rarity: "rare",
            description: "A dusty saloon-themed game board",
            cost: 250,
            image:
              "https://api.dicebear.com/7.x/identicon/svg?seed=western-board",
            isUnlocked: false,
          },
          {
            id: "b3",
            name: "Fantasy Board",
            type: "board",
            rarity: "legendary",
            description: "An enchanted forest game board",
            cost: 600,
            image:
              "https://api.dicebear.com/7.x/identicon/svg?seed=fantasy-board",
            isUnlocked: false,
          },
          {
            id: "e1",
            name: "Victory Explosion",
            type: "effect",
            rarity: "common",
            description: "A colorful explosion effect when you win",
            cost: 150,
            image:
              "https://api.dicebear.com/7.x/identicon/svg?seed=victory-effect",
            isUnlocked: true,
          },
          {
            id: "e2",
            name: "Dramatic Zoom",
            type: "effect",
            rarity: "rare",
            description: "A cinematic zoom effect for winning moves",
            cost: 300,
            image:
              "https://api.dicebear.com/7.x/identicon/svg?seed=zoom-effect",
            isUnlocked: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [user]);

  const handleUnlock = async (itemId: string) => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item || item.isUnlocked || points < item.cost || !user) return;

    setIsLoading(true);
    try {
      // Start a transaction to update points and add item to user's collection
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You must be logged in to unlock items");

      // 1. Deduct points from user's account
      const { error: pointsError } = await supabase
        .from("user_points")
        .update({
          points: points - item.cost,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (pointsError) throw pointsError;

      // 2. Add item to user's collection
      const { error: itemError } = await supabase.from("user_items").insert([
        {
          user_id: user.id,
          item_id: itemId,
          unlocked_at: new Date().toISOString(),
        },
      ]);

      if (itemError) throw itemError;

      // 3. Record the transaction
      const { error: transactionError } = await supabase
        .from("point_transactions")
        .insert([
          {
            user_id: user.id,
            amount: -item.cost,
            transaction_type: "purchase",
            reference_id: itemId,
          },
        ]);

      if (transactionError) throw transactionError;

      // Update local state
      setPoints((prev) => prev - item.cost);
      setStoreItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isUnlocked: true } : i)),
      );
    } catch (err) {
      console.error("Error unlocking item:", err);
      setError("Failed to unlock item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEarnPoints = async (pointsEarned: number) => {
    if (!user) {
      // For non-logged in users, just update local state
      setPoints((prev) => prev + pointsEarned);
      return;
    }

    setIsLoading(true);
    try {
      // Update points in database
      const { error: pointsError } = await supabase
        .from("user_points")
        .update({
          points: points + pointsEarned,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (pointsError) throw pointsError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from("point_transactions")
        .insert([
          {
            user_id: user.id,
            amount: pointsEarned,
            transaction_type: "ad_watch",
            reference_id: null,
          },
        ]);

      if (transactionError) throw transactionError;

      // Update local state
      setPoints((prev) => prev + pointsEarned);
    } catch (err) {
      console.error("Error earning points:", err);
      setError("Failed to earn points. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  const filteredItems = storeItems.filter((item) => {
    if (activeTab === "pieces") return item.type === "piece";
    if (activeTab === "boards") return item.type === "board";
    if (activeTab === "effects") return item.type === "effect";
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Movie Store
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg flex items-center gap-1">
                  <Ticket className="h-5 w-5 text-yellow-500" />
                  {points}
                </span>
                <WatchAdModal
                  onComplete={handleEarnPoints}
                  trigger={
                    <Button size="sm" variant="outline" className="gap-1">
                      <Ticket className="h-4 w-4" />
                      Get Points
                    </Button>
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="pieces"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger
                    value="pieces"
                    className="flex items-center gap-1"
                  >
                    <Film className="h-4 w-4" />
                    Game Pieces
                  </TabsTrigger>
                  <TabsTrigger
                    value="boards"
                    className="flex items-center gap-1"
                  >
                    <Film className="h-4 w-4" />
                    Game Boards
                  </TabsTrigger>
                  <TabsTrigger
                    value="effects"
                    className="flex items-center gap-1"
                  >
                    <Film className="h-4 w-4" />
                    Special Effects
                  </TabsTrigger>
                </TabsList>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading store items...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-500">
                    <p>{error}</p>
                    <p className="text-sm">Please try again later.</p>
                  </div>
                ) : (
                  <>
                    <TabsContent value="pieces" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                          <StoreItemCard
                            key={item.id}
                            item={item}
                            onUnlock={handleUnlock}
                            canAfford={points >= item.cost}
                            isLoading={isLoading}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="boards" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                          <StoreItemCard
                            key={item.id}
                            item={item}
                            onUnlock={handleUnlock}
                            canAfford={points >= item.cost}
                            isLoading={isLoading}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="effects" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredItems.map((item) => (
                          <StoreItemCard
                            key={item.id}
                            item={item}
                            onUnlock={handleUnlock}
                            canAfford={points >= item.cost}
                            isLoading={isLoading}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Your Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Game Pieces</span>
                  <span className="text-sm text-muted-foreground">
                    {
                      storeItems.filter(
                        (i) => i.type === "piece" && i.isUnlocked,
                      ).length
                    }
                    /{storeItems.filter((i) => i.type === "piece").length}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(
                        (storeItems.filter(
                          (i) => i.type === "piece" && i.isUnlocked,
                        ).length /
                          storeItems.filter((i) => i.type === "piece").length) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Game Boards</span>
                  <span className="text-sm text-muted-foreground">
                    {
                      storeItems.filter(
                        (i) => i.type === "board" && i.isUnlocked,
                      ).length
                    }
                    /{storeItems.filter((i) => i.type === "board").length}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(
                        (storeItems.filter(
                          (i) => i.type === "board" && i.isUnlocked,
                        ).length /
                          storeItems.filter((i) => i.type === "board").length) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Special Effects</span>
                  <span className="text-sm text-muted-foreground">
                    {
                      storeItems.filter(
                        (i) => i.type === "effect" && i.isUnlocked,
                      ).length
                    }
                    /{storeItems.filter((i) => i.type === "effect").length}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(
                        (storeItems.filter(
                          (i) => i.type === "effect" && i.isUnlocked,
                        ).length /
                          storeItems.filter((i) => i.type === "effect")
                            .length) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">How to earn points</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Ticket className="h-4 w-4 mt-0.5 text-yellow-500" />
                    <span>Watch ads for 20-50 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ticket className="h-4 w-4 mt-0.5 text-yellow-500" />
                    <span>Win games for 100 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ticket className="h-4 w-4 mt-0.5 text-yellow-500" />
                    <span>Match actors to movies for 50-200 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Ticket className="h-4 w-4 mt-0.5 text-yellow-500" />
                    <span>Build streaks for bonus points (10× multiplier)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StoreItemCardProps {
  item: StoreItem;
  onUnlock: (itemId: string) => void;
  canAfford: boolean;
  isLoading: boolean;
}

const StoreItemCard = ({
  item,
  onUnlock,
  canAfford,
  isLoading,
}: StoreItemCardProps) => {
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
    <Card className="overflow-hidden border-2 hover:shadow-md transition-all">
      <div className="aspect-square relative bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.isUnlocked && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500">Unlocked</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{item.name}</h3>
          <Badge className={getRarityColor(item.rarity)}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Ticket className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{item.cost}</span>
          </div>
          {!item.isUnlocked && (
            <Button
              size="sm"
              onClick={() => onUnlock(item.id)}
              disabled={!canAfford || isLoading}
              className="gap-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                </>
              ) : canAfford ? (
                <>
                  <Unlock className="h-3 w-3" /> Unlock
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" /> Locked
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnlockableContent;
