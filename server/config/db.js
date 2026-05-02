import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'appdb.cyt6iuum69j8.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'appdb',
    user: 'admin',
    password: 'gataSd12456',
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to RDS MySQL ✅');
        
        // Create tables if not exist
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS users (
                username VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL
            )
        `);
        
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255),
                drugs JSON,
                rawText TEXT,
                createdAt DATETIME,
                FOREIGN KEY (username) REFERENCES users(username)
            )
        `);

        conn.release();
    } catch (err) {
        console.error('RDS Connection Error:', err);
    }
})();

export default pool;
