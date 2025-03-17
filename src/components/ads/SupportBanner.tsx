import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Coffee, X } from "lucide-react";

interface SupportBannerProps {
  onClose?: () => void;
  variant?: "small" | "large";
}

const SupportBanner = ({
  onClose = () => {},
  variant = "small",
}: SupportBannerProps) => {
  if (variant === "small") {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">
              Enjoying the game? Support its development!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.buymeacoffee.com/movietactoe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Support
              </Button>
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Support Movie Tic-Tac-Toe
            </h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1">
              Help us create more movie-themed games and keep this one ad-free!
              Your support allows us to add new features and content.
            </p>
            <div className="mt-3">
              <a
                href="https://www.buymeacoffee.com/movietactoe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                >
                  <Coffee className="mr-2 h-4 w-4" />
                  Buy me a coffee
                </Button>
              </a>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-amber-700 dark:text-amber-400"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportBanner;
