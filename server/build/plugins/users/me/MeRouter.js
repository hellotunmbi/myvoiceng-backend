'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.MeHttpController = MeHttpController;
exports['default'] = MeRouter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa66 = require('koa-66');

var _koa662 = _interopRequireDefault(_koa66);

var _MeApi = require('./MeApi');

var _MeApi2 = _interopRequireDefault(_MeApi);

var log = require('logfilename')(__filename);

function MeHttpController(app) {
  log.debug("MeHttpController");
  var respond = app.utils.http.respond;
  var meApi = (0, _MeApi2['default'])(app);
  return {
    get: function get(context) {
      return regeneratorRuntime.async(function get$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, meApi, meApi.getByUserId, [context.passport.user.id]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    patch: function patch(context) {
      return regeneratorRuntime.async(function patch$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, meApi, meApi.patch, [context.passport.user.id, context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

function MeRouter(app) {
  var router = new _koa662['default']();
  var meHttpController = MeHttpController(app);
  router.use(app.server.auth.isAuthenticated);
  router.get('/', meHttpController.get);
  router.patch('/', meHttpController.patch);
  app.server.baseRouter().mount("/me", router);
  return router;
}