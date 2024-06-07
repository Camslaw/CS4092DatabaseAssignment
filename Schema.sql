CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    CurrentBalance DECIMAL(10, 2) DEFAULT 0.00
);
