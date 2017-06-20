'use strict';
import _ from 'lodash';
let log = require('logfilename')(__filename);
export default function UserApi(app) {
  let models = app.data.models();
  let validateJson = app.utils.api.validateJson;

  /**
   * @swagger
   * resourcePath: /api/v1/users
   * description: All about API
   */

  return {
    /**
     * @swagger
     * path: /api/v1/users
     * operations:
     *   -  httpMethod: GET
     *      summary: list registered users
     *      notes: Returns list of all users
     *      responseClass: User
     *      nickname: user
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
      let result = await models.User.findAndCountAll({
        //attributes: ledgerAttr,
        limit: filter.limit,
        order: `\"createdAt\" ${filter.order}`,
        offset: filter.offset
      });
      log.info(`getAll count: ${result.count}`);
      let users = _.map(result.rows, user => user.toJSON());
      return {
        count: result.count,
        data: users
      };
    },
    getOne: function (userId) {
      log.debug("get userId: ", userId);
      return models.User.findByUserId(userId);
    },
  };
}