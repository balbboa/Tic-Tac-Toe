import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, User, Trophy, Film } from "lucide-react";
import MenuCard from "./MenuCard";

interface MainMenuProps {
  onPlayGame?: () => void;
  onViewProfile?: () => void;
  onUnlockContent?: () => void;
  onViewLeaderboards?: () => void;
  userName?: string;
}

const MainMenu = ({
  onPlayGame = () => console.log("Play Game clicked"),
  onViewProfile = () => console.log("View Profile clicked"),
  onUnlockContent = () => console.log("Unlock Content clicked"),
  onViewLeaderboards = () => console.log("View Leaderboards clicked"),
  userName = "Player",
}: MainMenuProps) => {
  const menuOptions = [
    {
      title: "Play Game",
      description: "Start a new game or join an existing one with friends",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Gamepad2 size={24} />
        </div>
      ),
      onClick: onPlayGame,
    },
    {
      title: "View Profile",
      description:
        "Check your stats, customize your profile, and view unlocked content",
      icon: (
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <User size={24} />
        </div>
      ),
      onClick: onViewProfile,
    },
    {
      title: "Unlock Content",
      description:
        "Browse and unlock movie-themed game pieces and board designs",
      icon: (
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <Film size={24} />
        </div>
      ),
      onClick: onUnlockContent,
    },
    {
      title: "Leaderboards",
      description: "View global rankings and see how you compare to friends",
      icon: (
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Trophy size={24} />
        </div>
      ),
      onClick: onViewLeaderboards,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, {userName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose an option below to get started with Movie Tic-Tac-Toe
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {menuOptions.map((option, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <MenuCard
                title={option.title}
                description={option.description}
                icon={option.icon}
                onClick={option.onClick}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center text-muted-foreground text-sm">
          <p>
            Match actors to movies and earn points to unlock special content!
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href="https://www.buymeacoffee.com/movietactoe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>☕ Support the game</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainMenu;
