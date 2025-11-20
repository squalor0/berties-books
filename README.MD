# Berties Books

Berties Books is a simple online bookshop application built for the **Dynamic Web Applications** module.

It demonstrates:

- Node.js with **Express**
- **EJS** templates
- **MySQL** for persistent data
- Dotenv implementation
- Login Auditing

---

## Dotenv

The dotenv module was used to prevent database credentials from being stored directly inside the source code. 
A .env file was created in the project root containing the variables BB_USER, BB_PASSWORD and BB_DATABASE, which store the database username, password and database name. 
In index.js, the MySQL connection pool was updated so that it reads the database credentials from process.env instead of using hard-coded strings.

## Audit Logging

Audit logging was added so the application can record every login attempt, including whether it succeeded or failed and when it happened.
A new table called audit was created in the MySQL database with columns for an id, the username, a success value, and a timestamp. 
Inside the /users/loggedin route, code was added to insert a new record into the audit table every time a login attempt occurs. 
If the username does not exist or the password is incorrect, a record with success set to 0 is inserted. 
If the password matches the stored hash, a record with success set to 1 is inserted. 
A new route called /users/audit was created to allow all audit records to be displayed. 
An audit.ejs page was added to show the list of login attempts, including the username, whether the attempt was successful, and the time it occurred.

---

## Prerequisites

- Node.js
- MySQL server running locally
- A `berties_books` database with a `books` table  
  (can be created using `create_db.sql` and `insert_test_data.sql` in this project)

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
node index.js
