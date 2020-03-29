const camelSnake = require('../lib/camelSnake');
const expect = require('chai').expect;

describe('camelSnake', () => {
    it('camelCaseKey, origin value', () => {
        expect(camelSnake.camelCaseKey(1)).to.be.equal(1);
        expect(camelSnake.camelCaseKey('string')).to.be.equal('string');
        expect(camelSnake.camelCaseKey(null)).to.be.equal(null);
        expect(camelSnake.camelCaseKey(undefined)).to.be.equal(undefined);

        let date = new Date();
        expect(camelSnake.camelCaseKey(date)).to.be.equal(date);

        let regexp = new RegExp('.*');
        expect(camelSnake.camelCaseKey(regexp)).to.be.equal(regexp);
    });

    it('snakeCaseKey, origin value', () => {
        expect(camelSnake.snakeCaseKey(1)).to.be.equal(1);
        expect(camelSnake.snakeCaseKey('string')).to.be.equal('string');
        expect(camelSnake.snakeCaseKey(null)).to.be.equal(null);
        expect(camelSnake.snakeCaseKey(undefined)).to.be.equal(undefined);

        let date = new Date();
        expect(camelSnake.snakeCaseKey(date)).to.be.equal(date);

        let regexp = new RegExp('.*');
        expect(camelSnake.snakeCaseKey(regexp)).to.be.equal(regexp);
    });

    it('camelCaseKey & snakeCaseKey, plain object', () => {
        let camel = {
            x: 1,
            xA: 'string',
            xAyB: null,
            xAyBzC: {
                x: 1,
                xA: 1,
                xAyB: 1,
                xAyBzC: 1
            },
            xA1: 1,
            xAy1: 1
        };
        camel.array = [JSON.parse(JSON.stringify(camel))];

        let snake = {
            x: 1,
            x_a: 'string',
            x_ay_b: null,
            x_ay_bz_c: {
                x: 1,
                x_a: 1,
                x_ay_b: 1,
                x_ay_bz_c: 1
            },
            x_a_1: 1,
            x_ay_1: 1
        };
        snake.array = [JSON.parse(JSON.stringify(snake))];

        expect(camelSnake.camelCaseKey(snake)).to.be.deep.equal(camel);
        expect(camelSnake.snakeCaseKey(camel)).to.be.deep.equal(snake);
    });
});