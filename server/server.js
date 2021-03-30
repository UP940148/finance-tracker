const config = require('../config.js');
const db = require('./database.js');

const express = require('express');
const bodyParser = require('body-parser');
const googleAuth = require('simple-google-openid');
const auth = googleAuth(config.OAUTH_CLIENT_ID);
const multer = require('multer');
const qif2json = require('qif2json');

const app = express();

const uploader = multer({
  dest: config.uploads,
  limits: {
    fields: 10,
    // fileSize: 1024 * 1024 * 20,
    files: 1,
  },
});

const jsonParser = bodyParser.json();

// This just keeps your computer from sleeping whilst web server is running
try {
  const stayAwake = require('stay-awake');
  stayAwake.prevent((data) => {
    console.log(`${data} routines are preventing sleep!\nYour computer will stay awake whilst this process is running\n`);
  });
} catch {
  console.log("Non-essential development module not found: 'stay-awake'\nSkipping\n");
}

app.use('/', express.static(config.www, { index: 'welcomePage.html', extension: ['HTML'] }));

// Set up web server on port specified in config file. Default to port 8080 if there's an error with config.PORT value
app.listen(config.PORT || 8080, (err) => {
  if (!err) {
    console.log(`Server runnning on port ${config.PORT || 8080}!`);
  } else {
    console.log(err);
  }
});

// qif2json.parseFile('./test.qif', function(err, qifData) {
//   console.log(err || qifData);
// })

app.get('/favicon/', (req, res) => {
  res.status(200).sendFile(config.www + 'images/Wallet-icon.png');
});

app.post('/user/', jsonParser, async (req, res) => {
  const data = [req.body.userId, req.body.name, req.body.email];
  const err = await db.createUser(data);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully created, return 201
  res.status(201).json({ success: true });
});

app.get('/users/', async (req, res) => {
  const response = await db.getAllUsers();
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If no users exist, return 204
  if (response.context.length === 0) {
    res.status(204).json({
      success: false,
    });
    return;
  }
  // If success return 200
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

app.get('/user/:userId/', async (req, res) => {
  const response = await db.getUserById(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If user not found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  // If success, return 200
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

app.patch('/user/:userId/', jsonParser, async (req, res) => {
  // Check if the user exists
  const response = await db.getUserById(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If user not found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }

  // If user exists, proceed with update
  const data = [req.params.userId, req.body.name, req.body.email];
  const err = await db.updateUser(data);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully updated, return 201
  res.status(201).json({ success: true });
});

app.delete('/user/:userId/', async (req, res) => {
  // Check if the user exists
  const response = await db.getUserById(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If user not found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }

  // If user exists, proceed with delete
  const err = await db.deleteUser(req.params.userId);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully deleted, return 200
  res.status(200).json({ success: true });
});

app.post('/transaction/', jsonParser, async (req, res) => {
  const data = [req.body.userId, req.body.date, req.body.amount, req.body.memo, req.body.address, req.body.payee, req.body.category, req.body.subcategory];
  const err = await db.createTransaction(data);
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(201).json({ success: true });
});

app.get('/transactions/', async (req, res) => {
  const response = await db.getAllTransactions();
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

app.get('/transaction/:transactionId/', async (req, res) => {
  const response = await db.getTransactionById(req.params.transactionId);
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

app.get('/user/:userId/transactions/', async (req, res) => {
  // First check if userId is assosciated with a stored account
  let response = await db.getUserById(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If the user doesn't exist, return 404 not found
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }

  // If the user exists, retrieve requested transactions
  response = await db.getUserTransactions(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If no transactions found, return 204
  if (response.context.length === 0) {
    res.status(204).json({
      success: false,
    });
    return;
  }
  // If success, return 200
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

app.get('/user/:userId/transactions/:startDate/:endDate/', async (req, res) => {
  // First check if userId is assosciated with a stored account
  let response = await db.getUserById(req.params.userId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If the user doesn't exist, return 404 not found
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }

  // If the user exists, retrieve requested transactions
  response = await db.getUserTransactionsBetweenDates(req.params.userId, req.params.startDate, req.params.endDate);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If no transactions exist, return 204
  if (response.context.length === 0) {
    res.status(204).json({
      success: true,
    });
    return;
  }
  // If success, return 200
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

// Wildcard route. If any page/resource is requested that isn't valid, redirect to homepage
app.get('*', (req, res) => {
  res.status(404).sendFile(config.www + 'welcomePage.html');
});
