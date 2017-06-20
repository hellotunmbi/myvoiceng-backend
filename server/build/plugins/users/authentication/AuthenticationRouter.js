'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.AuthenticationHttpController = AuthenticationHttpController;
exports['default'] = AuthenticationRouter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa66 = require('koa-66');

var _koa662 = _interopRequireDefault(_koa66);

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var _AuthenticationApi = require('./AuthenticationApi');

var _AuthenticationApi2 = _interopRequireDefault(_AuthenticationApi);

var config = require('config');
//import FacebookTokenStrategy from '../auth-strategy/FacebookTokenStrategy';

var log = require('logfilename')(__filename);

function AuthenticationHttpController(app, publisherUser) {
  log.debug("AuthenticationHttpController");
  var authApi = (0, _AuthenticationApi2['default'])(app, publisherUser);
  var respond = app.utils.http.respond;
  return {
    login: function login(ctx, next) {
      return _koaPassport2['default'].authenticate('local', function (res, info) {
        log.debug("login %s, %s", JSON.stringify(res.user), info);
        if (res.user) {
          ctx.session.cookie.maxage = config.cookie.maxage; //one year
          ctx.body = res.user;
          ctx.login(res.user, function (error) {
            if (error) {
              log.error("login ", error);
              throw error;
            } else {
              log.debug("login ok ");
            }
          });
        } else if (res.error) {
          ctx.status = 401;
          ctx.body = {
            success: false,
            message: res.error.message
          };
        } else {
          ctx.status = 401;
          ctx.body = {
            success: false,
            message: info.message
          };
        }
      })(ctx, next);
    },
    logout: function logout(ctx) {
      log.debug("logout");
      ctx.logout();
      ctx.body = {
        success: true
      };
    },
    register: function register(context) {
      return regeneratorRuntime.async(function register$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.createPending, [context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    verifyEmailCode: function verifyEmailCode(context) {
      return regeneratorRuntime.async(function verifyEmailCode$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.verifyEmailCode, [context.params]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    resetPassword: function resetPassword(context) {
      return regeneratorRuntime.async(function resetPassword$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.resetPassword, [context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    verifyResetPasswordToken: function verifyResetPasswordToken(context) {
      return regeneratorRuntime.async(function verifyResetPasswordToken$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.verifyResetPasswordToken, [context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    newPassword: function newPassword(context) {
      return regeneratorRuntime.async(function newPassword$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.newPassword, [context.params]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    resetPasswordOldNew: function resetPasswordOldNew(context) {
      return regeneratorRuntime.async(function resetPasswordOldNew$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, authApi, authApi.resetPasswordOldNew, [context.passport.user, context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

function AuthenticationRouter(app, publisherUser) {
  var router = new _koa662['default']();
  var authHttpController = AuthenticationHttpController(app, publisherUser);
  router.post('/login', authHttpController.login);
  router.post('/logout', authHttpController.logout);
  router.post('/register', authHttpController.register);
  router.post('/reset_password', authHttpController.resetPassword);
  router.get('/resetPassword/:code', authHttpController.newPassword);
  router.get('/verify_email_code/:code', authHttpController.verifyEmailCode);
  router.post('/verify_reset_password_token', authHttpController.verifyResetPasswordToken);

  //web based
  router.get('/facebook', _koaPassport2['default'].authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback', _koaPassport2['default'].authenticate('facebook', { failureRedirect: '/login', successRedirect: '/login' }));

  ////token based (iOS, android, etc..)
  router.post('/facebook/token', function (ctx, next) {
    return _koaPassport2['default'].authenticate('facebook-token', { scope: ['email'] }, function (user, info, status) {
      console.log('user ' + JSON.stringify(user));
      console.log('info ' + JSON.stringify(info));
      console.log('status ' + JSON.stringify(status));
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false };
      } else {
        ctx.session.cookie.maxage = config.cookie.maxage; //one year
        ctx.status = 200;
        ctx.body = { user: user };

        ctx.login(user, function (error) {
          if (error) {
            log.error("login ", error);
            throw error;
          } else {
            log.debug("login ok ");
          }
        });
      }
    })(ctx, next);
  });

  router.use(app.server.auth.isAuthenticated);
  router.post('/change_password', authHttpController.resetPasswordOldNew);

  app.server.baseRouter().mount('auth', router);

  return router;
}