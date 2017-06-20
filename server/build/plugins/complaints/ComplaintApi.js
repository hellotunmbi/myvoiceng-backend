'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ComplaintApi;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _awaitEach = require('await-each');

var _awaitEach2 = _interopRequireDefault(_awaitEach);

var config = require('config');
var moment = require('moment'),
    Sequelize = require('sequelize-values')();

var log = require('logfilename')(__filename);

/*
uncoment soon for start and End date comparison
const Ajv = require('ajv');
const ajv = Ajv({v5:true,allErrors: true}); // options can be passed, e.g. {allErrors: true}
let valid;
*/

//comment to invalidate token 2

function ComplaintApi(app, rabbitPublisher) {
  var models = app.data.models();
  var validateJson = app.utils.api.validateJson;
  /**
   * @swagger
   * resourcePath: /api/v1/complaint
   * description: All about API
   */
  return {
    /**
     * @swagger
     * path: /api/v1/complaints
     * operations:
     *   -  httpMethod: GET
     *      summary: list complaints
     *      notes: Returns list of all complaints
     *      responseClass: Complaint
     *      nickname: complaint
     *      consumes:
     *        - text/html
     */
    getAll: function getAll() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var result, complaints;
      return regeneratorRuntime.async(function getAll$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _lodash2['default'].defaults(filter, {
              limit: 100,
              order: 'DESC',
              offset: 0
            });
            log.info('getAll ', filter);
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(models.Complaint.findAndCountAll({
              //attributes: ledgerAttr,
              limit: filter.limit,
              order: '"createdAt" ' + filter.order,
              offset: filter.offset,
              include: [{ model: models.Category,
                attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
              }]
            }));

          case 4:
            result = context$2$0.sent;

            log.info('getAll count: ' + result.count);
            complaints = _lodash2['default'].map(result.rows, function (complaint) {
              return complaint.toJSON();
            });
            return context$2$0.abrupt('return', {
              count: result.count,
              data: complaints
            });

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/category
     * operations:
     *   -  httpMethod: GET
     *      summary: list complaint categories
     *      notes: Returns list of all complaint categories
     *      responseClass: Category
     *      nickname: category
     *      consumes:
     *        - text/html
     */
    getAllCategories: function getAllCategories() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var result, categories;
      return regeneratorRuntime.async(function getAllCategories$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            _lodash2['default'].defaults(filter, {
              limit: 100,
              order: 'DESC',
              offset: 0
            });
            log.info('getAll ', filter);
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(models.Category.findAndCountAll({
              //attributes: ledgerAttr,
              limit: filter.limit,
              order: '"createdAt" ' + filter.order,
              offset: filter.offset
            }));

          case 4:
            result = context$2$0.sent;

            log.info('getAll count: ' + result.count);
            categories = _lodash2['default'].map(result.rows, function (category) {
              return category.toJSON();
            });
            return context$2$0.abrupt('return', {
              count: result.count,
              data: categories
            });

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/{id}
     * operations:
     *   -  httpMethod: GET
     *      summary: Show Complaint details
     *      notes: Returns Complaint details
     *      responseClass: Complaint
     *      nickname: complant
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: id
     *          description: Complaint ID
     *          paramType: path
     *          required: true
     *          dataType: number
    */
    getOne: function getOne(id) {
      log.debug("get complaintId: ", id);
      return models.Complaint.findById(id);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/category/{id}
     * operations:
     *   -  httpMethod: GET
     *      summary: Show Category details
     *      notes: Returns Category details
     *      responseClass: Category
     *      nickname: category
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: id
     *          description: Category ID
     *          paramType: path
     *          required: true
     *          dataType: number
    */
    getOneCategory: function getOneCategory(id) {
      log.debug("get categoryId: ", id);
      return models.Category.findById(id);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/
     * operations:
     *   -  httpMethod: POST
     *      summary: Post new complaint
     *      notes: Add new complaint
     *      responseClass: Complaint
     *      nickname: complaint
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Complaint
     *          description: set complaint default value from model schema ->
     *          paramType: body
     *          required: true
     *          dataType: Complaint
    */
    postComplaint: function postComplaint(user, params) {
      var message, status;
      return regeneratorRuntime.async(function postComplaint$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            message = undefined, status = undefined;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.Complaint.addComplaint(params));

          case 3:
            status = true;
            message = "Successful";
            return context$2$0.abrupt('return', {
              success: status,
              message: message
            });

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/{id}
     * operations:
     *   -  httpMethod: PUT
     *      summary: Update a Complaint
     *      notes: Update a complaint
     *      responseClass: Complaint
     *      nickname: complaint
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: id
     *          description: Id
     *          paramType: path
     *          required: true
     *          dataType: number
     *        - name: Complaint
     *          description: set complaint default value from model schema ->
     *          paramType: body
     *          dataType: Complaint
    */
    updateComplaint: function updateComplaint(user, params, id) {
      var message, status;
      return regeneratorRuntime.async(function updateComplaint$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            message = undefined, status = undefined;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.Complaint.updateComplaint(params, id));

          case 3:
            status = true;
            message = "Successful";
            return context$2$0.abrupt('return', {
              success: status,
              message: message
            });

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/category
     * operations:
     *   -  httpMethod: POST
     *      summary: Post new category
     *      notes: Add new category
     *      responseClass: Category
     *      nickname: category
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: Complaint Category
     *          description: set category default value from model schema ->
     *          paramType: body
     *          required: true
     *          dataType: Category
    */
    postCategory: function postCategory(user, params) {
      var message, status;
      return regeneratorRuntime.async(function postCategory$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            message = undefined, status = undefined;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.Category.addCategory(params));

          case 3:
            status = true;
            message = "Successful";
            return context$2$0.abrupt('return', {
              success: status,
              message: message
            });

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    /**
     * @swagger
     * path: /api/v1/complaints/category/{id}
     * operations:
     *   -  httpMethod: PUT
     *      summary: Updatecategory
     *      notes: Update new category
     *      responseClass: Category
     *      nickname: category
     *      consumes:
     *        - text/html
     *      parameters:
     *        - name: id
     *          description: Category Id
     *          paramType: path
     *          required: true
     *          dataType: number
     *        - name: Complaint Category
     *          description: set category default value from model schema ->
     *          paramType: body
     *          dataType: Category
    */
    updateCategory: function updateCategory(user, params, id) {
      var message, status;
      return regeneratorRuntime.async(function updateCategory$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            message = undefined, status = undefined;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.Category.updateCategory(params, id));

          case 3:
            status = true;
            message = "Successful";
            return context$2$0.abrupt('return', {
              success: status,
              message: message
            });

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

/**
 * @swagger
 * models:
 *   Category:
 *     id: Category
 *     properties:
 *       title:
 *         type: String
 *         required: true
*   Complaint:
 *     id: Complaint
 *     properties:
 *       title:
 *         type: String
 *         required: true
 *       body:
 *         type: String
 *         required: true
 *       imageUrl:
 *         type: Array
 *       CategoryId:
 *         type: Number
 */
module.exports = exports['default'];

//validateJson(params, require('./schema/addCategory.json'));

//validateJson(params, require('./schema/addCategory.json'));

//validateJson(params, require('./schema/addCategory.json'));

//validateJson(params, require('./schema/addCategory.json'));