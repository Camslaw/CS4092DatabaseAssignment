const express = require('express');
// const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// app.use(cors({
//   origin: ['http://localhost:3000', 'http://cs4092db.netlify.app'], // Include frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());

// Endpoint to add a new customer
// app.get receives information from the database
// app.post sends information to the database
app.post('/customers', async (req, res) => {
  const { name, currentBalance } = req.body;
  try {
    const result = await pool.query('INSERT INTO Customers (Name, CurrentBalance) VALUES ($1, $2) RETURNING *', [name, currentBalance]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
