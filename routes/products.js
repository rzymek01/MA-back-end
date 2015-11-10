var express = require('express');
var ProductRepo = require('../model/ProductRepository');
var Product = require('../model/Product');
var router = express.Router();

router.get('/', function(req, res, next) {
  var repo = new ProductRepo();
  var products = repo.getAll();
  res.json(products);
});

router.post('/', function(req, res, next) {
  var repo = new ProductRepo();
  var clientData = req.body;
  var product = new Product(clientData.name, clientData.amount, clientData.picture);
  var success = repo.add(product);
  if (success) {
    res.status(201).set('Location', '/products/' + product.id);
    res.json(product);
  } else {
    res.status(422).send('Unprocessable Entity');
  }
});

router.put('/:id', function(req, res, next) {
  var repo = new ProductRepo();
  var clientData = req.body;
  var product = new Product(clientData.name, clientData.amount, clientData.picture, req.param('id'));
  var success = repo.update(product);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', function(req, res, next) {
  var repo = new ProductRepo();
  var productId = +req.param('id');
  var success = repo.delete(productId);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
