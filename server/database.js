const config = require('../config.js');

const database = require('sqlite-async');

let db;
database.open(config.DBSOURCE)
  .then(_db => {
    db = _db;
    // Connection established. Create tables
    console.log('Connection to SQLite database has been established!');
    db.run(`CREATE TABLE IF NOT EXISTS user (
      userId PRIMARY KEY NOT NULL,
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
      userId references user(userId) NOT NULL,
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
  const sql = 'INSERT INTO user (userId, name, email) VALUES (?, ?, ?);';
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

module.exports.getUserById = async function (userId) {
  const sql = `
  SELECT * FROM user
  WHERE userId = ${userId};`;
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
  WHERE userId = ?;`;

  const response = await db.run(sql, values)
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

module.exports.deleteUser = async function (userId) {
  const sql = `DELETE FROM user WHERE userId = ${userId};`;
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

module.exports.updateTransaction = async function (values) {
  const sql = `
  UPDATE transactions SET
  date = COALESCE(?, date),
  amount = COALESCE(?, amount),
  memo = COALESCE(?, memo),
  address = COALESCE(?, address),
  payee = COALESCE(?, payee),
  category = COALESCE(?, category),
  subcategory = COALESCE(?, subcategory)
  WHERE transactionId = ?;`;

  const response = await db.run(sql, values)
    .then(() => {
      return null;
    })
    .catch(err => {
      return err;
    });
  return response;
};

module.exports.deleteTransaction = async function (transactionId) {
  const sql = `DELETE FROM transactions WHERE transactionId = ${transactionId};`;
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
TESTED X CREATE user
TESTED X RETRIEVE all users
TESTED X RETRIEVE user
TESTED X UPDATE user
TESTED X DELETE user

TESTED X CREATE transaction
TESTED X RETRIEVE all transactions
TESTED X RETRIEVE transaction
TESTED X RETRIEVE all transactions from a user
TESTED X RETRIEVE transactions from a user between two dates
TESTED X UPDATE transaction
X DELETE transaction
*/
