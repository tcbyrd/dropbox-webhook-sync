// config/routes.js
'use strict';

module.exports = (app) => {
  var dropbox = require('../controllers/dropbox');
  app.get('/', dropbox.index);
  
  var auth = require('../controllers/auth');
  app.get('/auth/new', auth.new);
  app.get('/auth/code', auth.getCode);
  app.post('/auth', auth.create);
  app.get('/logout', auth.logout);
  
};
