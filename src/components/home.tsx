import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./layout/Header";
import MainMenu from "./dashboard/MainMenu";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation handlers
  const handlePlayGame = () => {
    navigate("/play");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleUnlockContent = () => {
    navigate("/store");
  };

  const handleViewLeaderboards = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={logout} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MainMenu
          userName={user?.name || "Player"}
          onPlayGame={handlePlayGame}
          onViewProfile={handleViewProfile}
          onUnlockContent={handleUnlockContent}
          onViewLeaderboards={handleViewLeaderboards}
        />
      </motion.div>
    </div>
  );
};

export default Home;
