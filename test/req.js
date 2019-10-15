const reqFns = require('../lib/req');
const http = require('http');
const expect = require('chai').expect;

describe('req', () => {
    it('parseBody', async () => {
        let body = JSON.stringify({
            foo: 'foo',
            bar: 'bar'
        });

        let port = parseInt(Math.random() * 40000) + 10000;
        let server = http.createServer(async (req, res) => {
            body = await reqFns.parseBody(req);
            res.end();
        });
        server.listen(port);

        await new Promise(resolve => setTimeout(resolve, 10));
        let req = http.request({
            port,
            headers: {
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(body)
            }
        }, () => {});
        req.write(body);
        req.end();
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(body).to.be.deep.equal({
            foo: 'foo',
            bar: 'bar'
        });
        server.close();
    });
});