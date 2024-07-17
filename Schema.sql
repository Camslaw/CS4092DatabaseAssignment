CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Balance DECIMAL(10, 2) DEFAULT 0.00,
    PreferredShippingAddress VARCHAR(255) DEFAULT NULL,
    PreferredPaymentMethod VARCHAR(255) DEFAULT NULL
);

CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Category VARCHAR(255) NOT NULL,
    Type VARCHAR(255) NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Size VARCHAR(255) DEFAULT NULL,
    Description VARCHAR(255) NOT NULL,
    Price DECIMAL(5,2) DEFAULT 0.00,
    ImageURL VARCHAR(255) DEFAULT NULL
);

CREATE TABLE Addresses (
    AddressID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    AddressType VARCHAR(255) NOT NULL,
    StreetAddress VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State CHAR(2) NOT NULL,
    ZipCode VARCHAR(10) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE CreditCards (
    CardID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    CardNumber VARCHAR(20) NOT NULL,
    ExpiryDate DATE NOT NULL,
    CVV VARCHAR(3) NOT NULL,
    PaymentAddressID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (PaymentAddressID) REFERENCES Addresses(AddressID)
);

CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    Status VARCHAR(255) NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
    PaymentCardID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (PaymentCardID) REFERENCES CreditCards(CardID)
);

CREATE TABLE OrderDetails (
    OrderDetailID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE DeliveryPlans (
    DeliveryPlanID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    DeliveryType VARCHAR(255) NOT NULL,
    DeliveryPrice DECIMAL(5,2) DEFAULT 0.00,
    DeliveryDate DATE NOT NULL,
    ShipDate DATE NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL
);

CREATE TABLE SupplierProducts (
    SupplierProductsID SERIAL PRIMARY KEY,
    SupplierID INT NOT NULL,
    ProductID INT NOT NULL,
    SupplierPrice DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Warehouses (
    WarehouseID SERIAL PRIMARY KEY,
    Address VARCHAR(255) NOT NULL,
    Capacity INT NOT NULL
);

CREATE TABLE Stock (
    StockID SERIAL PRIMARY KEY,
    WarehouseID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    UNIQUE (WarehouseID, ProductID)
);

CREATE TABLE ShoppingCart (
    CartID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE ShoppingCartItems (
    CartItemID SERIAL PRIMARY KEY,
    CartID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (CartID) REFERENCES ShoppingCart(CartID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Staff (
    StaffID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Salary DECIMAL(8,2) DEFAULT NULL,
    JobTitle VARCHAR(255) DEFAULT NULL
);

-- Create the hash_password function
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- 1. Add a new customer 
INSERT INTO Customers (Name, Email, Password, Balance, PreferredShippingAddress, PreferredPaymentMethod)
VALUES  ('John Doe', 'john.doe@example.com', hash_password('password123'), 0.00, null, null),
        ('Michelle Zoe', 'zoe.m@example.com', hash_password('pinaolover06'), 0.00, null, null),
        ('Rafael Najarro', 'd.r.najarro@example.com', hash_password('salvifavo'), 0.00, null, null),
        ('David Martinez', 'dbm.bri@example.com', hash_password('spotlightdrum'), 0.00, null, null);
    
-- 2. Add a new staff member
INSERT INTO Staff (Name, Address, Salary, JobTitle)
VALUES  ('John Doe', '10898 Cincinnati Court', 24.50, 'Manager'),
        ('Monica Barahona', '0923 Cooper Lane', 30.00, 'Chief'),
        ('Jessica Cvet', '1242 Hudson Avenue', 30.00, 'Programmer'),
        ('Cameron Ridge', '8956 Quail Court', 30.00, 'Editor');

-- 3. Add addresses
INSERT INTO Addresses( CustomerID, AddressType,  StreetAddress, City, State, Zipcode, Country)
VALUES  (1,'Home' ,'10869 Main St.', 'Cincinnati', 'OH', '45240','USA' ), 
        (2, 'Apartment', '1222 Kenn Road', 'Springdale', 'OH', '45250', 'USA'),  
        (3, 'Apartment', '6477 Kenwood Road', 'Cincinnati', 'OH', '45242','USA'),
        (4, 'Work', '1212 Chocolate Factory Road', 'Cincinnati', 'OH', '34242', 'USA');

-- 4. Add a credit card
INSERT INTO CreditCards (CustomerID, CardNumber, ExpiryDate, CVV, PaymentAddressID)
VALUES  (1, '1234567812345678', '2025-12-31', '123', 1),
        (2, '6987538232323231','2024-07-08', '234', 2),
        (3, '876554331292123', '2027-05-26', '413', 3),
        (4, '98765431272354', '2026-09-22', '295', 4);

-- 5. Add products
INSERT INTO Products (Name, Category, Type, Brand, Size, Description, Price, ImageURL)
VALUES  ('Product1', 'Electronics', 'Laptop', 'Dell', '15 inch', 'A powerful laptop', 999.99, 'http://example.com/product1.jpg'),
        ('Product2', 'Electronics', 'Mouse', 'Logitech', '3 x 4 x 5 inch', 'A powerful mouse', 49.99, 'http://example.com/product2.jpg'),
        ('Product3', 'Electronics', 'Keyboard', 'Keychron', '12 x 4 x 2 inch', 'A mechanical keyboard', 89.99, 'http://example.com/product3.jpg'),
        ('Product4', 'Electronics', 'Monitor', 'Samsung', '27 inch', 'A high-resolution monitor', 299.99, 'http://example.com/product4.jpg'),
        ('Product5', 'Electronics', 'Mousepad', 'Logitech', '12 x 12 x 0.3 inch', 'A large mousepad', 19.99, 'http://example.com/product5.jpg');

-- 6. Add warehouses
INSERT INTO Warehouses (Address, Capacity)
VALUES ('123 Warehouse Lane', 1000),
       ('456 Storage Blvd', 2000);

-- 7. Add stock to warehouse
INSERT INTO Stock (WarehouseID, ProductID, Quantity)
VALUES (1, 1, 100)
ON CONFLICT (WarehouseID, ProductID)
DO UPDATE SET Quantity = Stock.Quantity + 100;

-- 8. Create a new order
INSERT INTO Orders (CustomerID, OrderDate, Status, Total, PaymentCardID)
VALUES  (1, '2024-07-10', 'Pending', 199.99, 1),
        (2, '2024-06-22', 'Pending', 250.00, 2);

-- 9. Create customer shopping cart
INSERT INTO ShoppingCart (CustomerID)
VALUES (1), (2), (3), (4);

-- 10. Add product to cart
INSERT INTO ShoppingCartItems (CartID, ProductID, Quantity)
VALUES (1, 1, 2), (2, 2, 1);
