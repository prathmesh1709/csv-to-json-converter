const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const insertData = async (data) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const record of data) {
      const { name, age, address, additionalInfo } = record;
      const query = `
        INSERT INTO public.users ("name", age, address, additional_info)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
      const values = [
        `${name.firstName} ${name.lastName}`,
        age,
        address ? JSON.stringify(address) : null,
        additionalInfo ? JSON.stringify(additionalInfo) : null,
      ];

      await client.query(query, values);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { insertData };