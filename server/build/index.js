"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

console.log("api server started");

var app = (0, _app2["default"])();
app.displayInfoEnv();

app.start()["catch"](function (err) {
  console.error("App ending with error: ", err);
});