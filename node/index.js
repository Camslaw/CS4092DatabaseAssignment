// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint to add a new customer
app.post('/customers', async (req, res) => {
  const { name, currentBalance } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Customers (Name, CurrentBalance) VALUES ($1, $2) RETURNING *',
      [name, currentBalance]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to fetch customers
app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Customers');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
