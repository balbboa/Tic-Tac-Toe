import React from "react";
import Header from "../components/layout/Header";
import Leaderboard from "../components/leaderboard/Leaderboard";
import { useAuth } from "../context/AuthContext";

const LeaderboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <Leaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;
