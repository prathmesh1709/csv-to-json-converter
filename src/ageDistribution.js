const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const calculateAgeDistribution = async () => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT
        (CAST(COUNT(CASE WHEN age < 20 THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS "< 20",
        (CAST(COUNT(CASE WHEN age BETWEEN 20 AND 40 THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS "20 to 40",
        (CAST(COUNT(CASE WHEN age BETWEEN 40 AND 60 THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS "40 to 60",
        (CAST(COUNT(CASE WHEN age > 60 THEN 1 END) AS FLOAT) / COUNT(*)) * 100 AS "> 60"
      FROM public.users;
    `;

    const result = await client.query(query);
    const report = `Age-Group % Distribution
< 20 ${result.rows[0]['< 20'].toFixed(2)}%
20 to 40 ${result.rows[0]['20 to 40'].toFixed(2)}%
40 to 60 ${result.rows[0]['40 to 60'].toFixed(2)}%
> 60 ${result.rows[0]['> 60'].toFixed(2)}%`;

    return report;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { calculateAgeDistribution };