const config = require('../config.js');
const db = require('./database.js');

const express = require('express');
const bodyParser = require('body-parser');
const googleAuth = require('simple-google-openid');
const auth = googleAuth(config.googleCredentials.web.client_id);

const multer = require('multer');
const fs = require('fs');
const qif2json = require('qif2json');

const readline = require('readline');
const { google } = require('googleapis');

const app = express();

app.use(auth);

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

// Wildcard route. If any page/resource is requested that isn't valid, redirect to homepage
// app.use('/', (req, res) => {
//   res.status(404).sendFile(config.www + '404-not-found.html');
// });

// Set up web server on port specified in config file. Default to port 8080 if there's an error with config.PORT value
app.listen(config.PORT || 8080, (err) => {
  if (!err) {
    console.log(`Server runnning on port ${config.PORT || 8080}!`);
  } else {
    console.log(err);
  }
});


app.get('/favicon/', (req, res) => {
  res.status(200).sendFile(config.www + 'images/Wallet-icon.png');
});

// --- ADMIN API ROUTES ---
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

app.get('/transactions/', async (req, res) => {
  const response = await db.getAllTransactions();
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  if (response.context.length === 0) {
    res.status(204).json({
      success: false,
    });
    return;
  }
  res.status(200).json({
    success: true,
    data: response.context,
  });
});

// All API routes following this point will require Google Authentication
app.use('/', googleAuth.guardMiddleware());

// --- USER API Routes ---

app.post('/user/', jsonParser, async (req, res) => {
  const data = [req.user.id, req.body.name, req.body.email];
  const err = await db.createUser(data);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully created, return 201
  res.status(201).json({ success: true });
});

app.get('/user/', async (req, res) => {
  const response = await db.getUserById(req.user.id);
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

app.patch('/user/', jsonParser, async (req, res) => {
  // Check if the user exists
  const response = await db.getUserById(req.user.id);
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
  const data = [req.body.name, req.body.email, req.user.id];
  const err = await db.updateUser(data);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully updated, return 201
  res.status(201).json({ success: true });
});

app.delete('/user/', async (req, res) => {
  // Check if the user exists
  const response = await db.getUserById(req.user.id);
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
  const err = await db.deleteUser(req.user.id);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully deleted, return 200
  res.status(200).json({ success: true });
});

// --- TRANSACTION API Routes ---

app.post('/transaction/', jsonParser, async (req, res) => {
  // Categories should be stored lower case
  if (req.body.category) {
    req.body.category = req.body.category.toLowerCase();
  } else {
    req.body.category = '';
  }
  if (req.body.subcategory) {
    req.body.subcategory = req.body.subcategory.toLowerCase();
  } else {
    req.body.subcategory = '';
  }

  const data = [req.user.id, req.body.date, req.body.amount, req.body.memo, req.body.address, req.body.payee, req.body.category, req.body.subcategory];
  const err = await db.createTransaction(data);
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(201).json({ success: true });
});

app.get('/transaction/:transactionId/', async (req, res) => {
  const response = await db.getTransactionById(req.params.transactionId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If the transaction wasn't found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  // If the user accessing is not the one linked to the transaction, return 401
  if (response.context.userId !== req.user.id) {
    res.status(401).json({
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

app.get('/user/transactions/', async (req, res) => {
  // First check if userId is assosciated with a stored account
  let response = await db.getUserById(req.user.id);
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
  response = await db.getUserTransactions(req.user.id);
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

app.get('/user/transactions/:startDate/:endDate/', async (req, res) => {
  // First check if userId is assosciated with a stored account
  let response = await db.getUserById(req.user.id);
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
  response = await db.getUserTransactionsBetweenDates(req.user.id, parseInt(req.params.startDate), parseInt(req.params.endDate));
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

app.patch('/transaction/:transactionId/', jsonParser, async (req, res) => {
  // Check if transaction exists
  const response = await db.getTransactionById(req.params.transactionId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If transaction not found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  // If the user accessing is not the one linked to the transaction, return 401
  if (response.context.userId !== req.user.id) {
    res.status(401).json({
      success: false,
    });
    return;
  }
  // Categories should be stored lower case
  if (req.body.category) {
    req.body.category = req.body.category.toLowerCase();
  } else {
    req.body.category = '';
  }
  if (req.body.subcategory) {
    req.body.subcategory = req.body.subcategory.toLowerCase();
  } else {
    req.body.subcategory = '';
  }

  // If transaction exists, proceed with update
  const data = [req.body.date, req.body.amount, req.body.memo, req.body.address, req.body.payee, req.body.category, req.body.subcategory, req.params.transactionId];
  const err = await db.updateTransaction(data);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully updated, return 201
  res.status(201).json({ success: true });
});

app.delete('/transaction/:transactionId/', async (req, res) => {
  // Check if transaction exists
  const response = await db.getTransactionById(req.params.transactionId);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If transaction not found, return 404
  if (!response.context) {
    res.status(404).json({
      success: false,
    });
    return;
  }
  // If the user accessing is not the one linked to the transaction, return 401
  if (response.context.userId !== req.user.id) {
    res.status(401).json({
      success: false,
    });
    return;
  }

  // If transaction exists, proceed with delete
  const err = await db.deleteTransaction(req.params.transactionId);
  // If an error occured, return 400
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  // If user was successfully deleted, return 200
  res.status(200).json({ success: true });
});

app.get('/categories/', async (req, res) => {
  const response = await db.getUserCategories(req.user.id);
  // If an error occured, return 400
  if (response.failed) {
    res.status(400).json({
      success: false,
      data: response.context.message,
    });
    return;
  }
  // If no categories found, return 204
  if (!response.context) {
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

// --- DOCUMENT UPLOAD ---

app.post('/upload-statement/', uploader.single('statement'), async (req, res) => {
  const errors = [];
  // Convert file to JSON array
  await qif2json.parseFile(req.file.path, async (err, qifData) => {
    if (err) {
      res.status(400);
    } else {
      // Format each transaction ready for the database
      await qifData.transactions.forEach(async (transaction) => {
        // Convert date to Unix Timestamp
        transaction.date = qifToUnixTime(transaction.date);
        // Convert address to single string
        if (transaction.address) {
          transaction.address = transaction.address.join(', ');
        }
        // Categories should be stored lower case
        if (transaction.category) {
          transaction.category = transaction.category.toLowerCase();
        } else {
          transaction.category = '';
        }
        if (transaction.subcategory) {
          transaction.subcategory = transaction.subcategory.toLowerCase();
        } else {
          transaction.subcategory = '';
        }

        // Add entry to database
        const data = [req.user.id, transaction.date, transaction.amount, transaction.memo || '', transaction.address || '', transaction.payee, transaction.category, transaction.subcategory];
        const err = await db.createTransaction(data);
        if (err) {
          errors.append(err);
        }
      });
    }
  });
  fs.unlink(req.file.path, (err) => {
    if (err) throw err;
  });
  res.status(201).json({ success: true });
});


function qifToUnixTime(date) {
  const formattedDate = date.split(/[^\d+]/);
  const datum = new Date(Date.UTC(formattedDate[0], formattedDate[1] - 1, formattedDate[2], formattedDate[3], formattedDate[4], formattedDate[5]));
  return datum.getTime();
}

// --- GOOGLE CALENDAR SET UP ---
// https://developers.google.com/calendar/quickstart/nodejs?hl=en_GB

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';


// authorize(listEvents);


// Create an OAuth2 client with the given credentials
function authorize(callback) {
  const oAuth2Client = new google.auth.OAuth2(
    config.googleCredentials.web.client_id,
    config.googleCredentials.web.client_secret,
    config.googleCredentials.web.redirect_uris[0],
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// Get and store new token after prompting for user authorization
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting the url in authorize.txt');
  fs.appendFile('authorize.txt', authUrl + '\n', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// Lists the next 10 events on the user's primary calendar
function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
