require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ─── API ROUTES ───────────────────────────────────────────────────────────────

app.post('/api/send-email', async (req, res) => {
    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Get full DB state (initialization)
app.get('/api/db', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users');
        const farmerProfiles = await db.query('SELECT * FROM farmer_profiles');
        const listings = await db.query('SELECT * FROM listings');
        const buyers = await db.query('SELECT * FROM buyers');
        const demands = await db.query('SELECT * FROM demands');
        const clusters = await db.query('SELECT * FROM clusters');
        const matches = await db.query('SELECT * FROM matches');
        const notifications = await db.query('SELECT * FROM notifications');
        const config = await db.query('SELECT * FROM app_config LIMIT 1');

        res.json({
            users: users.rows,
            farmerProfiles: farmerProfiles.rows,
            listings: listings.rows,
            buyers: buyers.rows,
            demands: demands.rows,
            clusters: clusters.rows,
            matches: matches.rows,
            notifications: notifications.rows,
            config: config.rows[0] || {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Listing Creation
app.post('/api/listings', async (req, res) => {
    const { farmer_user_id, village_name, acres, harvest_start, harvest_end, estimated_tonnes, geo_lat, geo_lng } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO listings (farmer_user_id, village_name, acres, harvest_start, harvest_end, estimated_tonnes, geo_lat, geo_lng, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'OPEN') RETURNING *`,
            [farmer_user_id, village_name, acres, harvest_start, harvest_end, estimated_tonnes, geo_lat, geo_lng]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// Demand Creation
app.post('/api/demands', async (req, res) => {
    const { buyer_user_id, buyer_name, company_name, required_tonnes, location_text, price_per_tonne, earliest_pickup, latest_pickup, geo_lat, geo_lng } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO demands (buyer_user_id, buyer_name, company_name, required_tonnes, location_text, price_per_tonne, earliest_pickup, latest_pickup, geo_lat, geo_lng, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'OPEN') RETURNING *`,
            [buyer_user_id, buyer_name, company_name, required_tonnes, location_text, price_per_tonne, earliest_pickup, latest_pickup, geo_lat, geo_lng]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create demand' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
