"use strict";

var Product = require('./Product');

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
 * @param {User} product
 */
ProductRepository.prototype.add = function(product) {
  product.setId(this.nextId());
  this.products[this.getLastId()] = product;

  return true;
};

ProductRepository.prototype.update = function(product) {
  var data = this.get(product.id);
  if (data) {
    data.name = product.name || data.name;
    data.amount = product.amount || data.amount;
    data.picture = product.picture || data.picture;
    return true;
  }
  return false;
};

/**
 * @param {User|Number} product
 * @returns {boolean}
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

module.exports = ProductRepository;
