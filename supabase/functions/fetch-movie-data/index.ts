import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OMDB_API_KEY = "f1f56c8e"; // Free API key with limited requests

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { searchTerm, action } = await req.json();

    if (action === "search") {
      // Search for movies
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`,
      );
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (action === "fetch") {
      // Fetch movie details and store in database
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${searchTerm}&plot=full`,
      );
      const movieData = await response.json();

      if (movieData.Response === "True") {
        // Insert movie into database
        const { data: movie, error: movieError } = await supabase
          .from("movies")
          .upsert({
            title: movieData.Title,
            year: parseInt(movieData.Year),
            image_url: movieData.Poster !== "N/A" ? movieData.Poster : null,
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
          const hasOscar = awardsText.toLowerCase().includes("oscar");
          const isWinner = awardsText.toLowerCase().includes("won");

          if (hasOscar) {
            // Insert award
            const { data: award, error: awardError } = await supabase
              .from("awards")
              .upsert({
                name: "Academy Award",
                category: "Best Picture",
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

        return new Response(JSON.stringify({ success: true, movie }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        return new Response(
          JSON.stringify({ success: false, error: "Movie not found" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          },
        );
      }
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
