'use strict';
import _ from 'lodash';
import awaitEach from 'await-each';
let config = require('config');
const moment = require('moment'),
  Sequelize = require('sequelize-values')();

let log = require('logfilename')(__filename);

/*
uncoment soon for start and End date comparison
const Ajv = require('ajv');
const ajv = Ajv({v5:true,allErrors: true}); // options can be passed, e.g. {allErrors: true}
let valid;
*/

//comment to invalidate token 2



export default function ComplaintApi(app, rabbitPublisher) {
  const models = app.data.models();
  const validateJson = app.utils.api.validateJson;
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
    getAll: async function (filter = {}) {
      _.defaults(filter, {
        limit: 100,
        order: 'DESC',
        offset: 0
      });
      log.info('getAll ', filter);
      let result = await models.Complaint.findAndCountAll({
        //attributes: ledgerAttr,
        limit: filter.limit,
        order: `\"createdAt\" ${filter.order}`,
        offset: filter.offset,
        include: [{model: models.Category,
          attributes: { exclude: ['id','createdAt','updatedAt'] }
        }]
      });
      log.info(`getAll count: ${result.count}`);
      let complaints = _.map(result.rows, complaint => complaint.toJSON());
      return {
        count: result.count,
        data: complaints
      };
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
    getAllCategories: async function (filter = {}) {
      _.defaults(filter, {
        limit: 100,
        order: 'DESC',
        offset: 0
      });
      log.info('getAll ', filter);
      let result = await models.Category.findAndCountAll({
        //attributes: ledgerAttr,
        limit: filter.limit,
        order: `\"createdAt\" ${filter.order}`,
        offset: filter.offset
      });
      log.info(`getAll count: ${result.count}`);
      let categories = _.map(result.rows, category => category.toJSON());
      return {
        count: result.count,
        data: categories
      };
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
    getOne: function (id) {
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
    getOneCategory: function (id) {
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
    async postComplaint(user, params) {
      //validateJson(params, require('./schema/addCategory.json'));
      let message,
        status;
        await models.Complaint.addComplaint(params);
        status = true;
        message = "Successful";
      return {
        success: status,
        message: message
      };
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
    async updateComplaint(user, params, id) {
      //validateJson(params, require('./schema/addCategory.json'));
      let message,
        status;
        await models.Complaint.updateComplaint(params, id);
        status = true;
        message = "Successful";
      return {
        success: status,
        message: message
      };
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
    async postCategory(user, params) {
      //validateJson(params, require('./schema/addCategory.json'));
      let message,
        status;
        await models.Category.addCategory(params);
        status = true;
        message = "Successful";
      return {
        success: status,
        message: message
      };
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
    async updateCategory(user, params, id) {
      //validateJson(params, require('./schema/addCategory.json'));
      let message,
        status;
        await models.Category.updateCategory(params, id);
        status = true;
        message = "Successful";
      return {
        success: status,
        message: message
      };
    },
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