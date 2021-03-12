const config = require('../config.js');

const database = require('sqlite-async');

let db;
database.open(config.DBSOURCE)
  .then(_db => {
    db = _db;
    // Connection established. Create tables
    
  })
  .catch(err => {
    // Database failed to open
    console.log(err.message);
    throw err;
  })
