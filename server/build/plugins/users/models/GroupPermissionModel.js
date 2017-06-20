'use strict';

var log = require('logfilename')(__filename);
var _ = require('lodash');

module.exports = function (sequelize /*, DataTypes*/) {

  var models = sequelize.models;
  var GroupPermission = sequelize.define('GroupPermission', {}, {
    tableName: "group_permissions",
    classMethods: {
      add: add,
      seedDefault: seedDefault
    }
  });

  function seedDefault() {
    var groupPermissionsJson, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, groupName;

    return regeneratorRuntime.async(function seedDefault$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          groupPermissionsJson = require('./fixtures/group_permission.json');

          log.debug('seedDefault: ', JSON.stringify(groupPermissionsJson, null, 4));
          //console.log('creating all groupPermissions:',groupsPermissions)
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          context$2$0.prev = 5;
          _iterator = _.keys(groupPermissionsJson)[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            context$2$0.next = 14;
            break;
          }

          groupName = _step.value;
          context$2$0.next = 11;
          return regeneratorRuntime.awrap(add(groupName, groupPermissionsJson[groupName]));

        case 11:
          _iteratorNormalCompletion = true;
          context$2$0.next = 7;
          break;

        case 14:
          context$2$0.next = 20;
          break;

        case 16:
          context$2$0.prev = 16;
          context$2$0.t0 = context$2$0['catch'](5);
          _didIteratorError = true;
          _iteratorError = context$2$0.t0;

        case 20:
          context$2$0.prev = 20;
          context$2$0.prev = 21;

          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }

        case 23:
          context$2$0.prev = 23;

          if (!_didIteratorError) {
            context$2$0.next = 26;
            break;
          }

          throw _iteratorError;

        case 26:
          return context$2$0.finish(23);

        case 27:
          return context$2$0.finish(20);

        case 28:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[5, 16, 20, 28], [21,, 23, 27]]);
  }
  /**
   * Creates in the db all the groupPermissions within permissionsNames associated with the groupName
   *
   * @param {String} groupName  - Name of the group for which we want to add permissions
   * @param {Array} permissionsNames - Array of permissions names linked with the group
   *
   * @returns {Promise} returns a list of Promises results
   */
  function add(groupName, permissionsNames) {
    var group, err, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, permission, permissionFound;

    return regeneratorRuntime.async(function add$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          log.debug('add: group ' + groupName + ', permissionsNames ' + permissionsNames);
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(models.Group.findByName(groupName));

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
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          context$2$0.prev = 11;
          _iterator2 = permissionsNames[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            context$2$0.next = 29;
            break;
          }

          permission = _step2.value;

          log.debug('check permission: ' + permission);
          context$2$0.next = 18;
          return regeneratorRuntime.awrap(models.Permission.findByName(permission));

        case 18:
          permissionFound = context$2$0.sent;

          if (permissionFound) {
            context$2$0.next = 23;
            break;
          }

          log.debug("PermissionNotFound");
          err = { name: 'PermissionNotFound', message: permission };
          throw err;

        case 23:
          log.debug('add: groupId: ' + group.get().id + ', permissionsId: ' + permissionFound.get().id);

          context$2$0.next = 26;
          return regeneratorRuntime.awrap(GroupPermission.create({
            group_id: group.get().id,
            permission_id: permissionFound.get().id
          }));

        case 26:
          _iteratorNormalCompletion2 = true;
          context$2$0.next = 13;
          break;

        case 29:
          context$2$0.next = 35;
          break;

        case 31:
          context$2$0.prev = 31;
          context$2$0.t0 = context$2$0['catch'](11);
          _didIteratorError2 = true;
          _iteratorError2 = context$2$0.t0;

        case 35:
          context$2$0.prev = 35;
          context$2$0.prev = 36;

          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }

        case 38:
          context$2$0.prev = 38;

          if (!_didIteratorError2) {
            context$2$0.next = 41;
            break;
          }

          throw _iteratorError2;

        case 41:
          return context$2$0.finish(38);

        case 42:
          return context$2$0.finish(35);

        case 43:
          ;

        case 44:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[11, 31, 35, 43], [36,, 38, 42]]);
  }

  return GroupPermission;
};