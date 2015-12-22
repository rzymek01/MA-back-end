"use strict";

var Product = require('./Product');

var deviceDiffs = {};

var sharedProducts = {};
var sharedParams = {
  lastId: 0
};

/**
 * @param {Boolean=} shared default true
 * @constructor
 */
function ProductRepository(shared) {
  if (shared || shared === undefined) {
    this.products = sharedProducts;
    this.params = sharedParams;
  } else {
    this.products = {};
    this.params = {
      lastId: 0
    };
  }
}

ProductRepository.prototype.getLastId = function() {
  return this.params.lastId;
};

ProductRepository.prototype.nextId = function() {
  return ++this.params.lastId;
};

/**
 * @param {Product} product
 */
ProductRepository.prototype.add = function(product) {
  product.id = this.nextId();
  this.products[this.getLastId()] = product;

  return true;
};

ProductRepository.prototype.update = function(product) {
  var data = this.get(product.id);
  if (data) {
    data.name = product.name || data.name;
    data.amount = (product.amount !== undefined) ? product.amount : data.amount;
    data.picture = (product.picture !== undefined) ? product.picture : data.picture;
    return true;
  }
  return false;
};

/**
 * @param {Product|Number} product
 * @returns {Boolean}
 */
ProductRepository.prototype.delete = function(product) {
  var id = (typeof product === 'object') ? product.id : product;
  var data = this.get(id);
  if (data) {
    delete this.products[data.id];
    return true;
  }
  return false;
};

ProductRepository.prototype.get = function(id) {
  return id && this.products[id];
};

ProductRepository.prototype.getAll = function() {
  return this.products;
};

ProductRepository.prototype.sync = function(deviceId, diffs) {
  var deviceDiff = deviceDiffs[deviceId] || {};
  var newDiff = {};
  var newProductIds = [];
  var that = this;

  Object.keys(diffs).forEach(function(productId) {
    productId = +productId;
    var productDiff = diffs[productId];
    if (null === productDiff) { // remove
      if (productId >= 0) {
        that.delete(productId);
      }
      newDiff[productId] = null;
    } else if (undefined !== productDiff.id) { // add
      that.add(productDiff);
      newDiff[productId] = {
        id: that.getLastId()
      };
      newProductIds.push(that.getLastId());
    } else if (undefined !== productDiff.amount) {
      var amountDelta = productDiff.amount - deviceDiff[productId].amount;
      var product = that.get(productId);
      if (product) {  // product has to exist
        product.amount += amountDelta;
        that.update(product);

        var realAmount = product.amount;
        newDiff[productId] = {
          amount: realAmount
        };
      }
    }
  });

  // add products created on other device
  Object.keys(this.products).forEach(function(srvProductId) {
    srvProductId = +srvProductId;
    if (deviceDiff[srvProductId] || -1 !== newProductIds.indexOf(srvProductId)) {
      // nop
      return;
    }
    newDiff[srvProductId] = that.products[srvProductId];
  });

  // delete products removed on other device
  Object.keys(deviceDiff).forEach(function(productId) {
    productId = +productId;
    if (!that.get(productId)) {
      newDiff[productId] = null;
    }
  });

  // update products modified on other device
  Object.keys(this.products).forEach(function(srvProductId) {
    srvProductId = +srvProductId;
    if (deviceDiff[srvProductId] && -1 === newProductIds.indexOf(srvProductId)) {
      if (that.products[srvProductId].amount !== deviceDiff[srvProductId].amount) {
        newDiff[srvProductId] = {
          amount: that.products[srvProductId].amount
        }
      }
    }
  });

  deviceDiffs[deviceId] = deepCopy(this.products);
  return newDiff;
};

var deepCopy = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = ProductRepository;
