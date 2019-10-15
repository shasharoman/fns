const qs = require('querystring');
const stream = require('./stream');

exports.parseBody = parseBody;

async function parseBody(req, options = {}) {
    options.limit = options.limit || 1024 * 1024;

    let type = req.headers['content-type'] || '';
    if (type.indexOf('multipart/form-data') === 0) {
        return {};
    }

    if (!req.headers['content-length']) {
        return {};
    }

    let length = Number(req.headers['content-length']) || 0;
    if (!length || length > options.limit) {
        return {};
    }

    let buf = await stream.toBuffer(req, options.limit);
    let isJson = type.indexOf('application/json') === 0;
    if (isJson) {
        return JSON.parse(buf.toString('utf8'));
    }
    let isUrlEncoded = type.indexOf('application/x-www-form-urlencoded') === 0;
    if (isUrlEncoded) {
        return qs.parse(buf.toString('utf8'));
    }

    return buf;
}