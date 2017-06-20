'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var Complaint = sequelize.define('Complaint', {
    title: DataTypes.STRING(200),
    body: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.JSON,
      get: function get() {
        var imageUrlSet = this.getDataValue('imageUrl');
        if (!Array.isArray(imageUrlSet)) {
          var imageUrlTemp = imageUrlSet;
          imageUrlSet = new Array();
          imageUrlSet.push(imageUrlTemp);
        }
        return imageUrlSet;
      }
    }
  }, {
    tableName: "complaint",
    classMethods: {
      associate: function associate(models) {
        Complaint.belongsTo(models.Category);
      },
      findById: function findById(id) {
        return regeneratorRuntime.async(function findById$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.abrupt('return', this.find({
                where: {
                  id: id
                },
                include: [{ model: models.Category,
                  attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
                }]
              }).then(function (detailComplaint) {
                if (!detailComplaint) {
                  // Create the default error container
                  var error = new Error();
                  error.status = 404;error.message = "ERROR_NOT_FOUND";error.code = 404;
                  throw error;
                } else {
                  return detailComplaint;
                }
              }));

            case 1:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },
      updateComplaint: function updateComplaint(json, id) {
        var updateObj;
        return regeneratorRuntime.async(function updateComplaint$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              updateObj = {
                title: json.title,
                body: json.body,
                imageUrl: json.imageUrl,
                CategoryId: json.CategoryId
              };
              return context$2$0.abrupt('return', Complaint.update(updateObj, { where: { id: id } }));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },
      addComplaint: function addComplaint(json) {
        var createObj;
        return regeneratorRuntime.async(function addComplaint$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              createObj = {
                title: json.title,
                body: json.body,
                imageUrl: json.imageUrl,
                CategoryId: json.CategoryId
              };
              return context$2$0.abrupt('return', Complaint.create(createObj));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    }
  });

  return Complaint;
};