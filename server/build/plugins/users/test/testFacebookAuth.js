'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _restauth = require('restauth');

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Facebook', function () {
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

  it('should login', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(client.get("v1/auth/facebook"));

        case 2:
          res = context$2$0.sent;

          (0, _assert2['default'])(res);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it('should invoke callback', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(client.get("v1/auth/facebook/callback"));

        case 2:
          res = context$2$0.sent;

          (0, _assert2['default'])(res);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});