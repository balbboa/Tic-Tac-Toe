import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { importMovieToDatabase } from "./omdbApi";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface MovieDetails {
  id: string;
  title: string;
  year: number;
  image_url: string;
  imdb_id?: string;
  plot?: string;
  runtime?: number;
  rating?: number;
  actors: { id: string; name: string }[];
  directors: { id: string; name: string }[];
  genres: { id: string; name: string }[];
  countries: { id: string; name: string }[];
  awards: {
    id: string;
    name: string;
    category: string;
    status: "won" | "nominated";
  }[];
}

// Search for movies using OMDB API via Supabase Edge Function
export const searchMovies = async (
  searchTerm: string,
): Promise<MovieSearchResult[]> => {
  try {
    // First try to search in our database
    const { data: dbMovies, error: dbError } = await supabase
      .from("movies")
      .select("id, title, year, image_url, imdb_id")
      .ilike("title", `%${searchTerm}%`)
      .order("title", { ascending: true })
      .limit(10);

    if (dbError) throw dbError;

    if (dbMovies && dbMovies.length > 0) {
      // Transform to match MovieSearchResult interface
      return dbMovies.map((movie) => ({
        imdbID: movie.imdb_id || movie.id,
        Title: movie.title,
        Year: movie.year.toString(),
        Poster: movie.image_url || "N/A",
      }));
    }

    // If no results in database, try the edge function
    const { data, error } = await supabase.functions.invoke(
      "fetch-movie-data",
      {
        body: { searchTerm, action: "search" },
      },
    );

    if (error) throw error;
    if (data.Response === "False") return [];

    return data.Search || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

// Fetch movie details and store in database
export const fetchAndStoreMovie = async (
  imdbId: string,
): Promise<MovieDetails | null> => {
  try {
    // First check if movie already exists in our database
    const { data: existingMovie, error: existingError } = await supabase
      .from("movies")
      .select("id")
      .eq("imdb_id", imdbId)
      .single();

    if (!existingError && existingMovie) {
      // Movie already exists, get full details
      return await getMovieWithRelationships(existingMovie.id);
    }

    // If not in database, import it using our direct OMDB API function
    const movieId = await importMovieToDatabase(imdbId);
    if (!movieId) return null;

    // Get the full movie details with relationships
    return await getMovieWithRelationships(movieId);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

// Get movie with all its relationships
export const getMovieWithRelationships = async (
  movieId: string,
): Promise<MovieDetails | null> => {
  try {
    // Get movie basic info
    const { data: movie, error: movieError } = await supabase
      .from("movies")
      .select("*")
      .eq("id", movieId)
      .single();

    if (movieError) throw movieError;
    if (!movie) return null;

    // Get actors
    const { data: actorRelations, error: actorsError } = await supabase
      .from("movie_actors")
      .select("actor_id, actors(id, name)")
      .eq("movie_id", movieId);

    if (actorsError) throw actorsError;
    const actors = actorRelations.map((relation) => relation.actors);

    // Get directors
    const { data: directorRelations, error: directorsError } = await supabase
      .from("movie_directors")
      .select("director_id, directors(id, name)")
      .eq("movie_id", movieId);

    if (directorsError) throw directorsError;
    const directors = directorRelations.map((relation) => relation.directors);

    // Get genres
    const { data: genreRelations, error: genresError } = await supabase
      .from("movie_genres")
      .select("genre_id, genres(id, name)")
      .eq("movie_id", movieId);

    if (genresError) throw genresError;
    const genres = genreRelations.map((relation) => relation.genres);

    // Get countries
    const { data: countryRelations, error: countriesError } = await supabase
      .from("movie_countries")
      .select("country_id, countries(id, name)")
      .eq("movie_id", movieId);

    if (countriesError) throw countriesError;
    const countries = countryRelations.map((relation) => relation.countries);

    // Get awards
    const { data: awardRelations, error: awardsError } = await supabase
      .from("movie_awards")
      .select("award_id, status, awards(id, name, category)")
      .eq("movie_id", movieId);

    if (awardsError) throw awardsError;
    const awards = awardRelations.map((relation) => ({
      ...relation.awards,
      status: relation.status,
    }));

    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      image_url: movie.image_url,
      imdb_id: movie.imdb_id,
      plot: movie.plot,
      runtime: movie.runtime,
      rating: movie.rating,
      actors,
      directors,
      genres,
      countries,
      awards,
    };
  } catch (error) {
    console.error("Error getting movie with relationships:", error);
    return null;
  }
};

// Get all movies with basic info
export const getAllMovies = async () => {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error getting all movies:", error);
    return [];
  }
};

// Get movies by actor
export const getMoviesByActor = async (actorName: string) => {
  try {
    // First get the actor ID
    const { data: actor, error: actorError } = await supabase
      .from("actors")
      .select("id")
      .ilike("name", `%${actorName}%`)
      .single();

    if (actorError) throw actorError;
    if (!actor) return [];

    // Then get movies with this actor
    const { data: movieRelations, error: moviesError } = await supabase
      .from("movie_actors")
      .select("movie_id, movies(id, title, year, image_url)")
      .eq("actor_id", actor.id);

    if (moviesError) throw moviesError;
    return movieRelations.map((relation) => relation.movies) || [];
  } catch (error) {
    console.error("Error getting movies by actor:", error);
    return [];
  }
};

// Get movies by director
export const getMoviesByDirector = async (directorName: string) => {
  try {
    // First get the director ID
    const { data: director, error: directorError } = await supabase
      .from("directors")
      .select("id")
      .ilike("name", `%${directorName}%`)
      .single();

    if (directorError) throw directorError;
    if (!director) return [];

    // Then get movies with this director
    const { data: movieRelations, error: moviesError } = await supabase
      .from("movie_directors")
      .select("movie_id, movies(id, title, year, image_url)")
      .eq("director_id", director.id);

    if (moviesError) throw moviesError;
    return movieRelations.map((relation) => relation.movies) || [];
  } catch (error) {
    console.error("Error getting movies by director:", error);
    return [];
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreName: string) => {
  try {
    // First get the genre ID
    const { data: genre, error: genreError } = await supabase
      .from("genres")
      .select("id")
      .ilike("name", `%${genreName}%`)
      .single();

    if (genreError) throw genreError;
    if (!genre) return [];

    // Then get movies with this genre
    const { data: movieRelations, error: moviesError } = await supabase
      .from("movie_genres")
      .select("movie_id, movies(id, title, year, image_url)")
      .eq("genre_id", genre.id);

    if (moviesError) throw moviesError;
    return movieRelations.map((relation) => relation.movies) || [];
  } catch (error) {
    console.error("Error getting movies by genre:", error);
    return [];
  }
};

// Get movies that won specific award
export const getMoviesByAward = async (
  awardName: string,
  status: "won" | "nominated" = "won",
) => {
  try {
    // First get the award IDs
    const { data: awards, error: awardsError } = await supabase
      .from("awards")
      .select("id")
      .ilike("name", `%${awardName}%`);

    if (awardsError) throw awardsError;
    if (!awards || awards.length === 0) return [];

    const awardIds = awards.map((award) => award.id);

    // Then get movies with these awards and specified status
    const { data: movieRelations, error: moviesError } = await supabase
      .from("movie_awards")
      .select("movie_id, movies(id, title, year, image_url)")
      .in("award_id", awardIds)
      .eq("status", status);

    if (moviesError) throw moviesError;
    return movieRelations.map((relation) => relation.movies) || [];
  } catch (error) {
    console.error("Error getting movies by award:", error);
    return [];
  }
};
