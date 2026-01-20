-- Create trigger function to auto-assign post numbers
CREATE OR REPLACE FUNCTION assign_post_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Get and increment the next_post_number for this project
  UPDATE project
  SET next_post_number = next_post_number + 1
  WHERE id = NEW.project_id
  RETURNING next_post_number - 1 INTO NEW.number;
  
  -- If no project found or number still null, default to 1
  IF NEW.number IS NULL THEN
    NEW.number := 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert on post
DROP TRIGGER IF EXISTS post_assign_number_trigger ON post;
CREATE TRIGGER post_assign_number_trigger
  BEFORE INSERT ON post
  FOR EACH ROW
  WHEN (NEW.number IS NULL)
  EXECUTE FUNCTION assign_post_number();

-- Backfill existing posts that have null numbers
WITH numbered_posts AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY project_id ORDER BY created_at) as new_number
  FROM post
  WHERE number IS NULL
)
UPDATE post
SET number = numbered_posts.new_number
FROM numbered_posts
WHERE post.id = numbered_posts.id;

-- Update project next_post_number to be max + 1 for each project
UPDATE project p
SET next_post_number = COALESCE(
  (SELECT MAX(number) + 1 FROM post WHERE project_id = p.id),
  1
);
