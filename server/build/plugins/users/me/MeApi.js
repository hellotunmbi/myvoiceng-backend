'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = MeApi;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var log = require('logfilename')(__filename);

function MeApi(app) {
  var models = app.data.models();
  var validateJson = app.utils.api.validateJson;

  return {
    getByUserId: function getByUserId(userId) {
      var user;
      return regeneratorRuntime.async(function getByUserId$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.debug("index userId: ", userId);
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.User.findByUserId(userId));

          case 3:
            user = context$2$0.sent;

            log.debug("index user: ", user.get());
            return context$2$0.abrupt('return', _lodash2['default'].omit(user.toJSON(), 'id'));

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    patch: function patch(userId, data) {
      return regeneratorRuntime.async(function patch$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            validateJson(data, require('./schema/patch.json'));
            log.debug("patch userId %s, data: ", userId, data);
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(models.User.update({
              username: data.username
            }, {
              where: {
                id: userId
              }
            }));

          case 4:
            log.debug("patch done");
            return context$2$0.abrupt('return', data);

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

module.exports = exports['default'];