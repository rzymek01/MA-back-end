"use strict";

var crypto = require('crypto');

//@link http://restcookbook.com/Basics/loggingin/
var auth = function(authHeader, dateHeader) {
  console.log('[auth]', authHeader, dateHeader);
  //@todo: parse header
  //@todo: get user's password (hash) from user repo
  //@todo: build hmac based on auth and date headers
  //@todo: compare hmacs

  // hmac test%40test.pl:123:a1b2c3
  // 1447117410
  // hmac <user-email>:<nonce-token>:<hmac>
  // <timestamp>

  return true;
};

//var crypto = require('crypto');
//(later)var msg = "GET+/users/foo/financialrecords+20apr201312:59:24+123456"));
//var msg = "<timestamp>+<nonce-token>"));
//var hash = crypto.createHmac('SHA256', "secret/pwd-hash").update(msg).digest('base64');
//

//var shasum = crypto.createHash('sha256');
//shasum.update(d);
//shasum.digest('hex');

module.exports = auth;
