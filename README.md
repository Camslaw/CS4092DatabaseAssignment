# CS4092 - Database Design and Development: Online Store Application

## Project Overview
This is a project for the CS4092 - Database Design and Development course at the University of Cincinnati. It is a full stack web application for an online store that utilizes the PERN stack (PostgreSQL, Express, React, Node.js).

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Features
- User profiles and preferences (customers and staff)
- Product browsing and search functionality
- Shopping cart management
- Order processing and payment
- Inventory management for staff
- Supplier and stock management

## Installation and Setup
- Install Node https://nodejs.org/en
- Install pgAdmin4 https://www.pgadmin.org/download/
- Install Postgres https://www.postgresql.org/download/
- Clone the repository
- Go to App -> node -> .env and put your username, password, and database name into the following line:
    DATABASE_URL=postgres://username:password@localhost:5432/your_database_name
- Using pgAdmin4, ensure that you're local Postgres database is up and running
- Open 2 terminal windows
- In the first terminal, navigate to App/node within the project directory and enter 'npm install'
- Now enter 'node index.js'
- In your second terminal, navigate to App/react-app within the project directory and enter 'npm install'
- Now enter 'npm start'