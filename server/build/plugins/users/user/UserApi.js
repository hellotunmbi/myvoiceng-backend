'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = UserApi;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var log = require('logfilename')(__filename);

function UserApi(app) {
  var models = app.data.models();
  var validateJson = app.utils.api.validateJson;

  /**
   * @swagger
   * resourcePath: /api/v1/users
   * description: All about API
   */

  return {
    /**
     * @swagger
     * path: /api/v1/users
     * operations:
     *   -  httpMethod: GET
     *      summary: list registered users
     *      notes: Returns list of all users
     *      responseClass: User
     *      nickname: user
     *      consumes:
     *        - text/html
     */
    getAll: function getAll() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var result, users;
      return regeneratorRuntime.async(function getAll$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _lodash2['default'].defaults(filter, {
              limit: 100,
              order: 'DESC',
              offset: 0
            });
            log.info('getAll ', filter);
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(models.User.findAndCountAll({
              //attributes: ledgerAttr,
              limit: filter.limit,
              order: '"createdAt" ' + filter.order,
              offset: filter.offset
            }));

          case 4:
            result = context$2$0.sent;

            log.info('getAll count: ' + result.count);
            users = _lodash2['default'].map(result.rows, function (user) {
              return user.toJSON();
            });
            return context$2$0.abrupt('return', {
              count: result.count,
              data: users
            });

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    getOne: function getOne(userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    }
  };
}

module.exports = exports['default'];