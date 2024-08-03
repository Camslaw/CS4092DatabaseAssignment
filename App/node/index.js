const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
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

app.use('/images', express.static(path.join(__dirname, 'public/images')));

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

app.post('/api/cart/add', async (req, res) => {
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

    // Check if the product already exists in the cart
    result = await pool.query('SELECT * FROM ShoppingCartItems WHERE CartID = $1 AND ProductID = $2', [cartId, productId]);
    if (result.rows.length > 0) {
      // Update the quantity of the existing item
      const existingItem = result.rows[0];
      const newQuantity = existingItem.quantity + quantity;
      const updateResult = await pool.query('UPDATE ShoppingCartItems SET Quantity = $1 WHERE CartItemID = $2 RETURNING *', [newQuantity, existingItem.cartitemid]);
      console.log('Updated item quantity:', updateResult.rows[0]);
      res.status(200).json(updateResult.rows[0]);
    } else {
      // Add the new item to the cart
      const queryText = 'INSERT INTO ShoppingCartItems (CartID, ProductID, Quantity) VALUES ($1, $2, $3) RETURNING *';
      const queryValues = [cartId, productId, quantity];
      const itemResult = await pool.query(queryText, queryValues);
      console.log('Item added to cart:', itemResult.rows[0]);
      res.status(201).json(itemResult.rows[0]);
    }
  } catch (err) {
    console.error('Error adding item to cart:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Update cart item quantity
app.put('/api/cart/update', async (req, res) => {
  const { cartItemId, quantity } = req.body;
  try {
    // Update the quantity
    await pool.query('UPDATE ShoppingCartItems SET Quantity = $1 WHERE CartItemID = $2', [quantity, cartItemId]);

    // Return the full updated cart item details
    const result = await pool.query(`
      SELECT sci.cartitemid, sci.productid, sci.quantity, p.name, p.price, p.imageurl
      FROM ShoppingCartItems sci
      JOIN Products p ON sci.productid = p.productid
      WHERE sci.cartitemid = $1
    `, [cartItemId]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Remove cart item
app.delete('/api/cart/remove/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;
  try {
    const result = await pool.query('DELETE FROM ShoppingCartItems WHERE CartItemID = $1 RETURNING *', [cartItemId]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/staff/signin', async (req, res) => {
  const { name, staffId } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Staff WHERE Name = $1 AND StaffID = $2', [name, staffId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid name or staff ID' });
    }
    const staff = result.rows[0];
    req.session.staffId = staff.staffid;
    res.status(200).json({ staffId: staff.staffid, name: staff.name });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});
 
app.post('/api/products', async (req, res) => {
  const { name, category, type, brand, size, description, price, imageurl } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Products (name, category, type, brand, size, description, price, imageurl) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, category, type, brand, size, description, price, imageurl]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, type, brand, size, description, price, imageurl } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Products SET name = $1, category = $2, type = $3, brand = $4, size = $5, description = $6, price = $7, imageurl = $8 WHERE productid = $9 RETURNING *',
      [name, category, type, brand, size, description, price, imageurl, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// DELETE endpoint for products
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Attempting to delete product with id: ${id}`);
    // First, delete all related entries in the orderdetails table
    await pool.query('DELETE FROM OrderDetails WHERE ProductID = $1', [id]);
    console.log(`Related entries in OrderDetails deleted for product id: ${id}`);

    // Then, delete all related entries in the stock table
    await pool.query('DELETE FROM Stock WHERE ProductID = $1', [id]);
    console.log(`Related entries in Stock deleted for product id: ${id}`);

    // Now, delete the product
    const result = await pool.query('DELETE FROM Products WHERE productid = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      console.log(`Product with id: ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Product with id: ${id} deleted successfully`);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


app.get('/api/cart/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(`
      SELECT sci.cartitemid, sci.productid, sci.quantity, p.name, p.price, p.imageurl
      FROM ShoppingCartItems sci
      JOIN Products p ON sci.productid = p.productid
      JOIN ShoppingCart sc ON sci.cartid = sc.cartid
      WHERE sc.customerid = $1
    `, [customerId]);
    const parsedResult = result.rows.map(row => ({
      ...row,
      price: parseFloat(row.price) // Ensure price is a number
    }));
    res.status(200).json(parsedResult);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/user/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query('SELECT Name, Email, PreferredShippingAddress, PreferredPaymentMethod, Balance FROM Customers WHERE CustomerID = $1', [customerId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      ...result.rows[0],
      balance: parseFloat(result.rows[0].balance) // Ensure balance is a number
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.put('/api/user/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { preferredShippingAddress, preferredPaymentMethod } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Customers SET PreferredShippingAddress = $1, PreferredPaymentMethod = $2 WHERE CustomerID = $3 RETURNING *',
      [preferredShippingAddress, preferredPaymentMethod, customerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/account/address', async (req, res) => {
  const { customerId, addressType, streetAddress, city, state, zipCode, country } = req.body;
  try {
    const queryText = `
      INSERT INTO Addresses (CustomerID, AddressType, StreetAddress, City, State, ZipCode, Country)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING AddressID
    `;
    const queryValues = [customerId, addressType, streetAddress, city, state, zipCode, country];
    const result = await pool.query(queryText, queryValues);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding address:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Add new credit card
app.post('/api/account/credit-card', async (req, res) => {
  const { customerId, cardNumber, expiryDate, cvv, paymentAddressId } = req.body;
  try {
    const queryText = `
      INSERT INTO CreditCards (CustomerID, CardNumber, ExpiryDate, CVV, PaymentAddressID)
      VALUES ($1, $2, $3, $4, $5) RETURNING CardID
    `;
    const queryValues = [customerId, cardNumber, expiryDate, cvv, paymentAddressId];
    const result = await pool.query(queryText, queryValues);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding credit card:', err.message);
    res.status (500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/account/addresses/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query('SELECT AddressID, AddressType, StreetAddress, City, State, ZipCode, Country FROM Addresses WHERE CustomerID = $1', [customerId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/account/credit-cards/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query('SELECT CardID, CardNumber, ExpiryDate, PaymentAddressID FROM CreditCards WHERE CustomerID = $1', [customerId]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  const { customerId, addressId, cardId, cartItems, deliveryType } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check product availability and gather warehouse details
    for (const item of cartItems) {
      const stockResult = await client.query(`
        SELECT s.WarehouseID, w.Address, s.Quantity
        FROM Stock s
        JOIN Warehouses w ON s.WarehouseID = w.WarehouseID
        WHERE s.ProductID = $1
      `, [item.productid]);

      const warehouseQuantities = stockResult.rows;
      const totalQuantity = warehouseQuantities.reduce((sum, row) => sum + row.quantity, 0);

      if (totalQuantity < item.quantity) {
        const warehouseDetails = warehouseQuantities.map(row => `Warehouse ${row.warehouseid} at ${row.address} has ${row.quantity}`).join(', ');
        throw new Error(`Product ${item.productid} does not have enough stock. Available quantities: ${warehouseDetails}`);
      }
    }

    // Create the order
    const orderTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderResult = await client.query(`
      INSERT INTO Orders (CustomerID, OrderDate, Status, Total, PaymentCardID)
      VALUES ($1, NOW(), 'Pending', $2, $3) RETURNING OrderID
    `, [customerId, orderTotal, cardId]);

    const orderId = orderResult.rows[0].orderid;

    // Create order details and update stock
    for (const item of cartItems) {
      await client.query(`
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, Price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.productid, item.quantity, item.price]);

      let remainingQuantity = item.quantity;

      // Get the stock details ordered by WarehouseID
      const stockDetails = await client.query(`
        SELECT WarehouseID, Quantity
        FROM Stock
        WHERE ProductID = $1
        ORDER BY WarehouseID
      `, [item.productid]);

      for (const stock of stockDetails.rows) {
        if (remainingQuantity <= 0) break;

        const quantityToDeduct = Math.min(stock.quantity, remainingQuantity);

        const stockUpdateResult = await client.query(`
          UPDATE Stock
          SET Quantity = Quantity - $1
          WHERE WarehouseID = $2 AND ProductID = $3 AND Quantity >= $1
          RETURNING *
        `, [quantityToDeduct, stock.warehouseid, item.productid]);

        if (stockUpdateResult.rowCount === 0) {
          throw new Error(`Failed to update stock for product ${item.productid} in warehouse ${stock.warehouseid}.`);
        }

        remainingQuantity -= quantityToDeduct;
      }

      if (remainingQuantity > 0) {
        throw new Error(`Not enough stock for product ${item.productid} after trying all warehouses.`);
      }
    }

    await client.query('DELETE FROM ShoppingCartItems WHERE CartID IN (SELECT CartID FROM ShoppingCart WHERE CustomerID = $1)', [customerId]);

    // Create a delivery plan
    const deliveryPrice = deliveryType === 'Express' ? 10.00 : 5.00; // Example pricing
    const deliveryDate = deliveryType === 'Express' ? 'NOW() + INTERVAL \'2 days\'' : 'NOW() + INTERVAL \'5 days\'';
    await client.query(`
      INSERT INTO DeliveryPlans (OrderID, DeliveryType, DeliveryPrice, DeliveryDate, ShipDate)
      VALUES ($1, $2, $3, ${deliveryDate}, NOW())
    `, [orderId, deliveryType, deliveryPrice]);

    // Update customer's balance
    await client.query(`
      UPDATE Customers SET Balance = Balance + $1 WHERE CustomerID = $2
    `, [orderTotal + deliveryPrice, customerId]);

    await client.query('COMMIT');
    res.status(201).json({ orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error', details: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/account/address/:addressId', async (req, res) => {
  const { addressId } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Find and delete the credit card associated with the address
    const cardResult = await client.query('DELETE FROM CreditCards WHERE PaymentAddressID = $1 RETURNING *', [addressId]);
    if (cardResult.rows.length === 0) {
      console.log(`No credit card found for address id: ${addressId}`);
    } else {
      console.log(`Deleted credit card associated with address id: ${addressId}`);
    }

    // Delete the address
    const addressResult = await client.query('DELETE FROM Addresses WHERE AddressID = $1 RETURNING *', [addressId]);
    if (addressResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Address not found' });
    }

    await client.query('COMMIT');
    res.status(200).json({ address: addressResult.rows[0], card: cardResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting address and associated credit card:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  } finally {
    client.release();
  }
});


// Delete credit card
app.delete('/api/account/credit-card/:cardId', async (req, res) => {
  const { cardId } = req.params;
  try {
    const result = await pool.query('DELETE FROM CreditCards WHERE CardID = $1 RETURNING *', [cardId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Credit card not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Update an address
app.put('/api/account/address/:addressId', async (req, res) => {
  const { addressId } = req.params;
  const { addressType, streetAddress, city, state, zipCode, country } = req.body;
  try {
    const queryText = `
      UPDATE Addresses
      SET AddressType = $1, StreetAddress = $2, City = $3, State = $4, ZipCode = $5, Country = $6
      WHERE AddressID = $7 RETURNING *
    `;
    const queryValues = [addressType, streetAddress, city, state, zipCode, country, addressId];
    const result = await pool.query(queryText, queryValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating address:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Update a credit card
app.put('/api/account/credit-card/:cardId', async (req, res) => {
  const { cardId } = req.params;
  const { cardNumber, expiryDate, cvv, paymentAddressId } = req.body;
  try {
    const queryText = `
      UPDATE CreditCards
      SET CardNumber = $1, ExpiryDate = $2, CVV = $3, PaymentAddressID = $4
      WHERE CardID = $5 RETURNING *
    `;
    const queryValues = [cardNumber, expiryDate, cvv, paymentAddressId, cardId];
    const result = await pool.query(queryText, queryValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Credit card not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating credit card:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// New endpoint to pay balance using a credit card
app.post('/api/pay-balance', async (req, res) => {
  const { customerId, amount, cardId } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Log input values
    console.log(`CustomerID: ${customerId}, Amount: ${amount}, CardID: ${cardId}`);

    // Ensure the card belongs to the customer
    const cardResult = await client.query('SELECT * FROM CreditCards WHERE CardID = $1 AND CustomerID = $2', [cardId, customerId]);
    if (cardResult.rows.length === 0) {
      throw new Error('Credit card not found or does not belong to the customer');
    }
    console.log('Credit card validated.');

    // Deduct the amount from the balance
    const balanceResult = await client.query('UPDATE Customers SET Balance = Balance - $1 WHERE CustomerID = $2 RETURNING Balance', [amount, customerId]);
    if (balanceResult.rows.length === 0) {
      throw new Error('Failed to update balance.');
    }

    // Log balance update result
    console.log(`New Balance: ${balanceResult.rows[0].balance}`);

    await client.query('COMMIT');
    res.status(200).json({ newBalance: balanceResult.rows[0].balance });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error paying balance:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  } finally {
    client.release();
  }
});

app.get('/api/warehouses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Warehouses');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/warehouses/:warehouseId/products', async (req, res) => {
  const { warehouseId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Stock (WarehouseID, ProductID, Quantity) VALUES ($1, $2, $3) ON CONFLICT (WarehouseID, ProductID) DO UPDATE SET Quantity = Stock.Quantity + $3 RETURNING *',
      [warehouseId, productId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
