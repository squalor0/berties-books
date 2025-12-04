# Berties Books

Berties Books is a simple online bookshop application built for the **Dynamic Web Applications** module.

It demonstrates:

- Node.js with **Express**
- **EJS** templates
- **MySQL** for persistent data
- Dotenv implementation
- Login Auditing
- Session-based authentication
- Validation and sanitisation of user input
- Basic access control using sessions

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

## Validation

Server-side validation was added using the express-validator module.
On the registration page, the following checks were added:
- The email field must contain a valid email address.
- The username must be between 5 and 20 characters.
- The password must be at least 8 characters long.
- First name and last name must not be empty.

If any validation fails, the user is returned to the registration page without inserting invalid data into the database.
Additional validation was added to the Add Book page to ensure that book titles are not empty and that prices are numeric.

## Sanitization

Sanitisation was added using express-sanitizer to protect the application from XSS attacks.
Fields that accept free-text input, such as first name, last name, username, email, book names and search keywords, were sanitised using req.sanitize before the values were stored or displayed.

Passwords were not sanitised because altering them would prevent correct authentication.
Only fields that represent user-entered free text were sanitised to prevent malicious scripts while still allowing normal characters.

## Access Control

Session-based authorisation was added using express-session.
A redirectLogin middleware function was created to protect routes that should only be accessible to authenticated users.

The following routes were restricted:
- /users/list
- /users/audit
- /books/addbook

These pages contain sensitive information or allow data modification, so they require the user to be logged in.
Routes such as /books/list, /books/bargainbooks and /search remain publicly accessible so visitors can browse books without logging in.
A logout route was added to allow users to end their session.

## API

This project includes a simple JSON API for accessing book data. The API allows clients to retrieve the list of books and optionally filter, sort, or search the results.

Base URL:
`/api/books`

This endpoint always returns data in JSON format.

### Query Parameters

`search`
Returns only books whose name contains the given substring (case-insensitive).
Example:
`/api/books?search=world`

`minprice`
Returns only books with a price greater than or equal to the specified value.
Example:
`/api/books?minprice=10`

`maxprice`
Returns only books with a price less than or equal to the specified value.
Example:
`/api/books?maxprice=20`

`Price range`
You can combine minprice and maxprice:
`/api/books?minprice=5&maxprice=15`

`sort`
Sorts the results by name or price in ascending order.
Example:
`/api/books?sort=name`
`/api/books?sort=price`

### Combined Examples

Search for books containing the word "rock":
`/api/books?search=rock`

Get books priced between £5 and £20, sorted by price:
`/api/books?minprice=5&maxprice=20&sort=price`

Search for books containing "new", priced under £15, sorted by name:
`/api/books?search=new&maxprice=15&sort=name`

All parameters are optional, and the API always returns a valid JSON array.

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
