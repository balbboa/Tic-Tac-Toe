-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  game_type TEXT NOT NULL,
  status TEXT NOT NULL,
  winner TEXT,
  is_draw BOOLEAN DEFAULT FALSE,
  game_mode TEXT,
  total_points INTEGER DEFAULT 0,
  total_moves INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create game_moves table to track individual moves
CREATE TABLE IF NOT EXISTS game_moves (
  id SERIAL PRIMARY KEY,
  game_id TEXT REFERENCES games(id),
  user_id TEXT REFERENCES users(id),
  cell_index INTEGER NOT NULL,
  movie_id TEXT REFERENCES movies(id),
  player_mark TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  is_steal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table to track player statistics
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.name,
  u.avatar_url,
  s.games_played,
  s.games_won,
  s.total_points,
  s.highest_streak,
  CASE WHEN s.games_played > 0 THEN 
    ROUND((s.games_won::NUMERIC / s.games_played::NUMERIC) * 100, 2)
  ELSE 0 END AS win_percentage
FROM users u
LEFT JOIN user_stats s ON u.id = s.user_id
WHERE s.games_played > 0
ORDER BY s.total_points DESC;

-- Create function to get highest streak
CREATE OR REPLACE FUNCTION get_highest_streak(user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  highest INTEGER;
BEGIN
  SELECT highest_streak INTO highest FROM user_stats WHERE user_id = $1;
  RETURN COALESCE(highest, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to increment a value
CREATE OR REPLACE FUNCTION increment(x INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE($1, 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own games"
ON games FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
ON games FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
ON games FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own game moves"
ON game_moves FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game moves"
ON game_moves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own stats"
ON user_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
ON user_stats FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON user_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add realtime
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table game_moves;
alter publication supabase_realtime add table user_stats;
