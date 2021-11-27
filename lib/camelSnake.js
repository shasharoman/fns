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

function snakeCaseKey(o, ignoreNumber = false) {
    if (_.isArray(o)) {
        return _.map(o, x => snakeCaseKey(x, ignoreNumber));
    }

    if (!_.isPlainObject(o)) {
        return o;
    }

    let ret = _.mapKeys(o, (value, key) => {
        if (ignoreNumber) {
            return _.snakeCase(key).replace(/_?(\d+)_?/g, '$1');
        }

        return _.snakeCase(key);
    });

    return _.mapValues(ret, value => {
        if (_.isArray(value) || _.isPlainObject(value)) {
            return snakeCaseKey(value, ignoreNumber);
        }

        return value;
    });
}