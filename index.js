const camelSnake = require('./lib/camelSnake');

exports.cp = require('./lib/cp');
exports.req = require('./lib/req');

exports.sleep = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

exports.camelCaseKey = camelSnake.camelCaseKey;
exports.snakeCaseKey = camelSnake.snakeCaseKey;