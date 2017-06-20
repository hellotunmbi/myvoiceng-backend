'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Users', function () {
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

  describe('Admin', function () {
    before(function callee$2$0() {
      var res;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            client = _testTestManager2['default'].client('admin');
            (0, _assert2['default'])(client);
            context$3$0.next = 4;
            return regeneratorRuntime.awrap(client.login());

          case 4:
            res = context$3$0.sent;

            (0, _assert2['default'])(res);

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should get all users', function callee$2$0() {
      var users, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, userGetOne;

      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(client.get('v1/users'));

          case 2:
            users = context$3$0.sent;

            (0, _assert2['default'])(users);
            (0, _assert2['default'])(Number.isInteger(users.count));
            (0, _assert2['default'])(users.data);

            console.log(users);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$3$0.prev = 10;
            _iterator = users.data[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              context$3$0.next = 23;
              break;
            }

            user = _step.value;
            context$3$0.next = 16;
            return regeneratorRuntime.awrap(client.get('v1/users/' + user.id));

          case 16:
            userGetOne = context$3$0.sent;

            (0, _assert2['default'])(userGetOne);
            console.log('user ', userGetOne);
            _lodash2['default'].isEqual(user, userGetOne);

          case 20:
            _iteratorNormalCompletion = true;
            context$3$0.next = 12;
            break;

          case 23:
            context$3$0.next = 29;
            break;

          case 25:
            context$3$0.prev = 25;
            context$3$0.t0 = context$3$0['catch'](10);
            _didIteratorError = true;
            _iteratorError = context$3$0.t0;

          case 29:
            context$3$0.prev = 29;
            context$3$0.prev = 30;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 32:
            context$3$0.prev = 32;

            if (!_didIteratorError) {
              context$3$0.next = 35;
              break;
            }

            throw _iteratorError;

          case 35:
            return context$3$0.finish(32);

          case 36:
            return context$3$0.finish(29);

          case 37:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[10, 25, 29, 37], [30,, 32, 36]]);
    });
    it('should get all users with filter ASC', function callee$2$0() {
      var res;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(client.get('v1/users?offset=1&order=ASC&limit=10'));

          case 2:
            res = context$3$0.sent;

            _assert2['default'].equal(res.data.length, 10);
            //console.log(res.data[0])
            _assert2['default'].equal(res.data[0].id, 2);

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should get all users with filter DESC', function callee$2$0() {
      var res;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(client.get('v1/users?offset=10&limit=10'));

          case 2:
            res = context$3$0.sent;

            _assert2['default'].equal(res.data.length, 10);

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should get one user', function callee$2$0() {
      var user;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(client.get('v1/users/1'));

          case 2:
            user = context$3$0.sent;

            (0, _assert2['default'])(user);

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it.skip('should not create a new user with missing username', function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(client.post('v1/users'));

          case 3:
            (0, _assert2['default'])(false);
            context$3$0.next = 10;
            break;

          case 6:
            context$3$0.prev = 6;
            context$3$0.t0 = context$3$0['catch'](0);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.statusCode, 400);

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 6]]);
    });
  });
  describe('User Basic ', function () {
    before(function callee$2$0() {
      var res;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            client = _testTestManager2['default'].client('alice');
            (0, _assert2['default'])(client);
            context$3$0.next = 4;
            return regeneratorRuntime.awrap(client.login());

          case 4:
            res = context$3$0.sent;

            (0, _assert2['default'])(res);

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('should not list on all users', function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(client.get('v1/users'));

          case 3:
            (0, _assert2['default'])(false);
            context$3$0.next = 10;
            break;

          case 6:
            context$3$0.prev = 6;
            context$3$0.t0 = context$3$0['catch'](0);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.statusCode, 401);

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 6]]);
    });
  });
});