"use strict";

/**
 * @param {String} email
 * @param {String} password sha256
 * @constructor
 */
function User(email, password) {
  this.email = email;
  this.password = password;
}

module.exports = User;
