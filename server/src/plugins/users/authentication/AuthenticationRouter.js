import Router from 'koa-66';
import passport from 'koa-passport';
import AuthenticationApi from './AuthenticationApi';
let config = require('config');
//import FacebookTokenStrategy from '../auth-strategy/FacebookTokenStrategy';

let log = require('logfilename')(__filename);

export function AuthenticationHttpController(app, publisherUser){
  log.debug("AuthenticationHttpController");
  let authApi = AuthenticationApi(app, publisherUser);
  let respond = app.utils.http.respond;
  return {
    login(ctx, next) {
      return passport.authenticate('local', function (res, info) {
        log.debug("login %s, %s", JSON.stringify(res.user), info);
        if (res.user) {
          ctx.session.cookie.maxage = config.cookie.maxage; //one year
          ctx.body = res.user;
          ctx.login(res.user, error => {
            if(error){
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
        }
        else {
          ctx.status = 401;
          ctx.body = {
            success: false,
            message: info.message
          };
        }
      })(ctx, next);
    },
    logout(ctx) {
      log.debug("logout");
      ctx.logout();
      ctx.body = {
        success: true
      };
    },
    async register(context){
      return respond(context, authApi, authApi.createPending, [context.request.body]);
    },
    async verifyEmailCode(context){
      return respond(context, authApi, authApi.verifyEmailCode, [context.params]);
    },
    async resetPassword(context){
      return respond(context, authApi, authApi.resetPassword, [context.request.body]);
    },
    async verifyResetPasswordToken(context){
      return respond(context, authApi, authApi.verifyResetPasswordToken, [context.request.body]);
    },
    async newPassword(context){
      return respond(context, authApi, authApi.newPassword, [context.params]);
    },
    async resetPasswordOldNew(context){
      return respond(context, authApi, authApi.resetPasswordOldNew, [context.passport.user, context.request.body]);
    }
  };
}

export default function AuthenticationRouter(app, publisherUser){
  let router = new Router();
  let authHttpController = AuthenticationHttpController(app, publisherUser);
  router.post('/login', authHttpController.login);
  router.post('/logout', authHttpController.logout);
  router.post('/register', authHttpController.register);
  router.post('/reset_password', authHttpController.resetPassword);
  router.get('/resetPassword/:code', authHttpController.newPassword);
  router.get('/verify_email_code/:code', authHttpController.verifyEmailCode);
  router.post('/verify_reset_password_token', authHttpController.verifyResetPasswordToken);

  //web based
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', successRedirect : '/login'}));

  ////token based (iOS, android, etc..)
  router.post('/facebook/token', function(ctx, next) {
    return passport.authenticate('facebook-token', { scope: ['email'] }, function(user, info, status) {
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

        ctx.login(user, error => {
          if(error){
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
