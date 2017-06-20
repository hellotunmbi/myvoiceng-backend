'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.validateJson = validateJson;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsonschema = require('jsonschema');

var _jsonschema2 = _interopRequireDefault(_jsonschema);

var validator = new _jsonschema2['default'].Validator();
var validate = validator.validate.bind(validator);

function validateJson(json, schema) {
    var result = validate(json, schema);
    if (!result.errors.length) return true;

    throw {
        name: 'BadRequest',
        message: 'Request is invalid',
        validation: result.errors
    };
}