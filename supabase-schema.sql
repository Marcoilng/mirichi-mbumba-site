-- Create bookings table for TOUCH UP event
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  photo_url TEXT,
  event_id INTEGER NOT NULL DEFAULT 1,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_email_per_event UNIQUE (email, event_id)
);

-- Add RLS (Row Level Security)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read bookings (for counting)
CREATE POLICY "Allow read access" ON bookings
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert bookings
CREATE POLICY "Allow insert" ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster counting
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);

-- Function to get current booking count
CREATE OR REPLACE FUNCTION get_booking_count(event_id INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM bookings WHERE event_id = $1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if email already registered for event
CREATE OR REPLACE FUNCTION is_email_registered(email_param TEXT, event_id_param INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM bookings 
    WHERE email = email_param AND event_id = event_id_param
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to create booking with validation
CREATE OR REPLACE FUNCTION create_booking(
  ticket_code_param TEXT,
  full_name_param TEXT,
  email_param TEXT,
  phone_param TEXT,
  message_param TEXT,
  photo_url_param TEXT,
  event_id_param INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  current_count INTEGER;
  max_participants INTEGER DEFAULT 100;
  already_registered BOOLEAN;
BEGIN
  -- Check if email already registered
  already_registered := is_email_registered(email_param, event_id_param);
  IF already_registered THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email déjà enregistré pour cet événement');
  END IF;
  
  -- Check if event is full
  current_count := get_booking_count(event_id_param);
  IF current_count >= max_participants THEN
    RETURN jsonb_build_object('success', false, 'error', 'Événement complet');
  END IF;
  
  -- Insert booking
  INSERT INTO bookings (
    ticket_code, 
    full_name, 
    email, 
    phone, 
    message, 
    photo_url, 
    event_id
  ) VALUES (
    ticket_code_param,
    full_name_param,
    email_param,
    phone_param,
    message_param,
    photo_url_param,
    event_id_param
  );
  
  RETURN jsonb_build_object('success', true, 'ticket_code', ticket_code_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
