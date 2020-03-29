const _ = require('lodash');

exports.camelCaseKey = camelCaseKey;
exports.snakeCaseKey = snakeCaseKey;

function camelCaseKey(o) {
    if (_.isArray(o)) {
        return _.map(o, camelCaseKey);
    }

    if (!_.isPlainObject(o)) {
        return o;
    }

    let ret = _.mapKeys(o, (value, key) => _.camelCase(key));
    return _.mapValues(ret, value => {
        if (_.isArray(value) || _.isPlainObject(value)) {
            return camelCaseKey(value);
        }

        return value;
    });
}

function snakeCaseKey(o) {
    if (_.isArray(o)) {
        return _.map(o, snakeCaseKey);
    }

    if (!_.isPlainObject(o)) {
        return o;
    }

    let ret = _.mapKeys(o, (value, key) => _.snakeCase(key));
    return _.mapValues(ret, value => {
        if (_.isArray(value) || _.isPlainObject(value)) {
            return snakeCaseKey(value);
        }

        return value;
    });
}