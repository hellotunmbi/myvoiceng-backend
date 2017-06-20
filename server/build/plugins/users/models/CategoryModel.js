'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var Category = sequelize.define('Category', {
    title: DataTypes.STRING(200)
  }, {
    tableName: "Category",
    classMethods: {
      associate: function associate(models) {
        models.Category.hasMany(models.Complaint, { as: 'Complaints' });
      },
      findById: function findById(id) {
        return regeneratorRuntime.async(function findById$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.abrupt('return', this.find({
                where: {
                  id: id
                }
              }).then(function (detailCategory) {
                if (!detailCategory) {
                  // Create the default error container
                  var error = new Error();
                  error.status = 404;error.message = "ERROR_NOT_FOUND";error.code = 404;
                  throw error;
                } else {
                  return detailCategory;
                }
              }));

            case 1:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },
      updateCategory: function updateCategory(json, id) {
        var updateObj;
        return regeneratorRuntime.async(function updateCategory$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              updateObj = {
                title: json.title
              };
              return context$2$0.abrupt('return', Category.update(updateObj, { where: { id: id } }));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },
      addCategory: function addCategory(json) {
        var createObj;
        return regeneratorRuntime.async(function addCategory$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              createObj = {
                title: json.title
              };
              return context$2$0.abrupt('return', Category.create(createObj));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    }
  });

  return Category;
};