import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Loader2,
  Search,
  Database,
  Film,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  searchMovies,
  fetchAndStoreMovie,
  MovieSearchResult,
} from "../../lib/movieApi";
import { seedMovieDatabase, searchOmdbMovies } from "../../lib/omdbApi";

const MovieDataImporter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedMovies, setImportedMovies] = useState<string[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setMessage(null);

    try {
      // First try to search in our database
      const dbResults = await searchMovies(searchTerm);

      // If no results in database, try OMDB API directly
      let results = dbResults;
      if (dbResults.length === 0) {
        const omdbResults = await searchOmdbMovies(searchTerm);
        results = omdbResults;
      }

      setSearchResults(results);

      if (results.length === 0) {
        setMessage({
          type: "info",
          text: "No movies found matching your search.",
        });
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMessage({
        type: "error",
        text: "Failed to search movies. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (movie: MovieSearchResult) => {
    setIsImporting(true);
    setImportingId(movie.imdbID);
    setMessage(null);

    try {
      const result = await fetchAndStoreMovie(movie.imdbID);

      if (result) {
        setImportedMovies((prev) => [...prev, movie.imdbID]);
        setMessage({
          type: "success",
          text: `Successfully imported "${movie.Title}" to database!`,
        });
      } else {
        setMessage({
          type: "error",
          text: `Failed to import "${movie.Title}". Please try again.`,
        });
      }
    } catch (error) {
      console.error("Error importing movie:", error);
      setMessage({
        type: "error",
        text: `Error importing "${movie.Title}". Please try again.`,
      });
    } finally {
      setIsImporting(false);
      setImportingId(null);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setMessage({
      type: "info",
      text: "Seeding database with popular movies. This may take a few minutes...",
    });
    setSeedProgress(0);

    try {
      // We can't directly track progress from the seedMovieDatabase function
      // So we'll simulate progress updates
      const progressInterval = setInterval(() => {
        setSeedProgress((prev) => {
          if (prev >= 95) return prev; // Cap at 95% until complete
          return prev + Math.random() * 5;
        });
      }, 1000);

      await seedMovieDatabase();
      clearInterval(progressInterval);
      setSeedProgress(100);

      setMessage({
        type: "success",
        text: "Database successfully seeded with popular movies!",
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      setMessage({
        type: "error",
        text: "An error occurred while seeding the database.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Movie Database Importer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search for movies to import..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isSearching}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Search Results</h3>
              <Button
                variant="outline"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="gap-2"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Seeding Database
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Seed Database with Popular Movies
                  </>
                )}
              </Button>
            </div>

            {isSeeding && (
              <div className="space-y-2">
                <Progress value={seedProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {seedProgress < 100
                    ? "Importing movies..."
                    : "Import complete!"}
                </p>
              </div>
            )}

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                {message.type === "error" && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message.type === "success" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {message.type === "info" && <AlertCircle className="h-4 w-4" />}
                <AlertTitle>
                  {message.type === "error"
                    ? "Error"
                    : message.type === "success"
                      ? "Success"
                      : "Information"}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              {searchResults.length > 0
                ? searchResults.map((movie) => (
                    <div
                      key={movie.imdbID}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {movie.Poster && movie.Poster !== "N/A" ? (
                          <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-12 h-16 object-cover rounded-sm"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-muted flex items-center justify-center rounded-sm">
                            <Film className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{movie.Title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{movie.Year}</span>
                            <Badge variant="outline" className="text-xs">
                              IMDB: {movie.imdbID}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {importedMovies.includes(movie.imdbID) ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Imported
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleImport(movie)}
                          disabled={isImporting}
                        >
                          {isImporting && importingId === movie.imdbID ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Importing
                            </>
                          ) : (
                            "Import"
                          )}
                        </Button>
                      )}
                    </div>
                  ))
                : !isSearching &&
                  searchTerm && (
                    <div className="text-center py-8 text-muted-foreground">
                      {message?.type === "info"
                        ? message.text
                        : "Search for movies to import them to the database"}
                    </div>
                  )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieDataImporter;
