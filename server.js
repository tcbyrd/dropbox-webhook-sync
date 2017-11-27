// server.js
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const config = require('./config/config');
var app = express();

app.set('trust proxy', 1); // trust first proxy
app.set('views', config.root + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieSession({
  name: 'session',
  secret: 'dropbox-auth-secret',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month
}));

app.get('/webhook', (req, res) => {
  res.send(req.query.challenge)
})

app.post('/webhook', bodyParser.json(), (req, res) => {
  let body = req.body
  if (body) {
    let accounts = body.list_folder  
    const { process } = require('./controllers/dropbox')
    process()
  }
  
  res.sendStatus(200)
})
// Redirect to /auth/new if token doesn't exist
app.use((req, res, next) => {
  // Skip /auth routes
  if (/\/auth/i.test(req.path)) {
    next();
    return;
  }
  
  // Check for token
  if (req.session.token) {
    next();
  } else {
    res.redirect('/auth/new');
  }
});

require('./config/routes')(app);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
