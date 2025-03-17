-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actors table
CREATE TABLE IF NOT EXISTS actors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create directors table
CREATE TABLE IF NOT EXISTS directors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create studios table
CREATE TABLE IF NOT EXISTS studios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  flag TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create awards table
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction tables for many-to-many relationships

-- Movie-Actor relationship
CREATE TABLE IF NOT EXISTS movie_actors (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES actors(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, actor_id)
);

-- Movie-Director relationship
CREATE TABLE IF NOT EXISTS movie_directors (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  director_id UUID REFERENCES directors(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, director_id)
);

-- Movie-Studio relationship
CREATE TABLE IF NOT EXISTS movie_studios (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, studio_id)
);

-- Movie-Country relationship
CREATE TABLE IF NOT EXISTS movie_countries (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, country_id)
);

-- Movie-Genre relationship
CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

-- Movie-Award relationship
CREATE TABLE IF NOT EXISTS movie_awards (
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  award_id UUID REFERENCES awards(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('won', 'nominated')),
  PRIMARY KEY (movie_id, award_id)
);

-- Enable row-level security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_awards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public read access" ON movies;
CREATE POLICY "Public read access" ON movies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON actors;
CREATE POLICY "Public read access" ON actors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON directors;
CREATE POLICY "Public read access" ON directors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON studios;
CREATE POLICY "Public read access" ON studios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON countries;
CREATE POLICY "Public read access" ON countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON genres;
CREATE POLICY "Public read access" ON genres FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON awards;
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_actors;
CREATE POLICY "Public read access" ON movie_actors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_directors;
CREATE POLICY "Public read access" ON movie_directors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_studios;
CREATE POLICY "Public read access" ON movie_studios FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_countries;
CREATE POLICY "Public read access" ON movie_countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_genres;
CREATE POLICY "Public read access" ON movie_genres FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access" ON movie_awards;
CREATE POLICY "Public read access" ON movie_awards FOR SELECT USING (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table movies;
alter publication supabase_realtime add table actors;
alter publication supabase_realtime add table directors;
alter publication supabase_realtime add table studios;
alter publication supabase_realtime add table countries;
alter publication supabase_realtime add table genres;
alter publication supabase_realtime add table awards;
alter publication supabase_realtime add table movie_actors;
alter publication supabase_realtime add table movie_directors;
alter publication supabase_realtime add table movie_studios;
alter publication supabase_realtime add table movie_countries;
alter publication supabase_realtime add table movie_genres;
alter publication supabase_realtime add table movie_awards;