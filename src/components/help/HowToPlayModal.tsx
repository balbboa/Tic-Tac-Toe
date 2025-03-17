import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  HelpCircle,
  Gamepad2,
  Film,
  Trophy,
  Brain,
  Zap,
  Grid3X3,
} from "lucide-react";

interface HowToPlayModalProps {
  trigger?: React.ReactNode;
}

const HowToPlayModal = ({ trigger }: HowToPlayModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex gap-2">
            <HelpCircle className="h-4 w-4" />
            How to Play
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            How to Play Movie Tic-Tac-Toe
          </DialogTitle>
          <DialogDescription>
            Learn the rules and features of our movie-themed tic-tac-toe game
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="themes">Movie Themes</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="trivia">Trivia</TabsTrigger>
            <TabsTrigger value="ranked">Ranked Play</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Game Basics</h3>
                <p className="text-muted-foreground">
                  Movie Tic-Tac-Toe follows the classic tic-tac-toe rules with a
                  cinematic twist:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Players take turns placing X or O on a 3×3 grid</li>
                  <li>
                    The first player to align three of their marks horizontally,
                    vertically, or diagonally wins
                  </li>
                  <li>
                    If all cells are filled with no winner, the game is a draw
                  </li>
                  <li>
                    After each game, a movie trivia question appears for bonus
                    points
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Game Modes</h3>
                <p className="text-muted-foreground">
                  Choose from multiple ways to play:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>
                    <strong>Play with Friends</strong>: Invite friends using a
                    room code
                  </li>
                  <li>
                    <strong>Ranked Play</strong>: Compete against players of
                    similar skill level
                  </li>
                  <li>
                    <strong>Practice Mode</strong>: Play against AI opponents of
                    varying difficulty
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Steals Feature</h3>
                <p className="text-muted-foreground">
                  The steals feature adds a strategic element to the game:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Players have 3 steals per game</li>
                  <li>
                    Steals allow you to replace an opponent's piece with your
                    own
                  </li>
                  <li>
                    Toggle stealing mode to activate this feature during your
                    turn
                  </li>
                  <li>
                    Use steals strategically to block your opponent or create
                    winning combinations
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Grid3X3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Grid Builder</h3>
                <p className="text-muted-foreground">
                  Customize your game experience with the grid builder:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Players take turns selecting categories for each cell</li>
                  <li>
                    Choose from movies, actors, directors, genres, awards, and
                    studios
                  </li>
                  <li>
                    Create unique challenges by combining different categories
                  </li>
                  <li>Enable or disable this feature in the game settings</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Movie Themes</h3>
                <p className="text-muted-foreground">
                  Customize your game with different movie genre themes:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>
                    <strong>Sci-Fi</strong>: Futuristic designs with blue and
                    purple hues
                  </li>
                  <li>
                    <strong>Western</strong>: Rustic designs with amber and
                    brown tones
                  </li>
                  <li>
                    <strong>Fantasy</strong>: Magical designs with emerald and
                    teal colors
                  </li>
                  <li>
                    <strong>Horror</strong>: Spooky designs with dark and red
                    accents
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  Unlock new themes and game pieces by earning points through
                  gameplay and trivia.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trivia" className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Movie Trivia</h3>
                <p className="text-muted-foreground">
                  Test your movie knowledge and earn extra points:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>After each game, answer a movie trivia question</li>
                  <li>
                    Questions range from easy to hard difficulty with
                    corresponding point values
                  </li>
                  <li>Correct answers earn bonus points</li>
                  <li>
                    Points can be used to unlock new game pieces, boards, and
                    effects
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  You can also earn additional points by watching short ads in
                  the store section.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranked" className="mt-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ranked Play</h3>
                <p className="text-muted-foreground">
                  Compete against players of similar skill level:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>
                    Ranked games match you with players of similar skill level
                  </li>
                  <li>Win ranked games to climb the global leaderboard</li>
                  <li>
                    Earn more points for defeating higher-ranked opponents
                  </li>
                  <li>
                    Seasons reset periodically with special rewards for top
                    players
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  Your rank is determined by your win rate, number of games
                  played, and trivia performance.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;

const Users = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
