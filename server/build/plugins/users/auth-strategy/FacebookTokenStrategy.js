'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.verify = verify;
exports.register = register;
var FacebookTokenStrategy = require('passport-facebook-token');
var config = require('config');

var log = require('logfilename')(__filename);

function verify(models, publisherUser, req, accessToken, refreshToken, profile) {
  var user, userByEmail, city, country, userConfig, userCreated;
  return regeneratorRuntime.async(function verify$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        log.debug("facebook token authentication request");
        log.debug("request from user: " + JSON.stringify(req, null, 4));

        if (!(!req.platform && !req.deviceToken)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return', {
          success: false,
          message: "missing either platform or deviceToken required fields"
        });

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(models.User.find({
          where: {
            facebookId: profile.id
          }
        }));

      case 6:
        user = context$1$0.sent;

        if (!user) {
          context$1$0.next = 10;
          break;
        }

        log.debug("user already exist: ", user.toJSON());
        return context$1$0.abrupt('return', {
          user: user.toJSON()
        });

      case 10:

        log.debug("no fb profile registered");
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(models.User.find({
          where: {
            email: profile._json.email
          }
        }));

      case 13:
        userByEmail = context$1$0.sent;

        if (!userByEmail) {
          context$1$0.next = 17;
          break;
        }

        log.debug("email already registered");
        //should update fb profile id
        return context$1$0.abrupt('return', {
          user: userByEmail.toJSON()
        });

      case 17:

        log.debug('facebook profile returned ' + JSON.stringify(profile));

        city = undefined, country = '';

        try {
          city = profile._json.location.location.city;
          country = profile._json.location.location.country;
        } catch (e) {
          //idea here is that these arn't required values, just move on
          log.warn('Could not get users location');
        }

        //Create user
        userConfig = {
          username: profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
          email: profile._json.email,
          firstName: profile._json.first_name,
          lastName: profile._json.last_name,
          birthday: profile._json.birthday,
          city: city,
          country: country,
          facebookId: profile.id,
          type: req.type
        };

        log.debug("creating user: ", userConfig);
        context$1$0.next = 24;
        return regeneratorRuntime.awrap(models.User.createUserInGroups(userConfig, ["User"], profile));

      case 24:
        user = context$1$0.sent;
        context$1$0.next = 27;
        return regeneratorRuntime.awrap(models.ChatUser.createPlatformUser(user, req.platform, req.deviceToken));

      case 27:
        userCreated = user.toJSON();

        log.info("register created new user ", userCreated);

        if (!publisherUser) {
          context$1$0.next = 32;
          break;
        }

        context$1$0.next = 32;
        return regeneratorRuntime.awrap(publisherUser.publish("user.registered", JSON.stringify(userCreated)));

      case 32:
        return context$1$0.abrupt('return', {
          user: userCreated
        });

      case 33:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function register(passport, models, publisherUser) {

  var authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook token authentication strategy");
    var facebookStrategy = new FacebookTokenStrategy({
      clientID: authenticationFbConfig.clientID,
      clientSecret: authenticationFbConfig.clientSecret,
      callbackURL: authenticationFbConfig.callbackURL,
      profileFields: ['id', 'email', 'first_name', 'last_name', 'birthday', 'location{location}'],
      enableProof: false,
      passReqToCallback: true
    }, function callee$1$0(req, accessToken, refreshToken, profile, done) {
      var res;
      return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(verify(models, publisherUser, req.body, accessToken, refreshToken, profile));

          case 3:
            res = context$2$0.sent;

            done(res.err, res.user);
            context$2$0.next = 10;
            break;

          case 7:
            context$2$0.prev = 7;
            context$2$0.t0 = context$2$0['catch'](0);

            done(context$2$0.t0);

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 7]]);
    });
    passport.use('facebook-token', facebookStrategy);
  }
}

;