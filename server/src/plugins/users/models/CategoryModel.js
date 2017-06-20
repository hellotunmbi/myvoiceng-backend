'use strict';
import _ from 'lodash';

module.exports = function(sequelize, DataTypes) {
  let log = require('logfilename')(__filename);
  let models = sequelize.models;

  var Category = sequelize.define('Category', {
    title: DataTypes.STRING(200), 
  }, {
    tableName:"Category",
    classMethods: {
      associate: function(models) {
        models.Category.hasMany(models.Complaint, {as: 'Complaints'});
      },
      findById: async function findById(id) {
        return this.find(
          {
            where: {
              id: id
            }
          }).then(function (detailCategory) {
            if (!detailCategory) {
            // Create the default error container
            let error = new Error();
            error.status = 404; error.message = "ERROR_NOT_FOUND"; error.code = 404;
            throw error;
            }
            else
            {
              return detailCategory;
            }
        });
      },
      updateCategory: async function(json, id) {
        let updateObj = {
          title: json.title
        };
        return Category.update(updateObj, {where: {id: id}});
      },
      addCategory: async function(json) {
        let createObj = {
          title: json.title
        };
        return Category.create(createObj);
      },
    }
  });

  return Category;
};