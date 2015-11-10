"use strict";

/**
 *
 * @param {String} name
 * @param {Number=} amount
 * @param {String=} picture
 * @param {Number=} id
 * @constructor
 */
function Product(name, amount, picture, id) {
  this.name = name;
  this.amount = amount || 0;
  this.picture = picture || '';
  this.id = id || null;
}

/**
 *
 * @param {Number} id
 */
Product.prototype.setId = function(id) {
  this.id = id;
};

module.exports = Product;
