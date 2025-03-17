-- Create increment function
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- Create get_highest_streak function
CREATE OR REPLACE FUNCTION get_highest_streak(user_id text)
RETURNS integer AS $$
DECLARE
  highest integer;
BEGIN
  SELECT highest_streak INTO highest FROM user_stats WHERE user_stats.user_id = $1;
  RETURN COALESCE(highest, 0);
END;
$$ LANGUAGE plpgsql;
