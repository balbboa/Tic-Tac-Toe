import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import {
  Film,
  Award,
  Clock,
  Check,
  X,
  Search,
  Trophy,
  Flag,
  User,
  Video,
  AlertTriangle,
  Coffee,
  Sparkles,
  Zap,
  Star,
  Flame,
  Gamepad2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { GameConfigOptions } from "./GameConfig";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

type Player = "X" | "O";
type BoardState = (string | null)[];
type GameStatus = "playing" | "won" | "draw" | null;
type MovieGenre =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "scifi"
  | "fantasy"
  | "western"
  | "thriller";

type OscarStatus = "won" | "nominated" | "none";

interface Movie {
  id: string;
  title: string;
  image: string;
  year: number;
  director: string;
  actors: string[];
  genre: MovieGenre[];
  awards: string[];
  studio: string;
  country: string;
  oscarStatus: OscarStatus;
}

interface BotMode {
  enabled: boolean;
  difficulty: "easy" | "medium" | "hard";
}

interface MovieTicTacToeProps {
  onGameEnd?: (winner: Player | "draw", pointsEarned: number) => void;
  onRestart?: () => void;
  currentPlayer?: Player;
  isPlayerTurn?: boolean;
  gameConfig?: GameConfigOptions;
  botMode?: BotMode;
}

const themes = {
  action: {
    background: "bg-gradient-to-r from-red-900 to-orange-800",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-blue-400",
    oColor: "text-red-400",
    winnerBg: "bg-gradient-to-r from-red-700 to-orange-600",
    iconColor: "text-red-500",
    playerXBg: "bg-blue-600",
    playerOBg: "bg-red-600",
    playerXCellBg: "bg-blue-900/40",
    playerOCellBg: "bg-red-900/40",
    hintBg: "bg-gradient-to-r from-gray-800 to-gray-900",
  },
  comedy: {
    background: "bg-gradient-to-r from-yellow-600 to-amber-500",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-blue-400",
    oColor: "text-amber-400",
    winnerBg: "bg-gradient-to-r from-yellow-500 to-amber-400",
    iconColor: "text-yellow-500",
    playerXBg: "bg-blue-600",
    playerOBg: "bg-amber-600",
    playerXCellBg: "bg-blue-900/40",
    playerOCellBg: "bg-amber-900/40",
    hintBg: "bg-gradient-to-r from-amber-800/70 to-amber-900/70",
  },
  drama: {
    background: "bg-gradient-to-r from-blue-900 to-indigo-800",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-cyan-400",
    oColor: "text-purple-400",
    winnerBg: "bg-gradient-to-r from-blue-700 to-indigo-600",
    iconColor: "text-blue-500",
    playerXBg: "bg-cyan-600",
    playerOBg: "bg-purple-600",
    playerXCellBg: "bg-cyan-900/40",
    playerOCellBg: "bg-purple-900/40",
    hintBg: "bg-gradient-to-r from-blue-800/70 to-indigo-900/70",
  },
  horror: {
    background: "bg-gradient-to-r from-gray-900 to-red-900",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-gray-400",
    oColor: "text-red-400",
    winnerBg: "bg-gradient-to-r from-red-800 to-gray-800",
    iconColor: "text-red-700",
    playerXBg: "bg-gray-600",
    playerOBg: "bg-red-600",
    playerXCellBg: "bg-gray-900/40",
    playerOCellBg: "bg-red-900/40",
    hintBg: "bg-gradient-to-r from-gray-800/70 to-red-900/70",
  },
  scifi: {
    background: "bg-gradient-to-r from-blue-900 to-purple-900",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-cyan-400",
    oColor: "text-fuchsia-400",
    winnerBg: "bg-gradient-to-r from-blue-600 to-purple-600",
    iconColor: "text-purple-500",
    playerXBg: "bg-cyan-600",
    playerOBg: "bg-fuchsia-600",
    playerXCellBg: "bg-cyan-900/40",
    playerOCellBg: "bg-fuchsia-900/40",
    hintBg: "bg-gradient-to-r from-blue-900/70 to-purple-900/70",
  },
  fantasy: {
    background: "bg-gradient-to-r from-emerald-900 to-teal-800",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-emerald-400",
    oColor: "text-amber-400",
    winnerBg: "bg-gradient-to-r from-emerald-700 to-teal-600",
    iconColor: "text-emerald-500",
    playerXBg: "bg-emerald-600",
    playerOBg: "bg-amber-600",
    playerXCellBg: "bg-emerald-900/40",
    playerOCellBg: "bg-amber-900/40",
    hintBg: "bg-gradient-to-r from-emerald-900/70 to-teal-900/70",
  },
  western: {
    background: "bg-gradient-to-r from-amber-800 to-yellow-700",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-amber-400",
    oColor: "text-red-400",
    winnerBg: "bg-gradient-to-r from-amber-700 to-red-700",
    iconColor: "text-amber-500",
    playerXBg: "bg-amber-600",
    playerOBg: "bg-red-600",
    playerXCellBg: "bg-amber-900/40",
    playerOCellBg: "bg-red-900/40",
    hintBg: "bg-gradient-to-r from-amber-900/70 to-yellow-900/70",
  },
  thriller: {
    background: "bg-gradient-to-r from-slate-900 to-gray-800",
    boardBg: "bg-black/80",
    cellBg: "bg-black/60",
    cellBorder: "border-gray-700",
    xColor: "text-blue-400",
    oColor: "text-orange-400",
    winnerBg: "bg-gradient-to-r from-slate-700 to-gray-600",
    iconColor: "text-slate-500",
    playerXBg: "bg-blue-600",
    playerOBg: "bg-orange-600",
    playerXCellBg: "bg-blue-900/40",
    playerOCellBg: "bg-orange-900/40",
    hintBg: "bg-gradient-to-r from-slate-900/70 to-gray-900/70",
  },
};

// Real movie data with Oscar status
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 2010,
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    genre: ["scifi", "action", "thriller"],
    awards: [
      "Academy Award for Best Visual Effects",
      "Academy Award for Best Cinematography",
    ],
    studio: "Warner Bros.",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "2",
    title: "The Godfather",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 1972,
    director: "Francis Ford Coppola",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    genre: ["drama", "crime"],
    awards: ["Academy Award for Best Picture", "Academy Award for Best Actor"],
    studio: "Paramount Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 1994,
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    genre: ["crime", "drama"],
    awards: ["Academy Award for Best Original Screenplay"],
    studio: "Miramax Films",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "4",
    title: "The Dark Knight",
    image:
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80",
    year: 2008,
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genre: ["action", "crime", "drama"],
    awards: ["Academy Award for Best Supporting Actor"],
    studio: "Warner Bros.",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "5",
    title: "Parasite",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 2019,
    director: "Bong Joon-ho",
    actors: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    genre: ["thriller", "drama", "comedy"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "CJ Entertainment",
    country: "South Korea",
    oscarStatus: "won",
  },
  {
    id: "6",
    title: "The Shawshank Redemption",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 1994,
    director: "Frank Darabont",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    genre: ["drama"],
    awards: ["Academy Award for Best Adapted Screenplay"],
    studio: "Columbia Pictures",
    country: "USA",
    oscarStatus: "nominated",
  },
  {
    id: "7",
    title: "Spirited Away",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2001,
    director: "Hayao Miyazaki",
    actors: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
    genre: ["fantasy", "adventure"],
    awards: ["Academy Award for Best Animated Feature"],
    studio: "Studio Ghibli",
    country: "Japan",
    oscarStatus: "won",
  },
  {
    id: "8",
    title: "The Matrix",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 1999,
    director: "The Wachowskis",
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    genre: ["scifi", "action"],
    awards: [
      "Academy Award for Best Visual Effects",
      "Academy Award for Best Film Editing",
    ],
    studio: "Warner Bros.",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "9",
    title: "La La Land",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2016,
    director: "Damien Chazelle",
    actors: ["Ryan Gosling", "Emma Stone", "John Legend"],
    genre: ["drama", "comedy", "romance"],
    awards: [
      "Academy Award for Best Director",
      "Academy Award for Best Actress",
    ],
    studio: "Summit Entertainment",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "10",
    title: "Titanic",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 1997,
    director: "James Cameron",
    actors: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    genre: ["drama", "romance"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "Paramount Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "11",
    title: "The Lord of the Rings: The Return of the King",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 2003,
    director: "Peter Jackson",
    actors: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    genre: ["fantasy", "adventure"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "New Line Cinema",
    country: "New Zealand",
    oscarStatus: "won",
  },
  {
    id: "12",
    title: "Schindler's List",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 1993,
    director: "Steven Spielberg",
    actors: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
    genre: ["drama", "history"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "Universal Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "13",
    title: "The Departed",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 2006,
    director: "Martin Scorsese",
    actors: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
    genre: ["crime", "drama", "thriller"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "Warner Bros.",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "14",
    title: "Forrest Gump",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 1994,
    director: "Robert Zemeckis",
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    genre: ["drama", "comedy"],
    awards: ["Academy Award for Best Picture", "Academy Award for Best Actor"],
    studio: "Paramount Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "15",
    title: "The Shape of Water",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2017,
    director: "Guillermo del Toro",
    actors: ["Sally Hawkins", "Michael Shannon", "Richard Jenkins"],
    genre: ["fantasy", "drama", "romance"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "Fox Searchlight Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "16",
    title: "No Country for Old Men",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 2007,
    director: "Coen Brothers",
    actors: ["Tommy Lee Jones", "Javier Bardem", "Josh Brolin"],
    genre: ["crime", "drama", "thriller"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Supporting Actor",
    ],
    studio: "Paramount Vantage",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "17",
    title: "Moonlight",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 2016,
    director: "Barry Jenkins",
    actors: ["Trevante Rhodes", "Mahershala Ali", "Naomie Harris"],
    genre: ["drama"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Supporting Actor",
    ],
    studio: "A24",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "18",
    title: "Birdman",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2014,
    director: "Alejandro González Iñárritu",
    actors: ["Michael Keaton", "Edward Norton", "Emma Stone"],
    genre: ["drama", "comedy"],
    awards: [
      "Academy Award for Best Picture",
      "Academy Award for Best Director",
    ],
    studio: "Fox Searchlight Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "19",
    title: "The Revenant",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 2015,
    director: "Alejandro González Iñárritu",
    actors: ["Leonardo DiCaprio", "Tom Hardy", "Domhnall Gleeson"],
    genre: ["action", "adventure", "drama"],
    awards: ["Academy Award for Best Actor", "Academy Award for Best Director"],
    studio: "20th Century Fox",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "20",
    title: "Whiplash",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 2014,
    director: "Damien Chazelle",
    actors: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
    genre: ["drama", "music"],
    awards: [
      "Academy Award for Best Supporting Actor",
      "Academy Award for Best Film Editing",
    ],
    studio: "Sony Pictures Classics",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "21",
    title: "The Grand Budapest Hotel",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2014,
    director: "Wes Anderson",
    actors: ["Ralph Fiennes", "F. Murray Abraham", "Mathieu Amalric"],
    genre: ["comedy", "adventure"],
    awards: [
      "Academy Award for Best Production Design",
      "Academy Award for Best Costume Design",
    ],
    studio: "Fox Searchlight Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "22",
    title: "Interstellar",
    image:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
    year: 2014,
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    genre: ["scifi", "adventure", "drama"],
    awards: ["Academy Award for Best Visual Effects"],
    studio: "Paramount Pictures",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "23",
    title: "Dunkirk",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    year: 2017,
    director: "Christopher Nolan",
    actors: ["Fionn Whitehead", "Tom Hardy", "Mark Rylance"],
    genre: ["action", "drama", "history"],
    awards: [
      "Academy Award for Best Film Editing",
      "Academy Award for Best Sound Mixing",
    ],
    studio: "Warner Bros.",
    country: "USA",
    oscarStatus: "won",
  },
  {
    id: "24",
    title: "Mad Max: Fury Road",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    year: 2015,
    director: "George Miller",
    actors: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    genre: ["action", "adventure", "scifi"],
    awards: [
      "Academy Award for Best Film Editing",
      "Academy Award for Best Production Design",
    ],
    studio: "Warner Bros.",
    country: "Australia",
    oscarStatus: "won",
  },
];

// Save game move to database
const saveGameMove = async (moveData: {
  cellIndex: number;
  movieId: string;
  player: Player;
  points: number;
  isSteal: boolean;
}) => {
  try {
    const { data, error } = await supabase.from("game_moves").insert([
      {
        game_id: gameId,
        user_id: user?.id || "guest",
        cell_index: moveData.cellIndex,
        movie_id: moveData.movieId,
        player_mark: moveData.player,
        points: moveData.points,
        is_steal: moveData.isSteal,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    console.log("Move saved to database", data);
  } catch (error) {
    console.error("Error saving move:", error);
  }
};

// Save game result to database
const saveGameResult = async (resultData: {
  winner: Player | "draw";
  points: number;
  moves: number;
  gameMode: string;
}) => {
  try {
    // Update the game record
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .update({
        status: "completed",
        winner: resultData.winner === "draw" ? null : resultData.winner,
        is_draw: resultData.winner === "draw",
        total_points: resultData.points,
        total_moves: resultData.moves,
        completed_at: new Date().toISOString(),
      })
      .eq("id", gameId);

    if (gameError) throw gameError;

    // Update user stats
    if (user?.id) {
      const { data: statsData, error: statsError } = await supabase
        .from("user_stats")
        .upsert([
          {
            user_id: user.id,
            games_played: supabase.rpc("increment", { x: 1 }),
            games_won:
              resultData.winner !== "draw" && resultData.winner === "X"
                ? supabase.rpc("increment", { x: 1 })
                : 0,
            total_points: supabase.rpc("increment", { x: resultData.points }),
            highest_streak: Math.max(
              streak,
              supabase.rpc("get_highest_streak", { user_id: user.id }),
            ),
          },
        ]);

      if (statsError) throw statsError;
    }

    console.log("Game result saved to database");
  } catch (error) {
    console.error("Error saving game result:", error);
  }
};

// Generate hints for the game based on game config categories and available movies
const generateHints = (gameConfig?: GameConfigOptions, moviesData: Movie[] = []) => {
  // Generate actor hints dynamically from available movies
  const getActorHints = () => {
    // Get all unique actors from real movies
    const allActors = new Set<string>();
    moviesData.forEach((movie) => {
      movie.actors.forEach((actor) => allActors.add(actor));
    });

    // Convert to array and sort by frequency in movies (most common first)
    const actorFrequency: Record<string, number> = {};
    moviesData.forEach((movie) => {
      movie.actors.forEach((actor) => {
        actorFrequency[actor] = (actorFrequency[actor] || 0) + 1;
      });
    });

    const sortedActors = Array.from(allActors)
      .sort((a, b) => (actorFrequency[b] || 0) - (actorFrequency[a] || 0))
      .slice(0, 20); // Take top 20 most frequent actors

    // Create actor hints
    return sortedActors.map((name) => ({
      type: "actor" as const,
      name,
      icon: <User className="h-6 w-6 text-blue-400" />,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, "")}`,
    }));
  };

  // Use provided movies if available, otherwise fallback to mock data
  const actorHints =
    moviesData.length > 0
      ? getActorHints()
      : [
          {
            type: "actor",
            name: "Leonardo DiCaprio",
            icon: <User className="h-6 w-6 text-blue-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=leo",
          },
          {
            type: "actor",
            name: "Tom Hanks",
            icon: <User className="h-6 w-6 text-blue-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tomhanks",
          },
          {
            type: "actor",
            name: "Emma Stone",
            icon: <User className="h-6 w-6 text-pink-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emmastone",
          },
          {
            type: "actor",
            name: "Keanu Reeves",
            icon: <User className="h-6 w-6 text-blue-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=keanu",
          },
          {
            type: "actor",
            name: "Charlize Theron",
            icon: <User className="h-6 w-6 text-pink-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlize",
          },
          {
            type: "actor",
            name: "Tom Hardy",
            icon: <User className="h-6 w-6 text-blue-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tomhardy",
          },
        ];

  // Generate director hints dynamically from available movies
  const getDirectorHints = () => {
    // Get all unique directors from real movies
    const allDirectors = new Set<string>();
    moviesData.forEach((movie) => {
      if (movie.director) allDirectors.add(movie.director);
    });

    // Convert to array and sort by frequency in movies (most common first)
    const directorFrequency: Record<string, number> = {};
    moviesData.forEach((movie) => {
      if (movie.director) {
        directorFrequency[movie.director] =
          (directorFrequency[movie.director] || 0) + 1;
      }
    });

    const sortedDirectors = Array.from(allDirectors)
      .sort((a, b) => (directorFrequency[b] || 0) - (directorFrequency[a] || 0))
      .slice(0, 15); // Take top 15 most frequent directors

    // Create director hints
    return sortedDirectors.map((name) => ({
      type: "director" as const,
      name,
      icon: <Video className="h-6 w-6 text-purple-400" />,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, "")}`,
    }));
  };

  // Use provided movies if available, otherwise fallback to mock data
  const directorHints =
    moviesData.length > 0
      ? getDirectorHints()
      : [
          {
            type: "director",
            name: "Christopher Nolan",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=nolan",
          },
          {
            type: "director",
            name: "Steven Spielberg",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=spielberg",
          },
          {
            type: "director",
            name: "Martin Scorsese",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=scorsese",
          },
          {
            type: "director",
            name: "Quentin Tarantino",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarantino",
          },
          {
            type: "director",
            name: "James Cameron",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=cameron",
          },
          {
            type: "director",
            name: "Peter Jackson",
            icon: <Video className="h-6 w-6 text-purple-400" />,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jackson",
          },
        ];

  // Generate genre hints dynamically from available movies
  const getGenreHints = () => {
    // Get all unique genres from real movies
    const allGenres = new Set<string>();
    moviesData.forEach((movie) => {
      movie.genre.forEach((genre) => allGenres.add(genre));
    });

    // Convert to array and sort by frequency in movies (most common first)
    const genreFrequency: Record<string, number> = {};
    moviesData.forEach((movie) => {
      movie.genre.forEach((genre) => {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
      });
    });

    const sortedGenres = Array.from(allGenres)
      .sort((a, b) => (genreFrequency[b] || 0) - (genreFrequency[a] || 0))
      .slice(0, 10); // Take top 10 most frequent genres

    // Map of genre names to icons and images
    const genreIcons: Record<string, { icon: JSX.Element; image: string }> = {
      action: {
        icon: <Zap className="h-6 w-6 text-red-400" />,
        image:
          "https://images.unsplash.com/photo-1571646750134-a6e652d52161?w=100&q=80",
      },
      drama: {
        icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
        image:
          "https://images.unsplash.com/photo-1581956752304-a0c8a4c05d1d?w=100&q=80",
      },
      scifi: {
        icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
        image:
          "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=100&q=80",
      },
      fantasy: {
        icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80",
      },
      comedy: {
        icon: <Coffee className="h-6 w-6 text-amber-400" />,
        image:
          "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=100&q=80",
      },
      thriller: {
        icon: <Flame className="h-6 w-6 text-orange-400" />,
        image:
          "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&q=80",
      },
      horror: {
        icon: <Flame className="h-6 w-6 text-red-600" />,
        image:
          "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&q=80",
      },
      crime: {
        icon: <AlertTriangle className="h-6 w-6 text-purple-400" />,
        image:
          "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&q=80",
      },
      adventure: {
        icon: <Sparkles className="h-6 w-6 text-blue-400" />,
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80",
      },
      romance: {
        icon: <Coffee className="h-6 w-6 text-pink-400" />,
        image:
          "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=100&q=80",
      },
    };

    // Create genre hints
    return sortedGenres.map((genre) => {
      const genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
      const iconData = genreIcons[genre] || {
        icon: <Film className="h-6 w-6 text-gray-400" />,
        image:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
      };

      return {
        type: "genre" as const,
        name: genreName,
        icon: iconData.icon,
        image: iconData.image,
      };
    });
  };

  // Use provided movies if available, otherwise fallback to mock data
  const genreHints =
    moviesData.length > 0
      ? getGenreHints()
      : [
          {
            type: "genre",
            name: "Action",
            icon: <Zap className="h-6 w-6 text-red-400" />,
            image:
              "https://images.unsplash.com/photo-1571646750134-a6e652d52161?w=100&q=80",
          },
          {
            type: "genre",
            name: "Drama",
            icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
            image:
              "https://images.unsplash.com/photo-1581956752304-a0c8a4c05d1d?w=100&q=80",
          },
          {
            type: "genre",
            name: "Sci-Fi",
            icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
            image:
              "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=100&q=80",
          },
          {
            type: "genre",
            name: "Fantasy",
            icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80",
          },
          {
            type: "genre",
            name: "Comedy",
            icon: <Coffee className="h-6 w-6 text-amber-400" />,
            image:
              "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=100&q=80",
          },
          {
            type: "genre",
            name: "Thriller",
            icon: <Flame className="h-6 w-6 text-orange-400" />,
            image:
              "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&q=80",
          },
        ];

  // Generate Oscar award hints (replacing general awards)
  const oscarHints = [
    {
      type: "oscar",
      name: "Won Oscar for Best Picture",
      icon: <Award className="h-6 w-6 text-amber-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
    {
      type: "oscar",
      name: "Won Oscar for Best Director",
      icon: <Award className="h-6 w-6 text-amber-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
    {
      type: "oscar",
      name: "Won Oscar for Best Actor",
      icon: <Award className="h-6 w-6 text-amber-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
    {
      type: "oscar",
      name: "Won Oscar for Best Visual Effects",
      icon: <Award className="h-6 w-6 text-amber-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
    {
      type: "oscar",
      name: "Nominated for Oscar",
      icon: <Award className="h-6 w-6 text-gray-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
    {
      type: "oscar",
      name: "Won Oscar for Best Screenplay",
      icon: <Award className="h-6 w-6 text-amber-400" />,
      image:
        "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&q=80",
    },
  ];

  // Generate studio hints
  const studioHints = [
    {
      type: "studio",
      name: "Warner Bros.",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
    {
      type: "studio",
      name: "Paramount Pictures",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
    {
      type: "studio",
      name: "Universal Pictures",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
    {
      type: "studio",
      name: "20th Century Fox",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
    {
      type: "studio",
      name: "Sony Pictures",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
    {
      type: "studio",
      name: "Disney",
      icon: <Film className="h-6 w-6 text-indigo-400" />,
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
    },
  ];

  // Generate country hints dynamically from available movies
  const getCountryHints = () => {
    // Get all unique countries from real movies
    const allCountries = new Set<string>();
    moviesData.forEach((movie) => {
      if (movie.country) allCountries.add(movie.country);
    });

    // Convert to array and sort by frequency in movies (most common first)
    const countryFrequency: Record<string, number> = {};
    moviesData.forEach((movie) => {
      if (movie.country) {
        countryFrequency[movie.country] =
          (countryFrequency[movie.country] || 0) + 1;
      }
    });

    const sortedCountries = Array.from(allCountries)
      .sort((a, b) => (countryFrequency[b] || 0) - (countryFrequency[a] || 0))
      .slice(0, 10); // Take top 10 most frequent countries

    // Map of country names to flags and images
    const countryFlags: Record<string, { flag: string; image: string }> = {
      USA: {
        flag: "🇺🇸",
        image:
          "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=100&q=80",
      },
      "United States": {
        flag: "🇺🇸",
        image:
          "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=100&q=80",
      },
      Japan: {
        flag: "🇯🇵",
        image:
          "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=100&q=80",
      },
      UK: {
        flag: "🇬🇧",
        image:
          "https://images.unsplash.com/photo-1543832923-44667a44c804?w=100&q=80",
      },
      "United Kingdom": {
        flag: "🇬🇧",
        image:
          "https://images.unsplash.com/photo-1543832923-44667a44c804?w=100&q=80",
      },
      France: {
        flag: "🇫🇷",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80",
      },
      "South Korea": {
        flag: "🇰🇷",
        image:
          "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=100&q=80",
      },
      Australia: {
        flag: "🇦🇺",
        image:
          "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&q=80",
      },
      Canada: {
        flag: "🇨🇦",
        image:
          "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=100&q=80",
      },
      Germany: {
        flag: "🇩🇪",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80",
      },
      Italy: {
        flag: "🇮🇹",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80",
      },
      Spain: {
        flag: "🇪🇸",
        image:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80",
      },
      "New Zealand": {
        flag: "🇳🇿",
        image:
          "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&q=80",
      },
    };

    // Create country hints
    return sortedCountries.map((country) => {
      const flagData = countryFlags[country] || {
        flag: "🏳️",
        image:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&q=80",
      };

      return {
        type: "country" as const,
        name: country,
        flag: flagData.flag,
        icon: <Flag className="h-6 w-6 text-blue-400" />,
        image: flagData.image,
      };
    });
  };

  // Use provided movies if available, otherwise fallback to mock data
  const countryHints =
    moviesData.length > 0
      ? getCountryHints()
      : [
          {
            type: "country",
            name: "USA",
            flag: "🇺🇸",
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            image:
              "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=100&q=80",
          },
          {
            type: "country",
            name: "Japan",
            flag: "🇯🇵",
            icon: <Flag className="h-6 w-6 text-red-400" />,
            image:
              "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=100&q=80",
          },
          {
            type: "country",
            name: "UK",
            flag: "🇬🇧",
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            image:
              "https://images.unsplash.com/photo-1543832923-44667a44c804?w=100&q=80",
          },
          {
            type: "country",
            name: "France",
            flag: "🇫🇷",
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            image:
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80",
          },
          {
            type: "country",
            name: "South Korea",
            flag: "🇰🇷",
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            image:
              "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=100&q=80",
          },
          {
            type: "country",
            name: "Australia",
            flag: "🇦🇺",
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            image:
              "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&q=80",
          },
        ];

  // Create arrays to hold available hint types based on game config
  const availableRowHints = [];
  const availableColHints = [];

  // Add hint types based on game config categories - only if they're explicitly enabled
  if (gameConfig?.categories?.actors) {
    availableRowHints.push(actorHints);
  }
  if (gameConfig?.categories?.genres) {
    availableRowHints.push(genreHints);
  }
  if (gameConfig?.categories?.studios) {
    availableRowHints.push(studioHints);
  }

  if (gameConfig?.categories?.directors) {
    availableColHints.push(directorHints);
  }
  if (gameConfig?.categories?.awards) {
    availableColHints.push(oscarHints); // Use Oscar hints instead of general awards
  }
  if (gameConfig?.categories?.countries) {
    availableColHints.push(countryHints);
  }

  // If no categories are selected, use default hints
  if (availableRowHints.length === 0) {
    availableRowHints.push(actorHints, genreHints);
  }
  if (availableColHints.length === 0) {
    availableColHints.push(directorHints, oscarHints);
  }

  // Instead of random selection, we'll create a valid combination
  // that ensures there's at least one movie that matches each cell

  // First, select hint types for rows and columns (up to 3, or fewer if not enough categories)
  const rowHintTypes = availableRowHints
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(3, availableRowHints.length));
  const colHintTypes = availableColHints
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(3, availableColHints.length));

  // Create a grid to track valid combinations
  const validCombinations = Array(9).fill(0);
  let rowHints = [];
  let colHints = [];

  // Try to find valid combinations
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    // Select one hint from each selected type
    rowHints = rowHintTypes.map(
      (hintType) => hintType[Math.floor(Math.random() * hintType.length)],
    );
    colHints = colHintTypes.map(
      (hintType) => hintType[Math.floor(Math.random() * hintType.length)],
    );

    // Check if each cell has at least one valid movie
    let allCellsValid = true;

    for (let row = 0; row < rowHints.length; row++) {
      for (let col = 0; col < colHints.length; col++) {
        const cellIndex = row * colHints.length + col;
        const rowHint = rowHints[row];
        const colHint = colHints[col];

        // Find if any movie matches both hints
        const validMovies = mockMovies.filter((movie) => {
          let matchesRowHint = false;
          let matchesColHint = false;

          // Check row hint
          if (rowHint.type === "actor") {
            matchesRowHint = movie.actors.includes(rowHint.name);
          } else if (rowHint.type === "genre") {
            matchesRowHint = movie.genre.includes(
              rowHint.name.toLowerCase() as MovieGenre,
            );
          } else if (rowHint.type === "studio") {
            matchesRowHint = movie.studio === rowHint.name;
          }

          // Check column hint
          if (colHint.type === "director") {
            matchesColHint = movie.director === colHint.name;
          } else if (colHint.type === "oscar") {
            if (colHint.name === "Won Oscar for Best Picture") {
              matchesColHint = movie.awards.includes(
                "Academy Award for Best Picture",
              );
            } else if (colHint.name === "Won Oscar for Best Director") {
              matchesColHint = movie.awards.includes(
                "Academy Award for Best Director",
              );
            } else if (colHint.name === "Won Oscar for Best Actor") {
              matchesColHint = movie.awards.includes(
                "Academy Award for Best Actor",
              );
            } else if (colHint.name === "Won Oscar for Best Visual Effects") {
              matchesColHint = movie.awards.includes(
                "Academy Award for Best Visual Effects",
              );
            } else if (colHint.name === "Nominated for Oscar") {
              matchesColHint = movie.oscarStatus === "nominated";
            } else if (colHint.name === "Won Oscar for Best Screenplay") {
              matchesColHint =
                movie.awards.includes(
                  "Academy Award for Best Original Screenplay",
                ) ||
                movie.awards.includes(
                  "Academy Award for Best Adapted Screenplay",
                );
            }
          } else if (colHint.type === "country") {
            matchesColHint = movie.country === colHint.name;
          }

          return matchesRowHint && matchesColHint;
        });

        validCombinations[cellIndex] = validMovies.length;

        if (validMovies.length === 0) {
          allCellsValid = false;
        }
      }
    }

    if (allCellsValid) {
      break;
    }

    attempts++;
  }

  // If we couldn't find valid combinations for all cells, use default hints
  // that we know work with our movie dataset
  if (attempts >= maxAttempts) {
    return {
      rowHints: [
        {
          type: "actor",
          name: "Leonardo DiCaprio",
          icon: <User className="h-4 w-4 text-blue-400" />,
        },
        {
          type: "genre",
          name: "Drama",
          icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
        },
        {
          type: "studio",
          name: "Warner Bros.",
          icon: <Film className="h-4 w-4 text-indigo-400" />,
        },
      ],
      colHints: [
        {
          type: "director",
          name: "Christopher Nolan",
          icon: <Video className="h-4 w-4 text-purple-400" />,
        },
        {
          type: "oscar",
          name: "Won Oscar for Best Picture",
          icon: <Award className="h-4 w-4 text-amber-400" />,
        },
        {
          type: "country",
          name: "USA",
          flag: "🇺🇸",
          icon: <Flag className="h-4 w-4 text-blue-400" />,
        },
      ],
    };
  }

  return {
    rowHints,
    colHints,
  };
};

const MovieTicTacToe = ({
  onGameEnd = () => {},
  onRestart = () => {},
  currentPlayer = "X",
  isPlayerTurn = true,
  gameConfig,
  botMode,
}: MovieTicTacToeProps) => {
  // Get user from auth context
  const { user } = useAuth();
  const [gameId] = useState(
    `game_${Math.random().toString(36).substring(2, 9)}`,
  );
  const [realMovies, setRealMovies] = useState<Movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  // Fetch real movies from database
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoadingMovies(true);
      try {
        // First try to get movies from the database
        const { data: moviesData, error } = await supabase
          .from("movies")
          .select(
            `
            id,
            title,
            year,
            image_url,
            imdb_id,
            plot,
            runtime,
            rating,
            movie_actors(actors(name)),
            movie_directors(directors(name)),
            movie_genres(genres(name)),
            movie_countries(countries(name)),
            movie_awards(awards(name, category), status)
          `,
          )
          .order("title", { ascending: true })
          .limit(50); // Limit to 50 movies for performance

        if (error) throw error;

        if (moviesData && moviesData.length > 0) {
          // Transform the data to match our Movie interface
          const transformedMovies: Movie[] = moviesData.map((movie) => {
            // Extract studio from production company if available
            let studio = "Unknown Studio";
            if (movie.movie_directors && movie.movie_directors.length > 0) {
              // Just use director name as a fallback for studio
              studio = movie.movie_directors[0].directors.name + " Productions";
            }

            return {
              id: movie.id,
              title: movie.title,
              image:
                movie.image_url ||
                `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80`,
              year: movie.year,
              director:
                movie.movie_directors?.[0]?.directors?.name ||
                "Unknown Director",
              actors: movie.movie_actors?.map((a) => a.actors.name) || [],
              genre: (movie.movie_genres?.map((g) =>
                g.genres.name.toLowerCase(),
              ) as MovieGenre[]) || ["drama"],
              awards:
                movie.movie_awards?.map(
                  (a) => `Academy Award for ${a.awards.category}`,
                ) || [],
              studio: studio,
              country: movie.movie_countries?.[0]?.countries?.name || "USA",
              oscarStatus: movie.movie_awards?.some((a) => a.status === "won")
                ? "won"
                : movie.movie_awards?.some((a) => a.status === "nominated")
                  ? "nominated"
                  : "none",
            };
          });

          console.log(
            `Loaded ${transformedMovies.length} movies from database`,
          );
          setRealMovies(transformedMovies);
          // Update hints with real movie data
          setHints(generateHints(gameConfig, transformedMovies));
        } else {
          console.log("No movies found in database, using mock data");
          // If no movies in database, use mock data
          setRealMovies(mockMovies);
          // Update hints with mock movie data
          setHints(generateHints(gameConfig, mockMovies));
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        // Fallback to mock data
        setRealMovies(mockMovies);
        // Update hints with mock movie data
        setHints(generateHints(gameConfig, mockMovies));
      } finally {
        setIsLoadingMovies(false);
      }
    };

    // Create a new game record in the database
    const createGameRecord = async () => {
      try {
        const { data, error } = await supabase.from("games").insert([
          {
            id: gameId,
            user_id: user?.id || "guest",
            game_type: "movie_tictactoe",
            status: "playing",
            game_mode: gameConfig?.movieGenre || "action",
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        console.log("Game record created", data);
      } catch (error) {
        console.error("Error creating game record:", error);
      }
    };

    fetchMovies();
    if (user) createGameRecord();
  }, [gameId, user, gameConfig]);
  // Apply game configuration if provided
  const defaultTimeLimit = {
    quick: 15,
    normal: 40,
    extended: 60,
    unlimited: 999,
  };

  const getInitialTimeLimit = () => {
    if (!gameConfig?.timeLimit) return 60;
    return defaultTimeLimit[gameConfig.timeLimit];
  };

  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [playerMarks, setPlayerMarks] = useState<(Player | null)[]>(
    Array(9).fill(null),
  );
  const [player, setPlayer] = useState<Player>(currentPlayer);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(
    null,
  );
  const [timeLeft, setTimeLeft] = useState(getInitialTimeLimit());
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<number | null>(null);
  const [lastIncorrect, setLastIncorrect] = useState<number | null>(null);
  const [hints, setHints] = useState(generateHints(gameConfig, mockMovies));
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre>(
    (gameConfig?.movieGenre as MovieGenre) || "action",
  );
  const [showTurnIndicator, setShowTurnIndicator] = useState(false);
  const [stealsRemaining, setStealsRemaining] = useState(
    gameConfig?.enableSteals ? 3 : 0,
  );
  const [canSteal, setCanSteal] = useState(gameConfig?.enableSteals || false);
  const [showConfetti, setShowConfetti] = useState(false);

  const theme = themes[selectedGenre];

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    if (gameConfig?.timeLimit === "unlimited") return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    if (
      gameStatus === "won" ||
      gameStatus === "draw" ||
      gameConfig?.timeLimit === "unlimited"
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up, switch turns
          setPlayer(player === "X" ? "O" : "X");
          setShowTurnIndicator(true);
          setTimeout(() => setShowTurnIndicator(false), 1500);
          return getInitialTimeLimit(); // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, player, gameConfig?.timeLimit]);

  const checkWinner = (
    boardState: BoardState,
    currentPlayer: Player,
  ): [GameStatus, number[] | null] => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      // Check if all cells in the pattern are filled
      if (boardState[a] && boardState[b] && boardState[c]) {
        // Check if all cells belong to the same player
        if (
          playerMarks[a] === currentPlayer &&
          playerMarks[b] === currentPlayer &&
          playerMarks[c] === currentPlayer
        ) {
          // Check if they're different movies
          if (
            boardState[a] !== boardState[b] &&
            boardState[b] !== boardState[c] &&
            boardState[a] !== boardState[c]
          ) {
            console.log("Winner found!", pattern, currentPlayer);
            return ["won", pattern];
          }
        }
      }
    }

    // Check for draw
    if (boardState.every((cell) => cell !== null)) {
      console.log("Game is a draw!");
      return ["draw", null];
    }

    return ["playing", null];
  };

  // Check if the movie matches the hints for the cell position
  const checkMovieMatchesHints = (movie: Movie, cellIndex: number) => {
    // Determine row and column of the cell
    const row = Math.floor(cellIndex / 3); // 0, 1, or 2
    const col = cellIndex % 3; // 0, 1, or 2

    // Get the hints for this row and column
    const rowHint = hints.rowHints[row];
    const colHint = hints.colHints[col];

    // Check if the movie matches both hints
    let matchesRowHint = false;
    let matchesColHint = false;

    // Check row hint
    if (rowHint.type === "actor") {
      matchesRowHint = movie.actors.includes(rowHint.name);
    } else if (rowHint.type === "genre") {
      matchesRowHint = movie.genre.includes(
        rowHint.name.toLowerCase() as MovieGenre,
      );
    } else if (rowHint.type === "studio") {
      matchesRowHint = movie.studio === rowHint.name;
    }

    // Check column hint
    if (colHint.type === "director") {
      matchesColHint = movie.director === colHint.name;
    } else if (colHint.type === "oscar") {
      // Handle Oscar-specific hints
      if (colHint.name === "Won Oscar for Best Picture") {
        matchesColHint = movie.awards.includes(
          "Academy Award for Best Picture",
        );
      } else if (colHint.name === "Won Oscar for Best Director") {
        matchesColHint = movie.awards.includes(
          "Academy Award for Best Director",
        );
      } else if (colHint.name === "Won Oscar for Best Actor") {
        matchesColHint = movie.awards.includes("Academy Award for Best Actor");
      } else if (colHint.name === "Won Oscar for Best Visual Effects") {
        matchesColHint = movie.awards.includes(
          "Academy Award for Best Visual Effects",
        );
      } else if (colHint.name === "Nominated for Oscar") {
        matchesColHint = movie.oscarStatus === "nominated";
      } else if (colHint.name === "Won Oscar for Best Screenplay") {
        matchesColHint =
          movie.awards.includes("Academy Award for Best Original Screenplay") ||
          movie.awards.includes("Academy Award for Best Adapted Screenplay");
      }
    } else if (colHint.type === "country") {
      matchesColHint = movie.country === colHint.name;
    }

    console.log(`Checking movie ${movie.title} for cell ${cellIndex}:`, {
      rowHint,
      colHint,
      matchesRowHint,
      matchesColHint,
    });

    return matchesRowHint && matchesColHint;
  };

  const handleCellClick = (index: number) => {
    console.log("Cell clicked:", index);
    if (gameStatus === "won" || gameStatus === "draw" || !isPlayerTurn) {
      console.log("Game over or not player turn");
      return;
    }

    // If the cell already has a value and canSteal is true, allow stealing
    if (board[index] && canSteal && stealsRemaining > 0) {
      console.log("Stealing cell");
      setSelectedCell(index);
      setOpenPopover(true);
      setSearchTerm("");
      return;
    }

    // If cell is already filled and can't steal, do nothing
    if (board[index] && (!canSteal || stealsRemaining <= 0)) {
      console.log("Cell already filled and can't steal");
      return;
    }

    console.log("Opening popover for cell", index);
    setSelectedCell(index);
    setOpenPopover(true);
    setSearchTerm("");
  };

  const handleMovieSelect = (movie: Movie) => {
    if (selectedCell === null) return;

    // Check if this is a steal move
    const isStealMove = board[selectedCell] !== null;

    // Check if the movie matches the hints for this cell
    const isCorrectAnswer = checkMovieMatchesHints(movie, selectedCell);

    if (!isCorrectAnswer) {
      // Incorrect answer
      setLastIncorrect(selectedCell);
      setStreak(0);
      setOpenPopover(false);
      setSelectedCell(null);

      // Switch turns on incorrect selection
      setPlayer(player === "X" ? "O" : "X");
      setShowTurnIndicator(true);
      setTimeout(() => setShowTurnIndicator(false), 1500);
      setTimeLeft(getInitialTimeLimit()); // Reset timer
      return;
    }

    // Update the board with the correct answer
    const newBoard = [...board];
    newBoard[selectedCell] = movie.title;
    setBoard(newBoard);

    // Store which player placed this movie
    const newPlayerMarks = [...playerMarks];
    newPlayerMarks[selectedCell] = player;
    setPlayerMarks(newPlayerMarks);

    // If it was a steal, reduce steals remaining
    if (isStealMove) {
      setStealsRemaining((prev) => prev - 1);
    }

    // Calculate points for this move
    const movePoints = 50 + streak * 10;

    // Update score
    setScore((prev) => prev + movePoints);
    setStreak((prev) => prev + 1);
    setLastCorrect(selectedCell);
    setLastIncorrect(null);

    // Check for winner
    const [status, winningPattern] = checkWinner(newBoard, player);
    console.log("Game status after move:", status, winningPattern);

    // Set game status and winning combination
    setGameStatus(status);
    setWinningCombination(winningPattern);

    if (status === "playing") {
      // Continue game - switch turns
      setPlayer(player === "X" ? "O" : "X");
      setShowTurnIndicator(true);
      setTimeout(() => setShowTurnIndicator(false), 1500);
      setTimeLeft(getInitialTimeLimit()); // Reset timer

      // Save move to database
      saveGameMove({
        cellIndex: selectedCell,
        movieId: movie.id,
        player: player,
        points: movePoints,
        isSteal: isStealMove,
      });
    } else if (status === "won") {
      // Game won - show celebration and call onGameEnd
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Save game result to database
      const finalPoints = calculatePoints(true);
      saveGameResult({
        winner: player,
        points: finalPoints,
        moves: newBoard.filter((cell) => cell !== null).length,
        gameMode: gameConfig?.movieGenre || "action",
      });

      // CRITICAL: Call onGameEnd to properly end the game with a slight delay
      // to ensure the winning state is properly displayed
      console.log("Game won by player", player);
      setTimeout(() => {
        onGameEnd(player, finalPoints);
      }, 2000);
    } else if (status === "draw") {
      // Game draw - call onGameEnd
      console.log("Game ended in draw");

      // Save game result to database
      const finalPoints = calculatePoints(false);
      saveGameResult({
        winner: "draw",
        points: finalPoints,
        moves: newBoard.filter((cell) => cell !== null).length,
        gameMode: gameConfig?.movieGenre || "action",
      });

      setTimeout(() => {
        onGameEnd("draw", finalPoints);
      }, 2000);
    }

    setOpenPopover(false);
    setSelectedCell(null);
  };

  const handleIncorrectSelection = () => {
    if (selectedCell === null) return;

    setLastIncorrect(selectedCell);
    setStreak(0);
    setOpenPopover(false);
    setSelectedCell(null);

    // Switch turns on incorrect selection
    setPlayer(player === "X" ? "O" : "X");
    setShowTurnIndicator(true);
    setTimeout(() => setShowTurnIndicator(false), 1500);
    setTimeLeft(getInitialTimeLimit()); // Reset timer
  };

  const calculatePoints = (isWinner: boolean): number => {
    const basePoints = 100;
    const timeBonus = Math.floor(timeLeft * 0.5);
    const streakBonus = streak * 10;

    return isWinner
      ? basePoints + timeBonus + streakBonus + 50
      : Math.floor((basePoints + timeBonus + streakBonus) / 2);
  };

  // Render column hints above the board
  const renderColumnHints = () => (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {hints.colHints.map((hint, i) => (
        <div
          key={i}
          className={`${theme.hintBg} aspect-square rounded-lg shadow-lg flex flex-col items-center justify-center p-2`}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black/30 flex items-center justify-center mb-2">
            {hint.image ? (
              <img
                src={hint.image}
                alt={hint.name}
                className="w-full h-full object-cover"
              />
            ) : (
              hint.icon
            )}
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1 bg-black/30 text-white flex items-center gap-1 w-full justify-center text-xs font-medium"
          >
            {hint.type === "country" ? `${hint.flag} ${hint.name}` : hint.name}
          </Badge>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`w-full h-screen overflow-hidden mx-auto rounded-lg p-6 ${theme.background}`}
    >
      {showTurnIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full z-50 flex items-center gap-2"
        >
          <span className="text-lg font-bold">
            {player === "X" ? "Player X's turn" : "Player O's turn"}
          </span>
          {player === "X" ? (
            <User className={`h-5 w-5 ${theme.xColor}`} />
          ) : (
            <User className={`h-5 w-5 ${theme.oColor}`} />
          )}
        </motion.div>
      )}

      {gameStatus === "won" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-4 p-4 rounded-lg ${theme.winnerBg} text-white flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">
              {player === "X" ? "Player X won!" : "Player O won!"}
            </span>
          </div>
          <Button
            onClick={onRestart}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 border-white/40"
          >
            Play Again
          </Button>
        </motion.div>
      )}

      {gameStatus === "draw" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 rounded-lg bg-gray-700 text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Flag className="h-6 w-6" />
            <span className="text-xl font-bold">Game ended in a draw!</span>
          </div>
          <Button
            onClick={onRestart}