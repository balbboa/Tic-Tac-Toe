import React from "react";
import Header from "../components/layout/Header";
import FriendList from "../components/friends/FriendList";
import { useAuth } from "../context/AuthContext";

const FriendsPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Friends</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FriendList />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Friend Suggestions</h2>
              <p className="text-muted-foreground mb-4">
                Connect with other movie enthusiasts to play games and compete
                on the leaderboard.
              </p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/20">
                  <p className="font-medium">MovieMaster</p>
                  <p className="text-sm text-muted-foreground">
                    Top ranked player
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/20">
                  <p className="font-medium">CinemaWizard</p>
                  <p className="text-sm text-muted-foreground">
                    Recently active
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/20">
                  <p className="font-medium">FilmBuff</p>
                  <p className="text-sm text-muted-foreground">
                    Similar interests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
