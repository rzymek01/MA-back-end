"use strict";

var User = require('./User');

var sharedUsers = {};
var sharedParams = {};

/**
 * @param {Boolean=} shared default true
 * @constructor
 */
function UserRepository(shared) {
  if (shared || shared === undefined) {
    this.users = sharedUsers;
    this.params = sharedParams;
  } else {
    this.users = {};
    this.params = {};
  }
}

/**
 * @param {User} user
 */
UserRepository.prototype.add = function(user) {
  if (this.get(user.email)) {
    return false;
  }

  this.users[user.email] = user;
  return true;
};

UserRepository.prototype.update = function(user) {
  var data = this.get(user.email);
  if (data) {
    data.password = user.password || data.password;
    return true;
  }
  return false;
};

/**
 * @param {User|String} user
 * @returns {Boolean}
 */
UserRepository.prototype.delete = function(user) {
  var id = (typeof user === 'object') ? user.email : user;
  var data = this.get(id);
  if (data) {
    delete this.users[data.email];
    return true;
  }
  return false;
};

UserRepository.prototype.get = function(email) {
  return email && this.users[email];
};

UserRepository.prototype.getAll = function() {
  var result = {},
    users = this.users;
  Object.keys(users).forEach(function (key) {
    result[key] = {
      email: users[key].email
    };
  });
  return result;
};

module.exports = UserRepository;
