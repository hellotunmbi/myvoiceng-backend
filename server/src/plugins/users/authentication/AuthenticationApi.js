import _ from 'lodash';
import Log from 'logfilename';
import Chance from 'chance';
let chance = new Chance();
import fs from 'fs';

let readFileThunk = function(src) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {encoding: 'utf8'}, function (err, data) {
      if(err) return reject(err);
      resolve(data);
    });
  });
};

export default function(app, publisherUser) {
  let models = app.data.sequelize.models;
  let log = new Log(__filename);
  let validateJson = app.utils.api.validateJson;
  return {
    async createPending(userPendingIn) {
      validateJson(userPendingIn, require('./schema/createPending.json'));
      let userType = userPendingIn.type;

      if (userType != "Worker" && userType != "Employer") {
        return {
          success: false,
          message: "Invalid user type, allowed values. type:[Worker, Employer]"
        };
      }

      log.debug("createPending: ", userPendingIn);
      let user = await models.User.findByEmail(userPendingIn.email);

      if (!user) {
        let code = createToken();
        let userPendingOut = {
          code: code,
          firstName: userPendingIn.firstName,
          lastName: userPendingIn.lastName,
          email: userPendingIn.email,
          password: userPendingIn.password,
          type: userPendingIn.type,
          platform: userPendingIn.platform,
          deviceToken: userPendingIn.deviceToken
        };
        log.info("createPending code ", userPendingOut.code);
        await models.UserPending.create(userPendingOut);
        delete userPendingOut.password;
        await publisherUser.publish("user.registering", JSON.stringify(userPendingOut));
      } else if (user) {
        log.info("already registered", userPendingIn.email);
        return {
          success: false,
          user: user.toJSON(),
          message: "This email account has already been registered, please click 'forgot password' on the sign in screen if you cannot recall your password"
        };
      }
      return {
        success: true,
        message: "confirm email"
      };
    },
    async verifyEmailCode(param){
      log.debug("verifyEmailCode: ", param);
      validateJson(param, require('./schema/verifyEmailCode.json'));
      let res = await models.UserPending.find({
        where: {
          code: param.code
        }
      });

      if(res){
        let userPending = res.get();
        log.debug("verifyEmailCode: userPending: ", userPending);
        let userToCreate = _.pick(userPending, 'firstName', 'lastName', 'email', 'passwordHash', 'type', 'platform', 'deviceToken');
        //TODO transaction
        let user = await models.User.createUserInGroups(userToCreate, ["User"]);
        await models.ChatUser.createPlatformUser(user, userToCreate.platform, userToCreate.deviceToken, app.server.io);
        await models.UserPending.destroy({
          where:{
            email:userToCreate.email
          }
        });
        log.debug("verifyEmailCode: created user ", user.toJSON());
        await publisherUser.publish("user.registered", JSON.stringify(user.toJSON()));
        return {
            success:true,
            message: "Thanks for confirming your registration, please login via the app"
          };
      } else {
        log.warn("verifyEmailCode: no such code ", param.code);
        throw {
          code:422,
          name:"NoSuchCode"
        };
      }
    },
    async resetPassword(payload){
      validateJson(payload, require('./schema/resetPassword.json'));
      let email = payload.email;
      log.info("resetPassword: ", email);
      let user = await models.User.findByEmail(email);
      if(user){
        log.info("resetPassword: find user: ", user.get());
        let token = createToken();
        let passwordReset = {
          token: token,
          user_id: user.id
        };
        await models.PasswordReset.upsert(passwordReset);
        // send password reset email with the token.
        let passwordResetPublished = {
          code: token,
          email: user.email
        };
        log.debug("resetPassword: publish: ", passwordResetPublished);
        await publisherUser.publish('user.resetpassword', JSON.stringify(passwordResetPublished));
      } else {
        log.info("resetPassword: no such email: ", email);
      }

      return {
        success:true
      };
    },
    async resetPasswordOldNew(loggedInUser, payload){
      validateJson(payload, require('./schema/resetOldNewPassword.json'));
      // find the user
      let user = await models.User.findById(loggedInUser.id);

      if(user && payload.oldPassword && payload.newPassword){
        const comparePassword = await user.comparePassword(payload.oldPassword);
        if (comparePassword) {
          await user.update({password: payload.newPassword});
          return {
            success:true
          };
        } else {
          return {
            success:false,
            message: "Old password is not correct."
          };
        }
      }

      return {
        success:false,
        message: "Could not find logged in user."
      };
    },
    async verifyResetPasswordToken(payload){
      validateJson(payload, require('./schema/verifyResetPasswordToken.json'));
      let {token, password} = payload;

      log.info("verifyResetPasswordToken: ", token);
      // Has the token expired ?

      // find the user
      let user = await models.User.find({
        include: [{
          model: models.PasswordReset,
          where: {
            token: token
          },
        }]
      });
      log.info("verifyResetPasswordToken: password ", password);

      if(user){
        await user.update({password: password});
        //TODO delete token
        return {
          success:true
        };
      } else {
        log.warn("verifyResetPasswordToken: no such token ", token);

        throw {
          code:422,
          name:"TokenInvalid"
        };
      }
    }
    ,
    async newPassword(payload){
      log.info("serving new password page", payload);
      return await readFileThunk(__dirname + '/public/resetPassword.html');
    }
  };
}

function createToken(){
  return chance.string({
    length: 16,
    pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });
}
