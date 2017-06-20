'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var _koaServer = require('./koaServer');

var _koaServer2 = _interopRequireDefault(_koaServer);

describe('Koa', function () {
  var _this = this;

  it('start and stop ok', function callee$1$0() {
    var server;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          server = (0, _koaServer2['default'])(_testTestManager2['default'].app);
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(server.start());

        case 3:
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(server.stop());

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});