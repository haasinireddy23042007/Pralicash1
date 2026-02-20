const db = require('./db');

const INITIAL_DB = {
    users: [
        { id: 1, role: "FARMER", username: "bhavya_13", password: "bhavya@13@", email: "haasinireddy2304@gmail.com", farmer_name: "Bhavya Singh" },
        { id: 2, role: "FARMER", username: "haasini_13", password: "haasini@13@", email: "haasini@example.com", farmer_name: "Haasini Kaur" },
        { id: 3, role: "ADMIN", username: "admin", password: "admin123", email: "admin@pralicash.com" },
        { id: 4, role: "FARMER", username: "ram_prasad", password: "password123", email: "ram@example.com", farmer_name: "Ram Prasad" },
    ],
    farmerProfiles: [
        { user_id: 1, full_name: "Bhavya Singh", village_name: "Raikot", district: "Ludhiana", state: "Punjab", geo_lat: 30.6432, geo_lng: 75.6022 },
        { user_id: 2, full_name: "Haasini Kaur", village_name: "Ajnala", district: "Amritsar", state: "Punjab", geo_lat: 31.8399, geo_lng: 74.7603 },
        { user_id: 4, full_name: "Ram Prasad", village_name: "Samrala", district: "Ludhiana", state: "Punjab", geo_lat: 30.8422, geo_lng: 76.1873 },
    ],
    listings: [
        { id: 1, farmer_user_id: 1, village_name: "Raikot", acres: 12, harvest_start: "2024-10-15", harvest_end: "2024-11-01", estimated_tonnes: 30, geo_lat: 30.6432, geo_lng: 75.6022, status: "CLUSTERED", cluster_id: 1 },
        { id: 2, farmer_user_id: 2, village_name: "Ajnala", acres: 8, harvest_start: "2024-10-20", harvest_end: "2024-11-05", estimated_tonnes: 20, geo_lat: 31.8399, geo_lng: 74.7603, status: "CLUSTERED", cluster_id: 1 },
        { id: 3, farmer_user_id: 1, village_name: "Sahnewal", acres: 15, harvest_start: "2024-10-18", harvest_end: "2024-11-10", estimated_tonnes: 37.5, geo_lat: 30.8481, geo_lng: 75.9089, status: "OPEN" },
        { id: 4, farmer_user_id: 2, village_name: "Doraha", acres: 10, harvest_start: "2024-10-25", harvest_end: "2024-11-15", estimated_tonnes: 25, geo_lat: 30.7956, geo_lng: 76.0282, status: "OPEN" },
        { id: 5, farmer_user_id: 4, village_name: "Samrala", acres: 14, harvest_start: "2024-10-22", harvest_end: "2024-11-08", estimated_tonnes: 35, geo_lat: 30.8422, geo_lng: 76.1873, status: "OPEN" },
    ],
    buyers: [
        { id: 10, role: "BUYER", email: "haasinireddy2304@gmail.com", password: "password123", buyer_name: "Turupu Bhavya", company_name: "GreenBio Industries Pvt. Ltd.", is_active: true },
        { id: 11, role: "BUYER", email: "anuj@biomass.co", password: "password123", buyer_name: "Anuj Sharma", company_name: "AgriEnergy Solutions", is_active: true },
    ],
    demands: [
        { id: 1, buyer_user_id: 10, buyer_name: "Turupu Bhavya", company_name: "GreenBio Industries", required_tonnes: 45, location_text: "Chandigarh Industrial Area", price_per_tonne: 2200, earliest_pickup: "2024-11-01", latest_pickup: "2024-11-30", geo_lat: 30.7046, geo_lng: 76.7179, status: "MATCHED" },
        { id: 2, buyer_user_id: 11, buyer_name: "Anuj Sharma", company_name: "AgriEnergy Solutions", required_tonnes: 60, location_text: "Ludhiana Biomass Plant", price_per_tonne: 2050, earliest_pickup: "2024-11-10", latest_pickup: "2024-12-15", geo_lat: 30.9010, geo_lng: 75.8573, status: "OPEN" },
        { id: 3, buyer_user_id: 10, buyer_name: "Turupu Bhavya", company_name: "GreenBio Industries", required_tonnes: 35, location_text: "Amritsar Collection Center", price_per_tonne: 2150, earliest_pickup: "2024-11-05", latest_pickup: "2024-11-25", geo_lat: 31.6340, geo_lng: 74.8723, status: "OPEN" },
        { id: 4, buyer_user_id: 11, buyer_name: "Anuj Sharma", company_name: "AgriEnergy Solutions", required_tonnes: 50, location_text: "Jalandhar Depot", price_per_tonne: 2100, earliest_pickup: "2024-11-12", latest_pickup: "2024-11-28", geo_lat: 31.3260, geo_lng: 75.5762, status: "OPEN" },
    ],
    clusters: [
        { id: 1, cluster_name: "CLUSTER-PB-001", total_tonnes: 50, centroid_lat: 31.2416, centroid_lng: 75.1817, member_listing_ids: [1, 2], status: "MATCHED" },
    ],
    matches: [
        { id: 1, cluster_id: 1, demand_id: 1, distance_km: 68.4, offered_price: 2200, transport_cost: 37939, net_score: 0.742, pickup_date: "2024-11-05", status: "ACCEPTED", match_reason: "Best price (₹2200/t, rank 1/2) with acceptable distance 68.4km. Transport cost ₹37,939." },
    ],
};

async function seed() {
    try {
        console.log('Clearing old data...');
        await db.query('TRUNCATE users, farmer_profiles, buyers, listings, demands, clusters, matches, cluster_members, notifications, otps RESTART IDENTITY CASCADE');

        const idMap = { users: {}, listings: {}, demands: {}, clusters: {} };

        console.log('Seeding users...');
        for (const u of INITIAL_DB.users) {
            const res = await db.query(
                'INSERT INTO users (role, username, password, email, farmer_name) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role RETURNING id',
                [u.role, u.username, u.password, u.email, u.farmer_name]
            );
            idMap.users[u.id] = res.rows[0].id;
        }

        console.log('Seeding farmer profiles...');
        for (const fp of INITIAL_DB.farmerProfiles) {
            await db.query(
                'INSERT INTO farmer_profiles (user_id, full_name, village_name, district, state, geo_lat, geo_lng) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO NOTHING',
                [idMap.users[fp.user_id], fp.full_name, fp.village_name, fp.district, fp.state, fp.geo_lat, fp.geo_lng]
            );
        }

        console.log('Seeding buyers...');
        for (const b of INITIAL_DB.buyers) {
            // Find or create user for buyer
            const res = await db.query(
                'INSERT INTO users (role, email, password, farmer_name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET role = users.role RETURNING id',
                ['BUYER', b.email, b.password, b.buyer_name || b.company_name]
            );
            const userId = res.rows[0].id;
            await db.query(
                'INSERT INTO buyers (user_id, buyer_name, company_name, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING',
                [userId, b.buyer_name, b.company_name, b.is_active]
            );
            idMap.users[b.id] = userId; // For reference in demands
        }

        console.log('Seeding listings...');
        for (const l of INITIAL_DB.listings) {
            const res = await db.query(
                'INSERT INTO listings (farmer_user_id, village_name, acres, harvest_start, harvest_end, estimated_tonnes, geo_lat, geo_lng, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
                [idMap.users[l.farmer_user_id], l.village_name, l.acres, l.harvest_start, l.harvest_end, l.estimated_tonnes, l.geo_lat, l.geo_lng, l.status]
            );
            idMap.listings[l.id] = res.rows[0].id;
        }

        console.log('Seeding demands...');
        for (const d of INITIAL_DB.demands) {
            const res = await db.query(
                'INSERT INTO demands (buyer_user_id, buyer_name, company_name, required_tonnes, location_text, price_per_tonne, earliest_pickup, latest_pickup, geo_lat, geo_lng, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
                [idMap.users[d.buyer_user_id], d.buyer_name, d.company_name, d.required_tonnes, d.location_text, d.price_per_tonne, d.earliest_pickup, d.latest_pickup, d.geo_lat, d.geo_lng, d.status]
            );
            idMap.demands[d.id] = res.rows[0].id;
        }

        console.log('Seeding clusters...');
        for (const c of INITIAL_DB.clusters) {
            const res = await db.query(
                'INSERT INTO clusters (cluster_name, total_tonnes, centroid_lat, centroid_lng, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [c.cluster_name, c.total_tonnes, c.centroid_lat, c.centroid_lng, c.status]
            );
            idMap.clusters[c.id] = res.rows[0].id;
            for (const lid of c.member_listing_ids) {
                await db.query('INSERT INTO cluster_members (cluster_id, listing_id) VALUES ($1, $2)', [idMap.clusters[c.id], idMap.listings[lid]]);
                await db.query('UPDATE listings SET cluster_id = $1 WHERE id = $2', [idMap.clusters[c.id], idMap.listings[lid]]);
            }
        }

        console.log('Seeding matches...');
        for (const m of INITIAL_DB.matches) {
            await db.query(
                'INSERT INTO matches (cluster_id, demand_id, distance_km, offered_price, transport_cost, net_score, pickup_date, status, match_reason) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [idMap.clusters[m.cluster_id], idMap.demands[m.demand_id], m.distance_km, m.offered_price, m.transport_cost, m.net_score, m.pickup_date, m.status, m.match_reason]
            );
        }

        console.log('Seeding initial config...');
        await db.query('INSERT INTO app_config (id, tonnes_per_acre, min_cluster_tonnes, distance_threshold_km, price_weight, distance_weight, transport_cost_per_km_tonne) VALUES (1, 2.5, 50, 15, 0.6, 0.4, 8) ON CONFLICT (id) DO UPDATE SET tonnes_per_acre = EXCLUDED.tonnes_per_acre');

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
