const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = 'INSERT INTO Customers (Name, Email, Password, Balance, PreferredShippingAddress, PreferredPaymentMethod) VALUES ($1, $2, $3, $4, $5, $6) RETURNING CustomerID, Name, Email';
    const queryValues = [name, email, hashedPassword, 0.00, null, null];
    const result = await pool.query(queryText, queryValues);
    req.session.userId = result.rows[0].customerid;
    res.status(201).json({ userId: result.rows[0].customerid, name: result.rows[0].name, email: result.rows[0].email });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Customers WHERE Email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    req.session.userId = user.customerid;
    res.status(200).json({ userId: user.customerid, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/signout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to sign out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sign out successful' });
  });
});

app.post('/cart/add', async (req, res) => {
  const { customerId, productId, quantity } = req.body;
  console.log('Received add to cart request:', req.body);
  try {
    // Ensure the customer has a cart
    let result = await pool.query('SELECT CartID FROM ShoppingCart WHERE CustomerID = $1', [customerId]);
    let cartId;
    if (result.rows.length === 0) {
      result = await pool.query('INSERT INTO ShoppingCart (CustomerID) VALUES ($1) RETURNING CartID', [customerId]);
      cartId = result.rows[0].cartid;
    } else {
      cartId = result.rows[0].cartid;
    }
    console.log('Cart ID:', cartId);

    // Add the item to the cart
    const queryText = 'INSERT INTO ShoppingCartItems (CartID, ProductID, Quantity) VALUES ($1, $2, $3) RETURNING *';
    const queryValues = [cartId, productId, quantity];
    const itemResult = await pool.query(queryText, queryValues);
    console.log('Item added to cart:', itemResult.rows[0]);

    res.status(201).json(itemResult.rows[0]);
  } catch (err) {
    console.error('Error adding item to cart:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
