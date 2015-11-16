"use strict";

var crypto = require('crypto');
var UserRepo = require('../model/UserRepository');

//@link http://restcookbook.com/Basics/loggingin/
var auth = function(authHeader, dateHeader) {
  console.log('[auth]', authHeader, dateHeader);

  var headerParts = parseAuthHeader(authHeader);
  if (!headerParts) {
    return false;
  }

  var userRepo = new UserRepo();
  var user = userRepo.get(headerParts.email);

  if (!user) {
    console.log('[auth] user has not been found');
    return false;
  }

  var hmac = computeHMAC(headerParts, dateHeader, user);

  return (hmac === headerParts.hmac);
};


/**
 * Header should have the following format:
 * hmac <user-email>:<nonce-token>:<hmac>
 * e.g.
 * hmac test%40test.pl:123:a1b2c3
 *
 * @param {String} header
 * @returns {Object}
 */
var parseAuthHeader = function(header) {
  var PREFIX = 'hmac ';
  var parts;

  if (!header) {
    console.log('[auth] empty Authorization header?');
    return null;
  }
  if (!header.startsWith(PREFIX)) {
    console.log('[auth] unsupported authentication method');
    return null;
  }

  parts = header.substr(PREFIX.length).split(':');
  if (3 !== parts.length) {
    console.log('[auth] incorrect header format for', PREFIX);
    return null;
  }

  return {
    email: parts[0],
    token: parts[1],
    hmac: parts[2]
  };
};

/**
 *
 * @param {Object} headerParts
 * @param {String} dateHeader
 * @param {User} user
 */
var computeHMAC = function(headerParts, dateHeader, user) {
  var msg = '+' + headerParts.token;
  //var msg = "<timestamp>+<nonce-token>")); @todo
  var hash = crypto.createHmac('SHA256', user.password).update(msg).digest('base64');

  return hash;
};

module.exports = auth;
