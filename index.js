const camelSnake = require('./lib/camelSnake');

exports.cp = require('./lib/cp');
exports.req = require('./lib/req');

exports.sleep = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
// eslint-disable-next-line
exports.pullCollor = s => s.replace(/\u001b\[(?:\d*;){0,5}\d*m/g, '');

exports.camelCaseKey = camelSnake.camelCaseKey;
exports.snakeCaseKey = camelSnake.snakeCaseKey;