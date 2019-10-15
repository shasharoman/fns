exports.toBuffer = toBuffer;

async function toBuffer(stream, limit = 1024 * 1024) {
    return await new Promise((resolve, reject) => {
        _readStream(stream, limit, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });

    function _readStream(stream, limit, callback) {
        let complete = false;
        let received = 0;
        let buffer = [];

        let done = (err, result) => {
            complete = true;
            _cleanup();

            if (err) {
                stream.unpipe && stream.unpipe();
                stream.pause && stream.pause();
            }

            callback(err, result);
        };

        stream.on('data', _onData);
        stream.on('end', _onEnd);
        stream.on('error', _onEnd);
        stream.on('aborted', _onAborted);
        stream.on('close', _onClose);

        function _onData(chunk) {
            if (complete) {
                return;
            }

            received += chunk.length;
            if (received > limit) {
                done(new Error('request entity too large'));
                return;
            }

            buffer.push(chunk);
        }

        function _onEnd(err) {
            if (complete) {
                return;
            }

            if (err) {
                done(err);
                return;
            }

            done(null, Buffer.concat(buffer));
        }

        function _onAborted() {
            if (complete) {
                return;
            }

            done(new Error('stream aborted.'));
        }

        function _onClose() {
            _cleanup();
        }

        function _cleanup() {
            buffer = null;

            stream.removeListener('aborted', _onAborted);
            stream.removeListener('data', _onData);
            stream.removeListener('end', _onEnd);
            stream.removeListener('error', _onEnd);
            stream.removeListener('close', _onClose);
        }
    }
}