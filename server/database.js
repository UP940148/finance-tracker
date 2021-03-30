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
      transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
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

module.exports.createTransaction = async function (values) {
  const sql = 'INSERT INTO transactions (userId, date, amount, memo, address, payee, category, subcategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
  const response = await db.run(sql, values)
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

module.exports.getAllTransactions = async function () {
  const sql = 'SELECT * FROM transactions;';
  const response = await db.all(sql)
    .then(rows => {
      return { failed: false, context: rows };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

module.exports.getTransactionById = async function (transactionId) {
  const sql = `
  SELECT * FROM transactions
  WHERE transactionId = ${transactionId};`;
  const response = await db.get(sql)
    .then(row => {
      return { failed: false, context: row };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

module.exports.getUserTransactions = async function (userId) {
  const sql = `
  SELECT * FROM transactions
  WHERE userId = ${userId};`;
  const response = await db.all(sql)
    .then(rows => {
      return { failed: false, context: rows };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

module.exports.getUserTransactionsBetweenDates = async function (userId, startDate, endDate) {
  const sql = `
  SELECT * FROM transactions
  WHERE userId = ${userId}
  AND date BETWEEN ${startDate} AND ${endDate};`;
  const response = await db.all(sql)
    .then(rows => {
      return { failed: false, context: rows };
    })
    .catch(err => {
      return { failed: true, context: err };
    });
  return response;
};

/*
X CREATE user
X RETRIEVE all users
X RETRIEVE user
X UPDATE user
X DELETE user

X CREATE transaction
X RETRIEVE all transactions
X RETRIEVE transaction
X RETRIEVE all transactions from a user
RETRIEVE transactions from a user between two dates
UPDATE transaction
DELETE transaction
*/
