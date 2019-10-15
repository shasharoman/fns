const cp = require('child_process');
const stream = require('stream');

exports.exec = exec;
exports.spawn = spawn;
exports.spawnExpectStream = spawnExpectStream;

async function exec(command, options) {
    return await new Promise((resolve, reject) => {
        cp.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}

async function spawn(command, args, options = {}) {
    return await new Promise((resolve, reject) => {
        let stdout = [];
        let stderr = [];

        let fork = cp.spawn(command, args, Object.assign({
            detached: true
        }, options));

        let timeout = setTimeout(() => {
            if (fork.connected) {
                fork.stdin.pause();
                fork.kill();
            }

            reject(new Error('resulted in a timeout.'));
        }, 1000 * 60 * 5); // five minutes

        fork.stdin.once('error', reject);
        if (options.stdin) {
            let input = new stream.PassThrough();
            input.end(options.stdin);
            input.pipe(fork.stdin);
        }
        else {
            fork.stdin.end(null);
        }

        fork.stdout.on('data', data => stdout.push(data));
        fork.stderr.on('data', data => stderr.push(data));

        fork.on('error', reject);
        fork.on('close', (code, signal) => {
            clearTimeout(timeout);

            if (code !== 0 || signal !== null) {
                let err = new Error('command failed.');
                err.code = code;
                err.signal = signal;

                return reject(err);
            }

            return resolve({
                stdout: Buffer.concat(stdout),
                stderr: Buffer.concat(stderr)
            });
        });
    });
}

async function spawnExpectStream(command, args, options = {}) {
    return await new Promise((resolve, reject) => {
        let fork = cp.spawn(command, args, Object.assign({
            detached: true
        }, options));

        let timeout = setTimeout(() => {
            if (!fork.connected) {
                return;
            }

            fork.stdin.pause();
            fork.kill();
        }, 1000 * 60 * 5); // five minutes

        fork.stdin.once('error', reject);
        fork.stdin.end(options.stdin || null);

        fork.on('error', (err) => {
            console.error(err);
        });
        fork.on('close', (code, signal) => {
            clearTimeout(timeout);

            if (code !== 0 || signal !== null) {
                console.error('spawn error:', command, code, signal);
            }
        });

        return resolve({
            stdout: fork.stdout,
            stderr: fork.stderr
        });
    });
}