var UserRepo = require('../model/UserRepository');
var User = require('../model/User');

module.exports = function() {
  var repo = new UserRepo();
  var user = new User('admin@example.com', 'admin');
  var success = repo.add(user);

  return success;
};
