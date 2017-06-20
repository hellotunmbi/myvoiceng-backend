'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = PassportMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var log = require('logfilename')(__filename);

function PassportMiddleware(app, kaoApp, config) {
  kaoApp.use(_koaPassport2['default'].initialize());
  kaoApp.use(_koaPassport2['default'].session());

  var models = app.data.sequelize.models;

  return {
    isAuthenticated: function isAuthenticated(context, next) {
      log.debug("isAuthenticated ", context.request.url);
      if (!context.isAuthenticated()) {
        log.info("isAuthenticated KO: ", context.request.url);
        context.status = 401;
        context.body = { success: false, message: "Unauthorized, Please login" };
      } else {
        return next();
      }
    },
    isAuthorized: function isAuthorized(context, next) {
      var request, re, routePath, userId, method, authorized;
      return regeneratorRuntime.async(function isAuthorized$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            request = context.request;

            if (!context.passport.user) {
              log.warn("isAuthorized user not set");
              context.status = 401;
              context.body = "Unauthorized";
            }

            re = new RegExp("^(" + config.http.ver + ")");
            routePath = context.route.path.replace(re, "");
            userId = context.passport.user.id;
            method = request.method;

            log.info('isAuthorized: who:' + userId + ', resource:' + routePath + ', method: ' + method);

            context$2$0.prev = 7;
            context$2$0.next = 10;
            return regeneratorRuntime.awrap(models.User.checkUserPermission(userId, routePath, method));

          case 10:
            authorized = context$2$0.sent;

            log.info("isAuthorized ", authorized);

            if (!authorized) {
              context$2$0.next = 16;
              break;
            }

            return context$2$0.abrupt('return', next());

          case 16:
            context.status = 401;

          case 17:
            context$2$0.next = 22;
            break;

          case 19:
            context$2$0.prev = 19;
            context$2$0.t0 = context$2$0['catch'](7);

            log.error("isAuthorized: ", context$2$0.t0);

          case 22:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[7, 19]]);
    }
  };
}

module.exports = exports['default'];