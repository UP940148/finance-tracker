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
      });

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
      });
  })
  .catch(err => {
    // Database failed to open
    console.log(err.message);
    throw err;
  });

module.exports.createUser = async function (values) {
  const sql = 'INSERT INTO user (googleId, name, email) VALUES (?, ?, ?);';
  const response = await db.run(sql, values)
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

module.exports.getAllUsers = async function () {
  const sql = 'SELECT * FROM user;';
  const response = await db.all(sql)
    .then(rows => {
      return { failed: false, context: rows };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

module.exports.getUserById = async function (googleId) {
  const sql = `
  SELECT * FROM user
  WHERE googleId = ${googleId};`;
  const response = await db.get(sql)
    .then(row => {
      return { failed: false, context: row };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

module.exports.updateUser = async function (values) {
  const sql = `
  UPDATE user SET
  name = COALESCE(?, name),
  email = COALESCE(?, email)
  WHERE googleId = ${values[0]};`;

  const response = await db.run(sql, [values[1], values[2]])
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

module.exports.deleteUser = async function (googleId) {
  const sql = `DELETE FROM user WHERE googleId = ${googleId};`;
  const response = await db.run(sql)
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

/*
CREATE user
RETRIEVE all users
RETRIEVE user
UPDATE user
DELETE user

CREATE transaction
RETRIEVE all transactions
RETRIEVE transactions between two dates
UPDATE transaction
DELETE transaction
*/
