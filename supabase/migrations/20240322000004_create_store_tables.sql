-- Create store_items table
CREATE TABLE IF NOT EXISTS store_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_items table to track which items users have unlocked
CREATE TABLE IF NOT EXISTS user_items (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  item_id TEXT REFERENCES store_items(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, item_id)
);

-- Create user_points table to track user's store points
CREATE TABLE IF NOT EXISTS user_points (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create point_transactions table to track point history
CREATE TABLE IF NOT EXISTS point_transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Store items are viewable by everyone"
ON store_items FOR SELECT
USING (true);

CREATE POLICY "Users can view their own items"
ON user_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
ON user_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
ON user_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own points"
ON user_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
ON point_transactions FOR SELECT
USING (auth.uid() = user_id);

-- Add realtime
alter publication supabase_realtime add table user_items;
alter publication supabase_realtime add table user_points;

-- Insert some initial store items
INSERT INTO store_items (id, name, type, rarity, description, cost, image) VALUES
('p1', 'Sci-Fi X', 'piece', 'rare', 'A futuristic X piece with glowing blue edges', 200, 'https://api.dicebear.com/7.x/shapes/svg?seed=scifi-x'),
('p2', 'Western O', 'piece', 'common', 'A rustic O piece with a lasso design', 100, 'https://api.dicebear.com/7.x/shapes/svg?seed=western-o'),
('p3', 'Fantasy X', 'piece', 'epic', 'A magical X piece with mystical runes', 300, 'https://api.dicebear.com/7.x/shapes/svg?seed=fantasy-x'),
('p4', 'Horror O', 'piece', 'legendary', 'A spooky O piece with eerie details', 500, 'https://api.dicebear.com/7.x/shapes/svg?seed=horror-o'),
('b1', 'Sci-Fi Board', 'board', 'epic', 'A high-tech board with neon grid lines', 400, 'https://api.dicebear.com/7.x/identicon/svg?seed=scifi-board'),
('b2', 'Western Board', 'board', 'rare', 'A dusty saloon-themed game board', 250, 'https://api.dicebear.com/7.x/identicon/svg?seed=western-board'),
('b3', 'Fantasy Board', 'board', 'legendary', 'An enchanted forest game board', 600, 'https://api.dicebear.com/7.x/identicon/svg?seed=fantasy-board'),
('e1', 'Victory Explosion', 'effect', 'common', 'A colorful explosion effect when you win', 150, 'https://api.dicebear.com/7.x/identicon/svg?seed=victory-effect'),
('e2', 'Dramatic Zoom', 'effect', 'rare', 'A cinematic zoom effect for winning moves', 300, 'https://api.dicebear.com/7.x/identicon/svg?seed=zoom-effect');
