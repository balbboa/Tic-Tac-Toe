import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Trophy, Target, Brain, Star } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatItem = ({
  icon,
  label,
  value,
  color = "bg-primary",
}: StatItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

interface ProgressStatProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const ProgressStat = ({ label, value, max, color }: ProgressStatProps) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {value}/{max}
        </span>
      </div>
      <Progress value={percentage} className={color} />
    </div>
  );
};

interface StatsPanelProps {
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
}

const StatsPanel = ({
  wins = 42,
  losses = 18,
  draws = 5,
  triviaCorrect = 78,
  triviaTotal = 100,
  winStreak = 3,
  rank = "Movie Buff",
  level = 7,
  xp = 350,
  nextLevelXp = 500,
}: StatsPanelProps) => {
  const totalGames = wins + losses + draws;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const triviaRate =
    triviaTotal > 0 ? Math.round((triviaCorrect / triviaTotal) * 100) : 0;

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="text-2xl">Player Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatItem
            icon={<Trophy className="h-6 w-6 text-primary-foreground" />}
            label="Total Wins"
            value={wins}
            color="bg-green-500/20 text-green-500"
          />
          <StatItem
            icon={<Target className="h-6 w-6 text-primary-foreground" />}
            label="Win Rate"
            value={`${winRate}%`}
            color="bg-blue-500/20 text-blue-500"
          />
          <StatItem
            icon={<Brain className="h-6 w-6 text-primary-foreground" />}
            label="Trivia Score"
            value={`${triviaRate}%`}
            color="bg-purple-500/20 text-purple-500"
          />
          <StatItem
            icon={<Star className="h-6 w-6 text-primary-foreground" />}
            label="Current Streak"
            value={winStreak}
            color="bg-amber-500/20 text-amber-500"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold">Level {level}</h3>
              <p className="text-sm text-muted-foreground">{rank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {xp}/{nextLevelXp} XP
              </p>
              <p className="text-xs text-muted-foreground">
                {nextLevelXp - xp} XP to next level
              </p>
            </div>
          </div>
          <Progress value={(xp / nextLevelXp) * 100} className="h-2 bg-muted" />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">Detailed Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ProgressStat
                label="Wins"
                value={wins}
                max={totalGames}
                color="bg-green-500"
              />
              <ProgressStat
                label="Losses"
                value={losses}
                max={totalGames}
                color="bg-red-500"
              />
              <ProgressStat
                label="Draws"
                value={draws}
                max={totalGames}
                color="bg-yellow-500"
              />
            </div>
            <div className="space-y-4">
              <ProgressStat
                label="Trivia Correct"
                value={triviaCorrect}
                max={triviaTotal}
                color="bg-purple-500"
              />
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-medium mb-2">Game History</h4>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => {
                    // Simulate a game history pattern
                    const result =
                      i % 3 === 0 ? "win" : i % 4 === 0 ? "draw" : "loss";
                    return (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${result === "win" ? "bg-green-500" : result === "draw" ? "bg-yellow-500" : "bg-red-500"}`}
                        title={result.charAt(0).toUpperCase() + result.slice(1)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
