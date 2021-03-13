const config = require('../config.js');
const db = require('./database.js');

const express = require('express');
const bodyParser = require('body-parser');
const stayAwake = require('stay-awake');
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

stayAwake.prevent(function(err, data) {
  console.log(`${data} routines are preventing sleep!\nYour computer will stay awake whilst this process is running\n`);
});

app.use('/', express.static(config.www, {index: 'welcomePage.html', extension: ['HTML'] }));

app.listen(config.PORT || 8080, (err) => {
  console.log(`Server runnning on port ${config.PORT || 8080}!`);
});



// qif2json.parseFile('./test.qif', function(err, qifData) {
//   console.log(err || qifData);
// })
