'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('mochawait');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var chance = require('chance')();

//let fixtures = require(__dirname + '/../fixtures/models/users');

describe('UserModel', function () {
  var _this = this;

  var models = _testTestManager2['default'].app.data.sequelize.models;
  var userModel = models.User;

  before(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].start());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].stop());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('should successfully create an entry', function callee$1$0() {
    var username, userConfig, userCreated, isMatch;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          username = chance.name();
          userConfig = {
            username: username,
            password: "password",
            email: username + "@mail.com"
          };
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(userModel.createUserInGroups(userConfig, ["User"]));

        case 4:
          userCreated = context$2$0.sent;

          (0, _assert2['default'])(userCreated);
          context$2$0.next = 8;
          return regeneratorRuntime.awrap(userCreated.comparePassword(userConfig.password));

        case 8:
          isMatch = context$2$0.sent;

          (0, _assert2['default'])(isMatch);

          // should not create the user 2 times
          context$2$0.prev = 10;
          context$2$0.next = 13;
          return regeneratorRuntime.awrap(userModel.createUserInGroups(userConfig, ["User"]));

        case 13:
          (0, _assert2['default'])(false);
          context$2$0.next = 20;
          break;

        case 16:
          context$2$0.prev = 16;
          context$2$0.t0 = context$2$0['catch'](10);

          _assert2['default'].equal(context$2$0.t0.name, "SequelizeUniqueConstraintError");
          // mail or username, depending on sqlite or postgres
          (0, _assert2['default'])(context$2$0.t0.errors[0].message.includes("must be unique"));

        case 20:
          context$2$0.next = 22;
          return regeneratorRuntime.awrap(userCreated.destroy());

        case 22:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[10, 16]]);
  });

  it('should not create an empty entry', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(userModel.create({}));

        case 3:
          context$2$0.next = 9;
          break;

        case 5:
          context$2$0.prev = 5;
          context$2$0.t0 = context$2$0['catch'](0);

          _assert2['default'].equal(context$2$0.t0.name, "SequelizeValidationError");
          _assert2['default'].equal(context$2$0.t0.errors[0].message, "username cannot be null");

        case 9:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 5]]);
  });
  it('should find the user ', function callee$1$0() {
    var res, userJson;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(userModel.findByUsername('alice'));

        case 2:
          res = context$2$0.sent;

          (0, _assert2['default'])(res);
          (0, _assert2['default'])(res.get().username);
          (0, _assert2['default'])(!res.get().password);
          (0, _assert2['default'])(res.get().passwordHash);
          userJson = res.toJSON();

          (0, _assert2['default'])(!userJson.password);

        case 9:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('should not create a user with invalid group', function callee$1$0() {
    var username, userConfig;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          username = chance.name();
          userConfig = {
            username: username,
            password: "password",
            email: username + "@mail.com"
          };
          context$2$0.prev = 2;
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(userModel.createUserInGroups(userConfig, ["GroupNotExist"]));

        case 5:
          context$2$0.next = 10;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](2);

          _assert2['default'].equal(context$2$0.t0.name, "GroupNotFound");

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[2, 7]]);
  });

  it('should count users', function callee$1$0() {
    var count;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(userModel.count());

        case 2:
          count = context$2$0.sent;

          (0, _assert2['default'])(count > 0);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should list users', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(userModel.findAll({ attributes: ['id', 'username'] }));

        case 2:
          res = context$2$0.sent;

          (0, _assert2['default'])(res);
          _lodash2['default'].each(res, function (user) {
            //console.log("user: ", user.get());
            (0, _assert2['default'])(user.get().username);
          });

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should find admin user, with attributes', function callee$1$0() {
    var adminUsername, res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          adminUsername = 'admin';
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(userModel.find({
            attributes: ['id', 'username'],
            where: {
              username: adminUsername
            }
          }));

        case 3:
          res = context$2$0.sent;

          (0, _assert2['default'])(res.get().username);

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});