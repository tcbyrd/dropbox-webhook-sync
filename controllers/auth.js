// controllers/auth.js
'use strict';

const request = require('request');

function getToken(code, callback) {
  request.post({
    url: 'https://api.dropboxapi.com/oauth2/token',
    qs: {
      code: code,
      grant_type: 'authorization_code',
      client_id: process.env.DROPBOX_APP_KEY,
      client_secret: process.env.DROPBOX_APP_SECRET
    }
  }, callback);
}

exports.new = (req, res) => {
  res.render('auth/new');
}

exports.getCode = (req, res) => {
  let authorizeUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${process.env.DROPBOX_APP_KEY}`;
  res.redirect(authorizeUrl);
}

exports.create = (req, res) => {
  let code = req.body.code;
  
  if (!code) {
    res.status(400).send('Invalid request. Missing code parameter.');
    return;
  }
  
  getToken(code, (error, request, body) => {
    let data = JSON.parse(body);
    
    if (request.statusCode != 200) {
      res.status(request.statusCode).json(data);
      return;
    }

    req.session.token = data.access_token;
    res.redirect('/');
  });
}

exports.logout = (req, res) => {
  req.session = null;
  res.redirect('/');
};
