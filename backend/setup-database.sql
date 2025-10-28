-- BookIt Database Setup Script
-- Run this in pgAdmin Query Tool after creating the 'bookit_db' database

-- Create database tables for BookIt application

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    border_color VARCHAR(50) NOT NULL CHECK (border_color IN ('pink', 'yellow', 'blue', 'green')),
    about TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience slots table
CREATE TABLE IF NOT EXISTS experience_slots (
    id VARCHAR(255) PRIMARY KEY,
    experience_id VARCHAR(255) NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    total_slots INTEGER NOT NULL DEFAULT 10,
    booked_slots INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(experience_id, date, time)
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(255) PRIMARY KEY,
    experience_id VARCHAR(255) NOT NULL REFERENCES experiences(id),
    slot_id VARCHAR(255) NOT NULL REFERENCES experience_slots(id),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    participants INTEGER NOT NULL DEFAULT 1,
    promo_code VARCHAR(50),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experience_slots_experience_id ON experience_slots(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(user_email);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_slots_updated_at BEFORE UPDATE ON experience_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample experiences
INSERT INTO experiences (id, title, location, description, price, image, border_color, about) VALUES
('1', 'Kayaking', 'Udupi', 'Curated small-group experience. Certified guide. Safety first with gear included.', 999, '/kayaking-mangrove', 'pink', 'Scenic routes, trained guides, and safety briefing. Minimum age 10. Helmet and Life jackets along with an expert will accompany in kayaking.'),
('2', 'Nandi Hills Sunrise', 'Bangalore', 'Curated small-group experience. Certified guide. First with gear included.', 899, '/nandi-hills-sunrise', 'yellow', 'Experience the breathtaking sunrise from Nandi Hills. Perfect for photography enthusiasts and nature lovers.'),
('3', 'Coffee Trail', 'Coorg', 'Curated small-group experience. Certified guide. Safety first with gear included.', 1299, '/coffee-trail', 'blue', 'Walk through scenic coffee plantations, learn about coffee cultivation, and enjoy fresh brewed coffee.'),
('4', 'Kayaking', 'Udupi, Karnataka', 'Curated small-group experience. Certified guide. Safety first with gear included.', 999, '/kayaking-sunset', 'green', 'Evening kayaking experience with golden hour views. Perfect for beginners and experienced kayakers.'),
('5', 'Boat Cruise', 'Sunderbans', 'Curated small-group experience. Certified guide. Safety first with gear included.', 999, '/boat-cruise', 'yellow', 'Relaxing boat cruise through scenic waterways. Enjoy the tranquility and natural beauty.'),
('6', 'Bunjee Jumping', 'Manali', 'Curated small-group experience. Certified guide. Safety first with gear included.', 999, '/bunjee-jumping', 'pink', 'Adrenaline-pumping bungee jumping experience. All safety equipment and certified instructors provided.'),
('7', 'Coffee Trail', 'Coorg', 'Curated small-group experience. Certified guide. Safety first with gear included.', 1299, '/coffee-trail-mist', 'green', 'Misty morning coffee plantation walk. Experience the magic of fog-covered coffee estates.'),
('8', 'Nandi Hills Sunrise', 'Bangalore', 'Curated small-group experience. Certified guide. Safety first with gear included.', 899, '/nandi-hills-sunrise', 'pink', 'Early morning trek to witness spectacular sunrise views from Nandi Hills.');

-- Insert sample promo codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, min_amount, max_discount, is_active) VALUES
(gen_random_uuid()::text, 'SAVE10', 'percentage', 10, 500, 200, true),
(gen_random_uuid()::text, 'FLAT100', 'fixed', 100, 800, NULL, true),
(gen_random_uuid()::text, 'WELCOME20', 'percentage', 20, 1000, 300, true);

-- Insert sample experience slots
-- Experience 1 - Kayaking
INSERT INTO experience_slots (id, experience_id, date, time, total_slots, booked_slots) VALUES
(gen_random_uuid()::text, '1', 'Oct 22', '07:00 am', 6, 0),
(gen_random_uuid()::text, '1', 'Oct 22', '09:00 am', 8, 2),
(gen_random_uuid()::text, '1', 'Oct 22', '11:00 am', 5, 1),
(gen_random_uuid()::text, '1', 'Oct 23', '07:00 am', 6, 1),
(gen_random_uuid()::text, '1', 'Oct 23', '09:00 am', 8, 3),
(gen_random_uuid()::text, '1', 'Oct 24', '07:00 am', 6, 0),
(gen_random_uuid()::text, '1', 'Oct 25', '09:00 am', 8, 1);

-- Experience 2 - Nandi Hills
INSERT INTO experience_slots (id, experience_id, date, time, total_slots, booked_slots) VALUES
(gen_random_uuid()::text, '2', 'Oct 22', '05:00 am', 10, 2),
(gen_random_uuid()::text, '2', 'Oct 22', '05:30 am', 8, 1),
(gen_random_uuid()::text, '2', 'Oct 22', '06:00 am', 12, 3),
(gen_random_uuid()::text, '2', 'Oct 23', '05:00 am', 10, 1),
(gen_random_uuid()::text, '2', 'Oct 24', '05:30 am', 8, 0),
(gen_random_uuid()::text, '2', 'Oct 25', '06:00 am', 12, 2);

-- Experience 3 - Coffee Trail
INSERT INTO experience_slots (id, experience_id, date, time, total_slots, booked_slots) VALUES
(gen_random_uuid()::text, '3', 'Oct 22', '08:00 am', 12, 1),
(gen_random_uuid()::text, '3', 'Oct 22', '10:00 am', 7, 2),
(gen_random_uuid()::text, '3', 'Oct 22', '02:00 pm', 4, 0),
(gen_random_uuid()::text, '3', 'Oct 23', '08:00 am', 12, 3),
(gen_random_uuid()::text, '3', 'Oct 24', '10:00 am', 7, 1),
(gen_random_uuid()::text, '3', 'Oct 25', '02:00 pm', 4, 0);

-- Add slots for remaining experiences (4-8)
INSERT INTO experience_slots (id, experience_id, date, time, total_slots, booked_slots) VALUES
(gen_random_uuid()::text, '4', 'Oct 22', '04:00 pm', 8, 1),
(gen_random_uuid()::text, '4', 'Oct 22', '05:00 pm', 5, 2),
(gen_random_uuid()::text, '4', 'Oct 23', '04:00 pm', 8, 0),
(gen_random_uuid()::text, '5', 'Oct 22', '09:00 am', 15, 3),
(gen_random_uuid()::text, '5', 'Oct 22', '12:00 pm', 10, 1),
(gen_random_uuid()::text, '5', 'Oct 23', '03:00 pm', 8, 2),
(gen_random_uuid()::text, '6', 'Oct 22', '10:00 am', 6, 1),
(gen_random_uuid()::text, '6', 'Oct 23', '12:00 pm', 4, 0),
(gen_random_uuid()::text, '7', 'Oct 22', '06:00 am', 10, 2),
(gen_random_uuid()::text, '7', 'Oct 23', '07:00 am', 8, 1),
(gen_random_uuid()::text, '8', 'Oct 22', '04:30 am', 12, 1),
(gen_random_uuid()::text, '8', 'Oct 23', '05:00 am', 9, 2);

-- Verify the setup
SELECT 'Experiences' as table_name, COUNT(*) as record_count FROM experiences
UNION ALL
SELECT 'Experience Slots', COUNT(*) FROM experience_slots
UNION ALL
SELECT 'Promo Codes', COUNT(*) FROM promo_codes
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings;