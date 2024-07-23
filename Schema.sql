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

-- Product Images -----------------------------------------------------------
INSERT INTO Products (Name, Category, Type, Brand, Size, Description, Price, ImageURL) VALUES
--Headphones-----------------------------------------------------	
  ('Blast Headphones', 'Electronics', 'Headphones', 'Symphonized', 'Large', 'Black and Red + wireless + adjustable ', 40.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\blk_red.webp'),
	
  ('G Headphones', 'Electronics', 'Headphones', 'G', 'Medium', 'Black and Red + Adjustable + Mic', 25.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\G_blk_red.webp' ),
	
  ('JBL Headphones', 'Electronics', 'Headphones', 'JBL', 'Adjustable Medium', 'Black + Soundproof + wireless + charger', 40.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\jbl.webp'),
	
  ('Zone Vibe 125', 'Electronics', 'Headphones', 'Logitech', 'Medium', 'Lightweight+ wireless headphones with USB receiver', 130.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\logi.webp'),
	
  ('Logitech G PRO Gaming Headset', 'Electronics', 'Headphones', 'Logitech', 'Medium', 'Wireless + Lighweight + Black + mic', 120.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\logi_blk.webp'),
  
  ('Zone Vibe 100', 'Electronics', 'Headphones', 'Logitech', 'Large', 'Lightweight + Wireless + Pink', 100.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\logi_pink.webp'),
	
  ('Sony - Extra Bass Over-the-Ear Headphones - Blue', 'Electronics', 'Headphones', 'Sony', 'Large', 'Blue + Wireless + Charger ', 133.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\sony_blue.webp'),
	
  ('Wireless Gaming Headset', 'Electronics', 'Headphones', 'Kotion', 'Normal', 'Black + Blue + Wireless', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\headphones\spyder.webp'),

-- Keyboards-----------------------------------------------------------------------------------------
	('Mechanical Keyboard', 'Electronics', 'Keyboards', 'MageGee', 'Compact', 'Black + Grey + Orange + Blue light + Cable', 35.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\BG_blueLs.webp'),
	
    ('Mechanical Keyboard', 'Electronics', 'Keyboards', 'MageGee', 'Compact','Grey + Black + Blue light + Cabel', 35.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\BG_blueLs.webp'),
	
    ('Black Wide Keyboard', 'Electronics', 'Keyboards', 'Redragon', 'Normal', 'Black + Multi Color lights  + Number keypad + Cabel', 40.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\black_multi_colorLs.webp'),
	
    ('White & Black Keyboard', 'Electronics', 'Keyboards', 'AULA', 'Long','White base + Black keys + Multicolor lights + Mouse + Number keypad + Cabel', 50.00,'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\BLK_MultiLS_pack.webp'),
	
    ('Mechanical Keyboard', 'Electronics', 'Keyboards', 'MageGee', 'Compact', 'White + Ice Blue + Blue Light + Cabel', 27.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\ice_blue.webp'),
	
    ('Mechanical Keyboard', 'Electronics', 'Keyboards', 'Camisyn', 'Compact', 'White + Black + Blue + Blue Light + Cabel', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\mech_GBB.webp'),
	
    ('Mechanical Keyboard', 'Electronics', 'Keyboards', 'MageGee', 'Compact', 'Orange + Grey + Black + White + Cabel + light ',133.00,'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\mech_WBO.webp'),
	
    ('Mechanical Keyboard', 'Electronics', 'Keyboards', 'Camisyn', 'Compact', 'Red + Grey + Black + Cabel', 25.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\mechanical_red.webp'),

	('KNOWSQT  Keyboard + Mouse', 'Electronics', 'Keyboards', 'KNOWSQT', 'Normal', 'Brown + White + Tan + Mouse + USB', 30.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\neutrals_pack.webp'),
	
	('White Boared Keyboard', 'Electronics', 'Keyboards', 'YSCP', 'Long', 'White + Grey lining + White & Purple light', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\white_circular_blueLs.webp'),
	
	('Full White Keyboard', 'Electronics', 'Keyboards', 'HUO JI', 'Compact','All White Keys and Base', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\white_keys.webp'),
	
	('Bee Keyboard + Mouse', 'Electronics', 'Keyboards', 'MageGee', 'Compact', 'Yellow Base + Black + White', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\keyboards\yell_pack.webp'),
	
-- Monitors -------------------------------------------------------------------------------------
	
	('LG Ultra Gear', 'Electronics', 'Monitors', 'LG', '49-inch', '49-inch Dual QHD (5129x1440) curved (1000R) monitor with an ultra-wide 32:9 aspect ratio ', 200.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\LG_ultragear.webp'),
	
    ('LG Ultra Wide', 'Electronics', 'Monitors', 'LG', '34 - inch', '34" UltraWide FHD HDR Monitor with FreeSync', 140.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\LG_ultrawide.webp'),
	
	('Odyssey G9', 'Electronics', 'Monitors', 'Samsung', '49 - inch', '49" Odyssey G9 G95C DQHD 240Hz 1ms(GtG) DisplayHDR 1000 Curved Gaming Monitor', 190.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\odyssey_g9.webp'),
    
	('Odyssey G5', 'Electronics', 'Monitors', 'Samsung', '27 - inch', '27" Odyssey G55C QHD 165Hz 1ms(MPRT) Curved Gaming Monitor', 140.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\samsung_odyseey_g5.webp'),
	
	('Odyssey G3', 'Electronics', 'Monitors', 'Samsung', '24 - inch', '24-Inch FHD 1080p Gaming Monitor, 144Hz, 1ms, 3-sided border-less, VESA Compatible, Height Adjustable Stand, FreeSync Premium', 200.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\samsung_odyssey_g3.webp'),
	
	('Odyssey G7', 'Electronics', 'Monitors', 'Samsung', '27 - inch', 'SAMSUNG 27" Odyssey G7 Series WQHD (2560x1440) Gaming Monitor, 240Hz, Curved, 1ms, HDMI, G-Sync, FreeSync Premium Pro', 180.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\monitors\samsung_odyssey_g7.webp'),

-- Mouse ------------------------------------------------------------------------------------------
	('TSV MO6 Gaming Mouse', 'Electronics', 'Mouse', 'TSV', 'Normal', 'Black + Multicolor Logo + USB', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\batman_multi.webp'),
	
	('Dell Cabel Mouse', 'Electronics', 'Mouse', 'Dell', 'Normal', 'Black + Cabel', 15.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\dell.webp'),
	
	('Logitech Black Mouse', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Black + USB', 20.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\logi_black.webp'),
	
	('Logitech Performance Mouse', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Side handle + Black + Grey + USB', 45.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\logi_blk_grey.webp'),
	
	('Logitech Standard Mouse', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Black + Grey + USB', 18.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\logi_blk_grey_reg.webp'),
	
	('Logitech Wireless Mouse Blue', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Blue + Black + USB', 16.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\logi_blue_blk.webp'),
	
	('Logitech Lift Vertical Ergonomic Mouse', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Pink + Side Handle + USB', 50.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\Logi_pink.webp'),
	
	('Logitech Wireless Mouse Red', 'Electronics', 'Mouse', 'Logitech', 'Normal', 'Red + Black + USB', 18.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\logi_red_blk.webp'),
	
	('Teal SEENDA Mouse', 'Electronics', 'Mouse', 'SEENDA', 'Normal', ' Teal + USB', 15.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Mouse\teal.webp'),
-- REST Pads----------------------------------------------------------------------------------------------------------------	
	('Mouse & Keyboard Rest Pad', 'Accessories', 'Rest Pads', 'Bonison', '17- inch Long', 'Black + 17 in. long', 12.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\rests\blk_arm_wrist.webp'),
	
	('Pink Clouds Pads Keyboard and wrist', 'Accessories', 'Rest Pads', 'RAOVCUS', '16.9 inch long', '16.9 inch x 4.33 inch', 24.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\rests\pink_cloud.webp'),
	
	('Purple Clouds Pads Keyboard and wrist', 'Accessories', 'Rest Pads', 'WMM', '16.5 inch long', 'Light Purple + 16.5 inch x 4.3 inch', 23.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\rests\purple_cloud.webp'),
	
	('Memory Foam Wrist Pad', 'Accessories', 'Rest Pads', 'BRILA', '5.1 inch', 'Black + 5.1 inch + Non-slip support', 10.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\rests\wrist.webp'),
-- Keybaord Skins	
	('Bright Pink KeyBoard Skin', 'Accessories', 'Rest Pads', 'Kuzy', '13 inch and 15 inch', 'Bright Pink + Silicone', 9.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\bright_pink.webp'),
	
	('Clear Black Key Skin', 'Accessories', 'Rest Pads', 'EBAY', '15.6 inch', 'Clear base skin+ Black keys skin + Silicone', 8.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\clear_and_black.webp'),
	
	('Transparent Clear Skin', 'Accessories', 'Rest Pads', 'Lapogy', '14 inch', 'Clear + Silicone', 7.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\clear_skin.webp'),
	
	('Multi Color Skin', 'Accessories', 'Rest Pads', 'Kuzy', '15 inch', 'Multi Color + Silicone', 12.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\multi_color.webp'),

	('Ombre Blue Skin', 'Accessories', 'Rest Pads', 'CaseBuy', '11 - 11.6 inch', 'Ombre Navy blue to white + Silicon', 7.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\ombre_blue.webp'),

	('Ombre Light Blue Skin', 'Accessories', 'Rest Pads', 'CaseBuy', '14 inch', 'Ombre Ice blue to white + Silicone', 7.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\ombre_light_blue.webp'),

	('Light Pink Ombre Skin', 'Accessories', 'Rest Pads', 'CaseBuy', '14 inch', 'Ombre Light pink to white + Silicone', 7.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\ombre_pink.webp'),
	
	('Lavendar Purple Ombre Skin', 'Accessories', 'Rest Pads', 'Casebuy', '14 inch', 'Ombre Light purple to white + Silicone', 0.00, 'C:\Users\mesco\OneDrive - University of Cincinnati\CS4092DatabaseAssignment\App\react-app\src\images\products\Skins\ombre_purple.webp');
UPDATE Products
	SET ImageURL = 'http://localhost:3000/images/headphones/beats.webp'
	Where ProductID=3;
Select * From Products
DROP TABLE Products




