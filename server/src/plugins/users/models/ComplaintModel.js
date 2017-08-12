'use strict';
import _ from 'lodash';

module.exports = function(sequelize, DataTypes) {
  let log = require('logfilename')(__filename);
  let models = sequelize.models;

  var Complaint = sequelize.define('Complaint', {
    title: DataTypes.STRING(200),
    body: DataTypes.TEXT,
    imageUrl: {
      type :DataTypes.JSON,
      get : function() {
        let imageUrlSet = this.getDataValue('imageUrl');
        if (!Array.isArray(imageUrlSet)) {
          let imageUrlTemp = imageUrlSet;
          imageUrlSet = new Array();
          imageUrlSet.push(imageUrlTemp);
        }
        return imageUrlSet;
      }
    },
  }, {
    tableName:"complaint",
    classMethods: {
      associate: function(models) {
        Complaint.belongsTo(models.Category);
      },
      findById: async function findById(id) {
        return this.find(
          {
            where: {
              id: id
            },
            include: [{model: models.Category,
              attributes: { exclude: ['id','createdAt','updatedAt'] }
            }]
          }).then(function (detailComplaint) {
          if (!detailComplaint) {
              // Create the default error container
              let error = new Error();
              error.status = 404; error.message = "ERROR_NOT_FOUND"; error.code = 404;
              throw error;
              }
              else
              {
                return detailComplaint;
              }
          });
      },
      updateComplaint: async function(json, id) {
      let updateObj = {
        title: json.title,
        body: json.body,
        imageUrl: json.imageUrl,
        CategoryId: json.CategoryId
      };
      return Complaint.update(updateObj, {where: {id: id}});
      },
      addComplaint: async function(json) {
        let createObj = {
          title: json.title,
          body: json.body,
          imageUrl: json.imageUrl,
          CategoryId: json.CategoryId
        };
        return Complaint.create(createObj);
      },
      deleteComplaint: async function deleteJob(id) {
        return Complaint.destroy({where:{ id: id}});
      }
    }
  });

  return Complaint;
};