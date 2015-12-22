var express = require('express');
var ProductRepo = require('../model/ProductRepository');
var Product = require('../model/Product');
var router = express.Router();

router.post('/', function(req, res, next) {
  var deviceId = req.myDeviceId;
  var repo = new ProductRepo();
  var diffs = req.body;
  console.log("deviceId", deviceId);

  var newDiffsForDevice = repo.sync(deviceId, diffs) || {};

  res.status(200);
  res.json(newDiffsForDevice);
});

module.exports = router;
