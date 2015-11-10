var express = require('express');
var UserRepo = require('../model/UserRepository');
var User = require('../model/User');
var router = express.Router();

router.get('/', function(req, res, next) {
  var repo = new UserRepo();
  var products = repo.getAll();
  res.json(products);
});

router.post('/', function(req, res, next) {
  var repo = new UserRepo();
  var clientData = req.body;
  var user = new User(clientData.email, clientData.password);
  var success = repo.add(user);
  if (success) {
    res.status(201).set('Location', '/users/' + encodeURIComponent(user.email));
    res.json(user);
  } else {
    res.status(409).end();
  }
});

router.put('/:email', function(req, res, next) {
  var repo = new UserRepo();
  var clientData = req.body;
  var user = new User(decodeURIComponent(req.param('email')), clientData.password);
  var success = repo.update(user);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

router.delete('/:email', function(req, res, next) {
  var repo = new UserRepo();
  var userEmail = decodeURIComponent(req.param('email'));
  var success = repo.delete(userEmail);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
