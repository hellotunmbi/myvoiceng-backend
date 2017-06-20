let FacebookTokenStrategy = require('passport-facebook-token');
let config = require('config');

let log = require('logfilename')(__filename);

export async function verify(models, publisherUser, req, accessToken, refreshToken, profile) {
  log.debug("facebook token authentication request");
  log.debug("request from user: " + JSON.stringify(req, null, 4));

  if (!req.platform && !req.deviceToken) {
    return {
      success: false,
      message: "missing either platform or deviceToken required fields"
    };
  }

  let user = await models.User.find({
    where: {
      facebookId: profile.id
    }
  });

  if (user) {
    log.debug("user already exist: ", user.toJSON());
    return {
      user: user.toJSON()
    };
  }

  log.debug("no fb profile registered");
  let userByEmail = await models.User.find({
    where: {
      email: profile._json.email
    }
  });

  if (userByEmail) {
    log.debug("email already registered");
    //should update fb profile id
    return {
      user: userByEmail.toJSON()
    };
  }

  log.debug('facebook profile returned ' + JSON.stringify(profile));

  let city,country = '';

  try {
    city = profile._json.location.location.city;
    country = profile._json.location.location.country;
  } catch (e) {
    //idea here is that these arn't required values, just move on
    log.warn('Could not get users location');
  }

  //Create user
  let userConfig = {
    username: `${profile.name.givenName} ${profile.name.middleName} ${profile.name.familyName}`,
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
  user = await models.User.createUserInGroups(userConfig, ["User"], profile);
  await models.ChatUser.createPlatformUser(user, req.platform, req.deviceToken);
  let userCreated = user.toJSON();
  log.info("register created new user ", userCreated);
  if(publisherUser){
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    user: userCreated
  };
}

export function register(passport, models, publisherUser) {

  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook token authentication strategy");
    let facebookStrategy = new FacebookTokenStrategy({
        clientID: authenticationFbConfig.clientID,
        clientSecret: authenticationFbConfig.clientSecret,
        callbackURL: authenticationFbConfig.callbackURL,
        profileFields: ['id', 'email', 'first_name', 'last_name', 'birthday', 'location{location}'],
        enableProof: false,
        passReqToCallback: true
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          let res = await verify(models, publisherUser, req.body, accessToken, refreshToken, profile);
          done(res.err, res.user);
        } catch(err){
          done(err);
        }
      });
    passport.use('facebook-token', facebookStrategy);
  }
};
