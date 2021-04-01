const path = require('path');

module.exports.www = path.join(__dirname, '/www/');
module.exports.uploads = path.join(__dirname, '/server/uploads/');

module.exports.DBSOURCE = 'sqlite.db';
module.exports.PORT = 8080;

// module.exports.OAUTH_CLIENT_ID = '30685749470-rd1biepfdvcmtpigdahj4ui4r45hnnua.apps.googleusercontent.com';

module.exports.googleCredentials = {
  web:
  {
    client_id: '30685749470-rd1biepfdvcmtpigdahj4ui4r45hnnua.apps.googleusercontent.com',
    project_id: 'budgeting-for-students-app',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: 'BJwg0q0zFtm5cUqm2pS0Vfx3',
    redirect_uris:
    [
      'http://localhost:8080',
    ],
    javascript_origins:
    [
      'http://localhost:8080',
    ],
  },
};
