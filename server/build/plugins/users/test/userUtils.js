'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _async2 = require('async');

var _async3 = _interopRequireDefault(_async2);

var chance = require('chance')();

exports['default'] = function () {
  return {
    createBulk: function createBulk(models, client) {
      var userCount = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
      var limit = arguments.length <= 3 || arguments[3] === undefined ? 2 : arguments[3];
      return regeneratorRuntime.async(function createBulk$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', new _bluebird2['default'](function (resolve, reject) {
              _async3['default'].timesLimit(userCount, limit, function callee$3$0(i, next) {
                var userConfig;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                  while (1) switch (context$4$0.prev = context$4$0.next) {
                    case 0:
                      context$4$0.prev = 0;
                      context$4$0.next = 3;
                      return regeneratorRuntime.awrap(this.registerRandom(models, client));

                    case 3:
                      userConfig = context$4$0.sent;

                      next(null, userConfig);
                      context$4$0.next = 11;
                      break;

                    case 7:
                      context$4$0.prev = 7;
                      context$4$0.t0 = context$4$0['catch'](0);

                      console.error("error creating user: ", context$4$0.t0);
                      next(context$4$0.t0);

                    case 11:
                    case 'end':
                      return context$4$0.stop();
                  }
                }, null, _this, [[0, 7]]);
              }, function (err, results) {
                (0, _assert2['default'])(err === null, err + " passed instead of 'null'");
                (0, _assert2['default'])(results);
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    createRandomRegisterConfig: function createRandomRegisterConfig() {
      var username = chance.first() + '.' + chance.first() + '.' + chance.last();
      var userConfig = {
        username: username,
        password: 'password',
        email: username + "@mail.com"
      };
      return userConfig;
    },
    registerRandom: function registerRandom(models, client) {
      var userConfig, res, userPending, user;
      return regeneratorRuntime.async(function registerRandom$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            userConfig = this.createRandomRegisterConfig();
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(client.post('v1/auth/register', userConfig));

          case 3:
            res = context$2$0.sent;

            (0, _assert2['default'])(res);
            (0, _assert2['default'])(res.success);
            _assert2['default'].equal(res.message, "confirm email");

            //Retrieve the code in the db
            context$2$0.next = 9;
            return regeneratorRuntime.awrap(models.UserPending.find({
              where: {
                email: userConfig.email
              }
            }));

          case 9:
            res = context$2$0.sent;

            (0, _assert2['default'])(res);
            userPending = res.get();

            _assert2['default'].equal(userPending.username, userConfig.username);
            _assert2['default'].equal(userPending.email, userConfig.email);
            (0, _assert2['default'])(userPending.code);

            //console.log("verify user ", userConfig);
            context$2$0.next = 17;
            return regeneratorRuntime.awrap(client.post('v1/auth/verify_email_code', { code: userPending.code }));

          case 17:
            context$2$0.next = 19;
            return regeneratorRuntime.awrap(models.User.find({
              where: {
                email: userConfig.email
              }
            }));

          case 19:
            res = context$2$0.sent;

            (0, _assert2['default'])(res);
            user = res.toJSON();

            _assert2['default'].equal(user.username, userConfig.username);
            _assert2['default'].equal(user.email, userConfig.email);
            //console.log("user created ", user);
            return context$2$0.abrupt('return', userConfig);

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
    /*,
    createRandomUser: async function (){
      let username = chance.name();
      let userConfig = {
          username: username,
          password: "password",
          email: username + "@mail.com"
      };
      let userCreated = await models.User.createUserInGroups(userConfig, ["User"]);
      return userCreated;
    }
    */
  };
};

;
module.exports = exports['default'];