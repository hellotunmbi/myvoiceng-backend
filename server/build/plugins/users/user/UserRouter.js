'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.UserHttpController = UserHttpController;
exports['default'] = UserRouter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa66 = require('koa-66');

var _koa662 = _interopRequireDefault(_koa66);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var log = require('logfilename')(__filename);

function UserHttpController(app, userApi) {
  log.debug("UserHttpController");

  var respond = app.utils.http.respond;
  return {
    getAll: function getAll(context) {
      return regeneratorRuntime.async(function getAll$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, userApi, userApi.getAll, [_qs2['default'].parse(context.request.querystring)]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    getOne: function getOne(context) {
      var userId;
      return regeneratorRuntime.async(function getOne$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            userId = context.params.id;
            return context$2$0.abrupt('return', respond(context, userApi, userApi.getOne, [userId]));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

function UserRouter(app, userApi) {
  var router = new _koa662['default']();
  var userHttpController = UserHttpController(app, userApi);

  //router.use(app.server.auth.isAuthenticated);

  //router.use(app.server.auth.isAuthorized);

  router.get('/', userHttpController.getAll);
  router.get('/:id', userHttpController.getOne);

  app.server.baseRouter().mount("/users", router);
  return router;
}