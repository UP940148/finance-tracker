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
//    fileSize: 1024 * 1024 * 20,
    files: 1
  },
});

const jsonParser = bodyParser.json();

// This just keeps your computer from sleeping whilst web server is running
try {
  const stayAwake = require('stay-awake');
  stayAwake.prevent(function(err, data) {
    console.log(`${data} routines are preventing sleep!\nYour computer will stay awake whilst this process is running\n`);
  });
} catch {
  console.log("non-essential development module not found: 'stay-awake'\nSkipping\n");
}

app.use('/', express.static(config.www, {index: 'welcomePage.html', extension: ['HTML'] }));

// Set up web server on port specified in config file. Default to port 8080 if there's an error with config.PORT value
app.listen(config.PORT || 8080, (err) => {
  console.log(`Server runnning on port ${config.PORT || 8080}!`);
});

// qif2json.parseFile('./test.qif', function(err, qifData) {
//   console.log(err || qifData);
// })
