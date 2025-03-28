-- Add realtime to existing tables
alter publication supabase_realtime add table movies;
alter publication supabase_realtime add table actors;
alter publication supabase_realtime add table directors;
alter publication supabase_realtime add table genres;
alter publication supabase_realtime add table countries;
alter publication supabase_realtime add table awards;
alter publication supabase_realtime add table movie_actors;
alter publication supabase_realtime add table movie_directors;
alter publication supabase_realtime add table movie_genres;
alter publication supabase_realtime add table movie_countries;
alter publication supabase_realtime add table movie_awards;

-- Add additional fields to movies table
ALTER TABLE movies ADD COLUMN IF NOT EXISTS imdb_id TEXT;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS plot TEXT;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS runtime INTEGER;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1);
