-- Database Schema for PraliCash

-- ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('FARMER', 'BUYER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('OPEN', 'CLUSTERED', 'MATCHED', 'PICKED_UP', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN 
        ALTER TYPE listing_status ADD VALUE IF NOT EXISTS 'MATCHED';
END $$;

DO $$ BEGIN
    CREATE TYPE cluster_status AS ENUM ('READY', 'MATCHED', 'IN_TRANSIT', 'DONE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM ('PROPOSED', 'ACCEPTED', 'REJECTED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TABLES
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE NOT NULL,
    farmer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    village_name TEXT,
    district TEXT,
    state TEXT,
    geo_lat DOUBLE PRECISION,
    geo_lng DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS buyers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    buyer_name TEXT,
    company_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    farmer_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    village_name TEXT,
    acres DOUBLE PRECISION,
    harvest_start DATE,
    harvest_end DATE,
    estimated_tonnes DOUBLE PRECISION,
    geo_lat DOUBLE PRECISION,
    geo_lng DOUBLE PRECISION,
    status listing_status DEFAULT 'OPEN',
    cluster_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demands (
    id SERIAL PRIMARY KEY,
    buyer_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    buyer_name TEXT,
    company_name TEXT,
    required_tonnes DOUBLE PRECISION,
    location_text TEXT,
    price_per_tonne DOUBLE PRECISION,
    earliest_pickup DATE,
    latest_pickup DATE,
    geo_lat DOUBLE PRECISION,
    geo_lng DOUBLE PRECISION,
    status listing_status DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clusters (
    id SERIAL PRIMARY KEY,
    cluster_name TEXT,
    total_tonnes DOUBLE PRECISION,
    centroid_lat DOUBLE PRECISION,
    centroid_lng DOUBLE PRECISION,
    status cluster_status DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    cluster_id INTEGER REFERENCES clusters(id) ON DELETE CASCADE,
    demand_id INTEGER REFERENCES demands(id) ON DELETE CASCADE,
    distance_km DOUBLE PRECISION,
    offered_price DOUBLE PRECISION,
    transport_cost DOUBLE PRECISION,
    net_score DOUBLE PRECISION,
    pickup_date DATE,
    status match_status DEFAULT 'PROPOSED',
    match_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cluster_members (
    cluster_id INTEGER REFERENCES clusters(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    PRIMARY KEY (cluster_id, listing_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    msg TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    tonnes_per_acre DOUBLE PRECISION DEFAULT 2.5,
    min_cluster_tonnes DOUBLE PRECISION DEFAULT 50,
    distance_threshold_km DOUBLE PRECISION DEFAULT 15,
    price_weight DOUBLE PRECISION DEFAULT 0.6,
    distance_weight DOUBLE PRECISION DEFAULT 0.4,
    transport_cost_per_km_tonne DOUBLE PRECISION DEFAULT 8
);

-- INITIAL CONFIG
INSERT INTO app_config (id) VALUES (1) ON CONFLICT DO NOTHING;
