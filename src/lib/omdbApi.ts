import { supabase } from "./supabase";

const OMDB_API_KEY = "f1f56c8e"; // Free API key with limited requests

export interface OmdbMovieBasic {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface OmdbMovieDetailed {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// Search for movies using OMDB API directly
export const searchOmdbMovies = async (
  searchTerm: string,
): Promise<OmdbMovieBasic[]> => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`,
    );
    const data = await response.json();

    if (data.Response === "False") return [];
    return data.Search || [];
  } catch (error) {
    console.error("Error searching OMDB movies:", error);
    return [];
  }
};

// Get detailed movie info from OMDB API
export const getOmdbMovieDetails = async (
  imdbId: string,
): Promise<OmdbMovieDetailed | null> => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`,
    );
    const data = await response.json();

    if (data.Response === "False") return null;
    return data;
  } catch (error) {
    console.error("Error fetching OMDB movie details:", error);
    return null;
  }
};

// Import movie from OMDB to database
export const importMovieToDatabase = async (
  imdbId: string,
): Promise<string | null> => {
  try {
    // First check if movie already exists in database
    const { data: existingMovie } = await supabase
      .from("movies")
      .select("id")
      .eq("imdb_id", imdbId)
      .single();

    if (existingMovie) {
      console.log(`Movie with IMDB ID ${imdbId} already exists in database`);
      return existingMovie.id;
    }

    // Fetch movie details from OMDB
    const movieData = await getOmdbMovieDetails(imdbId);
    if (!movieData) throw new Error("Failed to fetch movie details");

    // Insert movie into database
    const { data: movie, error: movieError } = await supabase
      .from("movies")
      .insert({
        title: movieData.Title,
        year: parseInt(movieData.Year),
        image_url: movieData.Poster !== "N/A" ? movieData.Poster : null,
        imdb_id: movieData.imdbID,
        plot: movieData.Plot,
        runtime: movieData.Runtime ? parseInt(movieData.Runtime) : null,
        rating: movieData.imdbRating ? parseFloat(movieData.imdbRating) : null,
      })
      .select()
      .single();

    if (movieError) throw movieError;

    // Process actors
    if (movieData.Actors && movieData.Actors !== "N/A") {
      const actors = movieData.Actors.split(", ");
      for (const actorName of actors) {
        // Insert actor
        const { data: actor, error: actorError } = await supabase
          .from("actors")
          .upsert({ name: actorName })
          .select()
          .single();

        if (actorError) throw actorError;

        // Create relationship
        await supabase.from("movie_actors").upsert({
          movie_id: movie.id,
          actor_id: actor.id,
        });
      }
    }

    // Process director
    if (movieData.Director && movieData.Director !== "N/A") {
      const directors = movieData.Director.split(", ");
      for (const directorName of directors) {
        // Insert director
        const { data: director, error: directorError } = await supabase
          .from("directors")
          .upsert({ name: directorName })
          .select()
          .single();

        if (directorError) throw directorError;

        // Create relationship
        await supabase.from("movie_directors").upsert({
          movie_id: movie.id,
          director_id: director.id,
        });
      }
    }

    // Process genre
    if (movieData.Genre && movieData.Genre !== "N/A") {
      const genres = movieData.Genre.split(", ");
      for (const genreName of genres) {
        // Insert genre
        const { data: genre, error: genreError } = await supabase
          .from("genres")
          .upsert({ name: genreName })
          .select()
          .single();

        if (genreError) throw genreError;

        // Create relationship
        await supabase.from("movie_genres").upsert({
          movie_id: movie.id,
          genre_id: genre.id,
        });
      }
    }

    // Process country
    if (movieData.Country && movieData.Country !== "N/A") {
      const countries = movieData.Country.split(", ");
      for (const countryName of countries) {
        // Insert country
        const { data: country, error: countryError } = await supabase
          .from("countries")
          .upsert({ name: countryName })
          .select()
          .single();

        if (countryError) throw countryError;

        // Create relationship
        await supabase.from("movie_countries").upsert({
          movie_id: movie.id,
          country_id: country.id,
        });
      }
    }

    // Process awards
    if (movieData.Awards && movieData.Awards !== "N/A") {
      // Simple parsing of awards text
      const awardsText = movieData.Awards;

      // Check for Oscars
      if (
        awardsText.toLowerCase().includes("oscar") ||
        awardsText.toLowerCase().includes("academy award")
      ) {
        const isWinner = awardsText.toLowerCase().includes("won");
        const categories = [];

        // Try to determine categories
        if (awardsText.toLowerCase().includes("best picture")) {
          categories.push("Best Picture");
        }
        if (awardsText.toLowerCase().includes("best director")) {
          categories.push("Best Director");
        }
        if (awardsText.toLowerCase().includes("best actor")) {
          categories.push("Best Actor");
        }
        if (awardsText.toLowerCase().includes("best actress")) {
          categories.push("Best Actress");
        }
        if (awardsText.toLowerCase().includes("best supporting")) {
          categories.push("Best Supporting Role");
        }
        if (
          awardsText.toLowerCase().includes("best screenplay") ||
          awardsText.toLowerCase().includes("best writing")
        ) {
          categories.push("Best Screenplay");
        }
        if (
          awardsText.toLowerCase().includes("best visual") ||
          awardsText.toLowerCase().includes("best effects")
        ) {
          categories.push("Best Visual Effects");
        }

        // If no specific categories found but has Oscar mention, add generic
        if (categories.length === 0) {
          categories.push("Academy Award");
        }

        // Add each award category
        for (const category of categories) {
          // Insert award
          const { data: award, error: awardError } = await supabase
            .from("awards")
            .upsert({
              name: "Academy Award",
              category: category,
              year: parseInt(movieData.Year),
            })
            .select()
            .single();

          if (awardError) throw awardError;

          // Create relationship
          await supabase.from("movie_awards").upsert({
            movie_id: movie.id,
            award_id: award.id,
            status: isWinner ? "won" : "nominated",
          });
        }
      }
    }

    console.log(`Successfully imported movie: ${movieData.Title}`);
    return movie.id;
  } catch (error) {
    console.error("Error importing movie to database:", error);
    return null;
  }
};

// Seed database with popular movies
export const seedMovieDatabase = async (): Promise<void> => {
  const popularMovies = [
    // Oscar winners and nominees
    "tt1375666", // Inception
    "tt0068646", // The Godfather
    "tt0110912", // Pulp Fiction
    "tt0468569", // The Dark Knight
    "tt6751668", // Parasite
    "tt0111161", // The Shawshank Redemption
    "tt0245429", // Spirited Away
    "tt0133093", // The Matrix
    "tt3783958", // La La Land
    "tt0120338", // Titanic
    "tt0167260", // The Lord of the Rings: The Return of the King
    "tt0108052", // Schindler's List
    "tt0407887", // The Departed
    "tt0109830", // Forrest Gump
    "tt5580390", // The Shape of Water
    "tt0477348", // No Country for Old Men
    "tt4975722", // Moonlight
    "tt2562232", // Birdman
    "tt1663202", // The Revenant
    "tt2582802", // Whiplash
    "tt2278388", // The Grand Budapest Hotel
    "tt0816692", // Interstellar
    "tt5013056", // Dunkirk
    "tt1392190", // Mad Max: Fury Road
  ];

  console.log(
    `Starting to seed database with ${popularMovies.length} movies...`,
  );

  let successCount = 0;
  for (const imdbId of popularMovies) {
    const result = await importMovieToDatabase(imdbId);
    if (result) successCount++;
    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(
    `Database seeding complete. Successfully imported ${successCount}/${popularMovies.length} movies.`,
  );
};
