const config = require('../config.js');

const database = require('sqlite-async');

let db;
database.open(config.DBSOURCE)
  .then(_db => {
    db = _db;
    // Connection established. Create tables
    console.log('Connection to SQLite database has been established!');
    db.run(`CREATE TABLE IF NOT EXISTS user (
      googleId PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );`)
      .then(() => {
        // Table established
        console.log('Established user table');
      })
      .catch(err => {
        console.log(err.message);
      })

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      userId references user(googleId) NOT NULL,
      date INTEGER,
      amount REAL,
      memo TEXT,
      address TEXT,
      payee TEXT,
      category TEXT,
      subcategory TEXT
    );`)
      .then(() => {
        // Table established
        console.log('Established transactions table');
      })
      .catch(err => {
        console.log(err.message);
      })
  })
  .catch(err => {
    // Database failed to open
    console.log(err.message);
    throw err;
  })
