const { Pool } = require('pg');

const connectionString = "postgresql://postgres.lyixdpptzxajrdtblhww:prilacash@2304@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
