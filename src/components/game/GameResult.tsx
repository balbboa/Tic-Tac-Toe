import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Trophy, Award, ArrowRight, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface GameResultProps {
  winner?: string;
  playerName?: string;
  opponentName?: string;
  pointsEarned?: number;
  isWinner?: boolean;
  isDraw?: boolean;
  rankChange?: number;
  onPlayAgain?: () => void;
  onReturnToMenu?: () => void;
}

const GameResult = ({
  winner,
  playerName = "You",
  opponentName = "Opponent",
  pointsEarned = 100,
  isWinner = false,
  isDraw = false,
  rankChange,
  onPlayAgain = () => {},
  onReturnToMenu = () => {},
}: GameResultProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 shadow-lg overflow-hidden">
        <div
          className={`h-2 w-full ${
            isDraw ? "bg-yellow-500" : isWinner ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl">
            {isDraw ? (
              "It's a Draw!"
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isWinner && <Trophy className="h-6 w-6 text-yellow-500" />}
                {winner} Wins!
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div
                className={`text-lg font-bold ${
                  isWinner ? "text-green-600" : "text-gray-600"
                }`}
              >
                {playerName}
              </div>
              {!isDraw && (
                <div className="text-sm text-muted-foreground">
                  {isWinner ? "Winner" : "Defeated"}
                </div>
              )}
            </div>

            <div className="text-2xl font-bold text-gray-400 px-4">VS</div>

            <div className="text-center flex-1">
              <div
                className={`text-lg font-bold ${
                  !isWinner && !isDraw ? "text-green-600" : "text-gray-600"
                }`}
              >
                {opponentName}
              </div>
              {!isDraw && (
                <div className="text-sm text-muted-foreground">
                  {!isWinner ? "Winner" : "Defeated"}
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold">+{pointsEarned} points</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isDraw
                ? "You both played well! Points awarded for the draw."
                : isWinner
                  ? "Congratulations on your victory!"
                  : "Better luck next time! Points awarded for participation."}
            </p>

            {rankChange !== undefined && (
              <div
                className={`mt-2 text-sm font-medium ${
                  rankChange > 0
                    ? "text-green-600"
                    : rankChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                Rank change: {rankChange > 0 ? "+" : ""}
                {rankChange}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onReturnToMenu}
            >
              Return to Menu
            </Button>
            <Button className="flex-1 gap-2" onClick={onPlayAgain}>
              <RefreshCw className="h-4 w-4" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GameResult;
