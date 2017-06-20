'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var _userUtils = require('./userUtils');

var _userUtils2 = _interopRequireDefault(_userUtils);

var assert = require('assert');

describe('UserRegister', function () {
  var _this = this;

  var app = _testTestManager2['default'].app;
  this.timeout(600e3);
  var models = app.data.models();
  var client = undefined;
  var sandbox = undefined;
  var userUtils = (0, _userUtils2['default'])();
  before(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].start());

        case 2:
          sandbox = _sinon2['default'].sandbox.create();
          assert(app.plugins);
          _sinon2['default'].stub(app.plugins.get().users.publisher, "publish", function (key, msg) {
            //console.log("publish has been called");
            //assert.equal(key, "user.registered");
            assert(msg);
          });

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          sandbox.restore();
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(_testTestManager2['default'].stop());

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  beforeEach(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          client = _testTestManager2['default'].createClient();

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('shoud register up to n users', function callee$1$0() {
    var countBefore, usersToAdd, limit, countAfter;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(models.User.count());

        case 2:
          countBefore = context$2$0.sent;

          assert(countBefore > 0);
          usersToAdd = 100;
          limit = 1;
          context$2$0.next = 8;
          return regeneratorRuntime.awrap(userUtils.createBulk(models, client, usersToAdd, limit));

        case 8:
          context$2$0.next = 10;
          return regeneratorRuntime.awrap(models.User.count());

        case 10:
          countAfter = context$2$0.sent;

          console.log("users to add ", usersToAdd);
          console.log("#users before ", countBefore);
          console.log("#users after ", countAfter);

          assert.equal(countBefore + usersToAdd, countAfter);

        case 15:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('shoud register a user', function callee$1$0() {
    var userConfig, res, loginParam, loginRes;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(userUtils.registerRandom(models, client));

        case 2:
          userConfig = context$2$0.sent;
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(models.UserPending.find({
            where: {
              email: userConfig.email
            }
          }));

        case 5:
          res = context$2$0.sent;

          assert(!res);

          // registering when user is already registered
          context$2$0.next = 9;
          return regeneratorRuntime.awrap(client.post('v1/auth/register', userConfig));

        case 9:
          res = context$2$0.sent;

          assert(res);
          assert(res.success);
          assert.equal(res.message, "confirm email");

          // Should login now
          loginParam = {
            password: userConfig.password,
            username: userConfig.email
          };
          context$2$0.next = 16;
          return regeneratorRuntime.awrap(client.login(loginParam));

        case 16:
          loginRes = context$2$0.sent;

          assert(loginRes);
          //console.log(loginRes);

        case 18:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('invalid email code', function callee$1$0(done) {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.post('v1/auth/verify_email_code', { code: "1234567890123456" }));

        case 3:
          context$2$0.next = 10;
          break;

        case 5:
          context$2$0.prev = 5;
          context$2$0.t0 = context$2$0['catch'](0);

          assert.equal(context$2$0.t0.statusCode, 422);
          assert.equal(context$2$0.t0.body.name, "NoSuchCode");
          done();

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 5]]);
  });
  it('malformed email code', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.post('v1/auth/verify_email_code', { code: "123456789012345" }));

        case 3:
          assert(false);
          context$2$0.next = 10;
          break;

        case 6:
          context$2$0.prev = 6;
          context$2$0.t0 = context$2$0['catch'](0);

          assert.equal(context$2$0.t0.statusCode, 400);
          assert.equal(context$2$0.t0.body.validation[0].stack, "instance.code does not meet minimum length of 16");

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 6]]);
  });
  it('invalid register username too short', function callee$1$0() {
    var registerDataKo;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          registerDataKo = { username: "aa", password: "aaaaaa" };
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(client.post('v1/auth/register', registerDataKo));

        case 4:
          assert(false);
          context$2$0.next = 12;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](1);

          console.log(context$2$0.t0.body);
          assert.equal(context$2$0.t0.statusCode, 400);
          assert.equal(context$2$0.t0.body.validation[0].stack, 'instance.username does not meet minimum length of 3');

        case 12:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 7]]);
  });
  it('shoud register twice a user', function callee$1$0() {
    var userConfig, res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          userConfig = userUtils.createRandomRegisterConfig();
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.post('v1/auth/register', userConfig));

        case 3:
          res = context$2$0.sent;

          assert(res);
          assert(res.success);
          assert.equal(res.message, "confirm email");
          context$2$0.next = 9;
          return regeneratorRuntime.awrap(client.post('v1/auth/register', userConfig));

        case 9:
          res = context$2$0.sent;

          assert(res);
          assert(res.success);
          assert.equal(res.message, "confirm email");

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});

// Limit to 1 when using sqlite

//The user shoud no longer be in the user_pendings table