exports.cp = require('./lib/cp');
exports.req = require('./lib/req');

exports.sleep = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));