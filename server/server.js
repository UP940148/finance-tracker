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
  console.log(`Server runnning on port ${config.PORT || 8080}!`);
});

// qif2json.parseFile('./test.qif', function(err, qifData) {
//   console.log(err || qifData);
// })

app.get('/favicon', (req, res) => {
  res.sendFile(config.www + 'images/Wallet-icon.png');
});

app.post('/user/', jsonParser, async (req, res) => {
  const data = [req.body.googleId, req.body.name, req.body.email];
  const err = await db.createUser(data);
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(201).json({ success: true });
});

app.get('/users/', async (req, res) => {
  const response = await db.getAllUsers();
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

app.get('/user/:googleId', async (req, res) => {
  const response = await db.getUserById(req.params.googleId);
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

app.patch('/user/:googleId', jsonParser, async (req, res) => {
  const data = [req.params.googleId, req.body.name, req.body.email];
  const err = await db.updateUser(data);
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(201).json({ success: true });
});

app.delete('/user/:googleId', async (req, res) => {
  const err = await db.deleteUser(req.params.googleId);
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(200).json({ success: true });
});

// Wildcard route. If any page/resource is requested that isn't valid, redirect to homepage
app.get('*', (req, res) => {
  res.status(404).sendFile(config.www + 'welcomePage.html');
});
