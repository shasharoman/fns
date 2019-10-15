const stream = require('stream');
const expect = require('chai').expect;
const streamFns = require('../lib/stream');

describe('stream', () => {
    it('toBuffer', async () => {
        let s = new stream.PassThrough();
        process.nextTick(() => {
            s.end(Buffer.from('ok'));
        });
        let ret = await streamFns.toBuffer(s);
        expect(ret.toString()).to.be.equal('ok');
    });
});