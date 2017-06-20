'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _restauth = require('restauth');

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Authentication', function () {
  var _this = this;

  var client = undefined;

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

  describe('After Login', function () {
    beforeEach(function callee$2$0() {
      var postParam;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            postParam = {
              password: "password",
              username: "alice@mail.com"
            };
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(client.login(postParam));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('should logout', function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(client.post('v1/auth/logout'));

          case 2:
            context$3$0.prev = 2;
            context$3$0.next = 5;
            return regeneratorRuntime.awrap(client.get('v1/auth/session'));

          case 5:
            (0, _assert2['default'])(false);
            context$3$0.next = 11;
            break;

          case 8:
            context$3$0.prev = 8;
            context$3$0.t0 = context$3$0['catch'](2);

            (0, _assert2['default'])(context$3$0.t0);

          case 11:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[2, 8]]);
    });
  });

  it('login without parameters should return bad request', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.login());

        case 3:
          (0, _assert2['default'])(false);
          context$2$0.next = 10;
          break;

        case 6:
          context$2$0.prev = 6;
          context$2$0.t0 = context$2$0['catch'](0);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          //assert.equal(err.body, "Bad Request");

        case 10:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 6]]);
  });

  it('logout without login should fail', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.post('v1/auth/logout'));

        case 3:
          context$2$0.next = 9;
          break;

        case 5:
          context$2$0.prev = 5;
          context$2$0.t0 = context$2$0['catch'](0);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          //assert.equal(err.body, "Unauthorized");

        case 9:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 5]]);
  });

  it('session without login should fail', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.get('v1/me'));

        case 3:
          (0, _assert2['default'])(false);
          context$2$0.next = 11;
          break;

        case 6:
          context$2$0.prev = 6;
          context$2$0.t0 = context$2$0['catch'](0);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          _assert2['default'].equal(context$2$0.t0.body, "Unauthorized");

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 6]]);
  });

  it('should not login with unknown username', function callee$1$0() {
    var postParam;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          postParam = {
            username: "idonotexist",
            password: "password"
          };
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(client.login(postParam));

        case 4:
          (0, _assert2['default'])(false);
          context$2$0.next = 11;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](1);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          //assert.equal(err.body, "Unauthorized");

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 7]]);
  });

  it('should not login with empty password', function callee$1$0() {
    var postParam;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          postParam = {
            username: "bob"
          };
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(client.login(postParam));

        case 4:
          (0, _assert2['default'])(false);
          context$2$0.next = 11;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](1);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          //assert.equal(err.body, "Bad Request");

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 7]]);
  });

  it('should not login with wrong password', function callee$1$0() {
    var postParam;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          postParam = {
            username: "admin",
            password: "passwordaaaaaa"
          };
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(client.login(postParam));

        case 4:
          (0, _assert2['default'])(false);
          context$2$0.next = 11;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](1);

          (0, _assert2['default'])(context$2$0.t0);
          _assert2['default'].equal(context$2$0.t0.statusCode, 401);
          //assert.equal(err.body, "Unauthorized");

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 7]]);
  });
  it('should login with params', function callee$1$0() {
    var postParam, user;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          postParam = {
            username: "alice",
            password: "password",
            email: "alice@mail.com"
          };
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.login(postParam));

        case 3:
          user = context$2$0.sent;

          (0, _assert2['default'])(user);
          _assert2['default'].equal(user.username, postParam.username);
          (0, _assert2['default'])(!user.password);
          (0, _assert2['default'])(!user.passwordHash);

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('should login admin with testManager', function callee$1$0() {
    var clientAdmin, user;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          clientAdmin = _testTestManager2['default'].client("admin");
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(clientAdmin.login());

        case 3:
          user = context$2$0.sent;

          (0, _assert2['default'])(user);
          _assert2['default'].equal(user.username, "admin");

        case 6:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});

//assert(false);