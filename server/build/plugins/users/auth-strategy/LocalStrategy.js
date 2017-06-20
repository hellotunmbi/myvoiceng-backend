'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.verifyLogin = verifyLogin;
exports.register = register;

var _passportLocal = require('passport-local');

var log = require('logfilename')(__filename);

function verifyLogin(models, username, password) {
  var res, user, result;
  return regeneratorRuntime.async(function verifyLogin$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        log.debug("loginStrategy username: ", username);
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(models.UserPending.find({
          where: {
            $or: [{ email: username }]
          }
        }));

      case 3:
        res = context$1$0.sent;

        if (!res) {
          context$1$0.next = 7;
          break;
        }

        log.info("user is pending registration: ", username);
        return context$1$0.abrupt('return', {
          error: {
            message: 'Please confirm your email address before logging in'
          }
        });

      case 7:
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(models.User.find({
          where: {
            $or: [{ email: username }]
          }
        }));

      case 9:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 13;
          break;
        }

        log.info("userBasic invalid username user: ", username);
        return context$1$0.abrupt('return', {
          error: {
            message: 'Invalid Username Or Password'
          }
        });

      case 13:
        context$1$0.next = 15;
        return regeneratorRuntime.awrap(user.comparePassword(password));

      case 15:
        result = context$1$0.sent;

        if (!result) {
          context$1$0.next = 21;
          break;
        }

        log.debug("userBasic valid password for user: ", user.toJSON());
        return context$1$0.abrupt('return', {
          user: user.toJSON()
        });

      case 21:
        log.info("userBasic invalid password user: ", user.get());
        return context$1$0.abrupt('return', {
          error: {
            message: 'Invalid Username Or Password'
          }
        });

      case 23:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function register(passport, models) {
  log.debug("register");
  var loginStrategy = new _passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
  }, function callee$1$0(username, password, done) {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(verifyLogin(models, username, password));

        case 3:
          res = context$2$0.sent;

          log.debug("result %s", JSON.stringify(res));
          done(res.err, res);
          context$2$0.next = 11;
          break;

        case 8:
          context$2$0.prev = 8;
          context$2$0.t0 = context$2$0['catch'](0);

          done(context$2$0.t0);

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[0, 8]]);
  });

  passport.use('local', loginStrategy);
}

;

//log.info("userBasic user: ", user.get());