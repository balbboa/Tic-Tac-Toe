import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Film,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Users,
  Trophy,
  ShoppingBag,
  Gamepad2,
} from "lucide-react";

import { Button } from "../ui/button";
import ThemeToggle from "../settings/ThemeToggle";
import HowToPlayModal from "../help/HowToPlayModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  onLogout?: () => void;
}

const Header = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=movie-player",
  },
  onLogout = () => console.log("Logout clicked"),
}: HeaderProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Film className="h-8 w-8 text-primary" />
        <Link to="/" className="text-2xl font-bold text-foreground">
          MovieTacToe
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-6">
        <Link
          to="/play"
          className={`flex items-center gap-1.5 transition-colors ${isActive("/play") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
        >
          <Gamepad2 className="h-4 w-4" />
          Play Game
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-1.5 transition-colors ${isActive("/profile") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>
        <Link
          to="/friends"
          className={`flex items-center gap-1.5 transition-colors ${isActive("/friends") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
        >
          <Users className="h-4 w-4" />
          Friends
        </Link>
        <Link
          to="/store"
          className={`flex items-center gap-1.5 transition-colors ${isActive("/store") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
        >
          <ShoppingBag className="h-4 w-4" />
          Store
        </Link>
        <Link
          to="/leaderboard"
          className={`flex items-center gap-1.5 transition-colors ${isActive("/leaderboard") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
        >
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <HowToPlayModal
            trigger={
              <Button variant="outline" size="sm" className="hidden md:flex">
                <HelpCircle className="mr-2 h-4 w-4" />
                How to Play
              </Button>
            }
          />
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/friends" className="cursor-pointer w-full">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Friends</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
