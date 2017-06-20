'use strict';

var assert = require('assert');
var log = require('logfilename')(__filename);

module.exports = function (sequelize, DataTypes) {

  var models = sequelize.models;
  assert(models);

  var UserGroup = sequelize.define('UserGroup', {
    name: DataTypes.TEXT
  }, {
    tableName: "user_groups",
    classMethods: {
      addUserIdInGroup: addUserIdInGroup,
      addUserIdInGroups: addUserIdInGroups
    }
  });

  /**
    * Creates in the db userGroup association between group name and userId
    * @param {Array} groups  - Name of the group for which we want to add the user
    * @param {String} userId   -   userId to be added to the group   *
    * @returns {Promise} returns a  Promise containing the results of the upsert
    */
  function addUserIdInGroups(groups, userId, t) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, group;

    return regeneratorRuntime.async(function addUserIdInGroups$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          log.debug('addUserIdInGroups user:' + userId + ', #groups ' + groups.length);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          context$2$0.prev = 4;
          _iterator = groups[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            context$2$0.next = 13;
            break;
          }

          group = _step.value;
          context$2$0.next = 10;
          return regeneratorRuntime.awrap(UserGroup.addUserIdInGroup(group, userId, t));

        case 10:
          _iteratorNormalCompletion = true;
          context$2$0.next = 6;
          break;

        case 13:
          context$2$0.next = 19;
          break;

        case 15:
          context$2$0.prev = 15;
          context$2$0.t0 = context$2$0['catch'](4);
          _didIteratorError = true;
          _iteratorError = context$2$0.t0;

        case 19:
          context$2$0.prev = 19;
          context$2$0.prev = 20;

          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }

        case 22:
          context$2$0.prev = 22;

          if (!_didIteratorError) {
            context$2$0.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return context$2$0.finish(22);

        case 26:
          return context$2$0.finish(19);

        case 27:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[4, 15, 19, 27], [20,, 22, 26]]);
  }
  /**
   * Creates in the db userGroup association between groupname and userId
   * @param {String} groupName  - Name of the group for which we want to add the user
   * @param {String} userId   -   userId to be added to the group   *
   * @returns {Promise} returns a  Promise containing the results of the upsert
   */
  function addUserIdInGroup(groupName, userId, t) {
    var group, err;
    return regeneratorRuntime.async(function addUserIdInGroup$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          log.debug('addUserIdInGroup user:' + userId + ', group: ' + groupName);
          //let group = await models.Group.findByName(groupName);
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(models.Group.find({
            where: { name: groupName }
          }, { transaction: t }));

        case 3:
          group = context$2$0.sent;

          if (group) {
            context$2$0.next = 7;
            break;
          }

          err = { name: 'GroupNotFound', message: groupName };
          throw err;

        case 7:
          ;
          //log.debug(`addUserIdInGroup upsert to user:${userId} group: ${group.get().id}`);
          return context$2$0.abrupt('return', UserGroup.upsert({
            group_id: group.get().id,
            user_id: userId
          }, { transaction: t }));

        case 9:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  return UserGroup;
};