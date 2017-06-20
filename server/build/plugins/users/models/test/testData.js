'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Data', function () {
  var _this = this;

  var app = _testTestManager2['default'].app;
  var models = app.data.sequelize.models;
  it('seed tha database', function callee$1$0() {
    var userCount, groupCount, permissionCount;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(app.seed());

        case 2:
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(models.User.count());

        case 4:
          userCount = context$2$0.sent;

          (0, _assert2['default'])(userCount > 0);

          context$2$0.next = 8;
          return regeneratorRuntime.awrap(models.Group.count());

        case 8:
          groupCount = context$2$0.sent;

          (0, _assert2['default'])(groupCount > 0);

          context$2$0.next = 12;
          return regeneratorRuntime.awrap(models.Permission.count());

        case 12:
          permissionCount = context$2$0.sent;

          (0, _assert2['default'])(permissionCount > 0);

        case 14:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});