'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('mochawait');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var expect = _chai2['default'].expect;

describe('GroupModel', function () {
    var _this = this;

    var app = _testTestManager2['default'].app;
    var models = app.data.sequelize.models;

    before(function callee$1$0() {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(_testTestManager2['default'].start());

                case 2:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    after(function callee$1$0() {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(_testTestManager2['default'].stop());

                case 2:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });

    it('should list all groups', function callee$1$0() {
        var res;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.Group.findAll({
                        attributes: ['id', 'name']
                    }));

                case 2:
                    res = context$2$0.sent;

                    expect(res.length).to.be.above(0);
                    _lodash2['default'].each(res, function (item) {
                        var group = item.get();
                        //console.log('group: ', item.get());
                        expect(group.name).to.exist;
                    });

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should list permission for a given group', function callee$1$0() {
        var groupName, res, group;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    groupName = 'Admin';
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(models.Group.getPermissions(groupName));

                case 3:
                    res = context$2$0.sent;
                    group = res.get();

                    //console.log("group: ", res.get());
                    expect(group).to.exist;
                    expect(group.Permissions.length).to.be.above(0);
                    _lodash2['default'].each(group.Permissions, function (item) {
                        var permission = item.get();
                        (0, _assert2['default'])(permission);
                        //console.log("permissions: ", permission);
                        expect(permission.name).to.exist;
                        expect(permission.resource).to.exist;
                    });

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should list all permissions', function callee$1$0() {
        var res;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.Permission.findAll({
                        attributes: ['id', 'name', 'resource']
                    }));

                case 2:
                    res = context$2$0.sent;

                    expect(res.length).to.be.above(0);
                    _lodash2['default'].each(res, function (item) {
                        //console.log('permission: ', item.get());
                        (0, _assert2['default'])(item.get().name);
                    });

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should count permissions', function callee$1$0() {
        var count;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.Permission.count());

                case 2:
                    count = context$2$0.sent;

                    expect(count).to.be.above(0);

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should list all groups permissions', function callee$1$0() {
        var res;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.GroupPermission.findAll({
                        attributes: ['group_id', 'permission_id']
                    }));

                case 2:
                    res = context$2$0.sent;

                    _lodash2['default'].each(res, function (item) {
                        //console.log('group permission: ', item.get());
                        (0, _assert2['default'])(item.get().group_id);
                        (0, _assert2['default'])(item.get().permission_id);
                    });

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should not add an unknown group', function (done) {
        models.GroupPermission.add('GroupUnkknown', ['/users get post'])['catch'](function (err) {
            //console.log(err);
            expect(err.name).to.be.equal('GroupNotFound');
        }).then(done, done);
    });
    it('should not add an unknown permission', function (done) {
        models.GroupPermission.add('Admin', ['/usersnotexit get post'])['catch'](function (err) {
            //console.log(err);
            expect(err.name).to.be.equal('PermissionNotFound');
        }).then(done, done);
    });
    it('should list all user - groups', function callee$1$0() {
        var res;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.UserGroup.findAll({
                        attributes: ['user_id', 'group_id']
                    }));

                case 2:
                    res = context$2$0.sent;

                    expect(res.length).to.be.above(0);
                    _lodash2['default'].each(res, function (item) {
                        //console.log('user group: ', item.get());
                        (0, _assert2['default'])(item.get().user_id);
                        (0, _assert2['default'])(item.get().user_id);
                    });

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    function checkUserPermission(param) {
        var authorized;
        return regeneratorRuntime.async(function checkUserPermission$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.User.checkUserPermission(param.userId, param.routePath, param.method));

                case 2:
                    authorized = context$2$0.sent;

                    expect(authorized).to.be.equal(param.authorized);

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    }
    it('should check permission given a user id,  a route path and a method', function (done) {
        var param = {
            userId: 1,
            routePath: '/users/:id',
            method: 'get',
            authorized: true
        };
        return checkUserPermission(param).then(done, done);
    });
    it('should get all groups for a given user', function callee$1$0() {
        var userId, res;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    userId = 1;
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(models.User.find({
                        include: [{ model: models.Group }],
                        where: { id: userId }
                    }));

                case 3:
                    res = context$2$0.sent;

                    //console.log(res);
                    expect(res).to.exist;
                    expect(res.get().username).to.exist;
                    //console.log(res.get().username);
                    expect(res.get().Groups).to.exist;
                    expect(res.get().Groups.length).to.be.above(1);
                    _lodash2['default'].each(res.get().Groups, function (item) {
                        //console.log('group: ', item.get().name);
                        (0, _assert2['default'])(item.get().name);
                    });

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
    it('should get all permission for a given user ', function callee$1$0() {
        var res, user;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(models.User.getPermissions('admin'));

                case 2:
                    res = context$2$0.sent;
                    user = res.get();

                    //console.log(user);
                    _lodash2['default'].each(user.Groups, function (item) {
                        var group = item.get();
                        //console.log("group:", group.name);
                        //console.log("group:", group.permissions);
                        _lodash2['default'].each(group.permissions, function (itemPermission) {
                            var permission = itemPermission.get();
                            (0, _assert2['default'])(permission.name);
                            (0, _assert2['default'])(permission.resource);
                            //console.log("permission name:%s, resource ", permission.name, permission.resource);
                        });
                    });

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, _this);
    });
});