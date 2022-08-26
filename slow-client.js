const http = require('http');
const Agent = require('agentkeepalive');

const requestListener = function (req, res) {
    if (req.url === '/') {
        console.log('Responding with redirect to /fake-path');
        res.writeHead(302, { Location: 'fake-path' });
        res.end();
        return;
    }

    console.log('Responding normally');
    res.writeHead(200);
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8089);

const keepaliveAgent = new Agent({
    maxSockets: 1,
    maxFreeSockets: 1,
    timeout: 60000,
    freeSocketTimeout: 800,
});

const options = {
    host: '0.0.0.0',
    port: 8089,
    path: '/',
    method: 'GET',
    agent: keepaliveAgent,
};

const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => console.log('BODY: ' + chunk));

    if (res.statusCode === 302) {
        const opts = { ...options, path: '/' + res.headers.location };
        const req2 = http.request(opts, async (res) => {
            res.setEncoding('utf8');

            // Simulate client being slow to consume the response
            setTimeout(() => {
                res.on('data', (chunk) => console.log('BODY: ' + chunk));
            }, 1000);
        });
        req2.on('error', (e) => {
            throw e;
        });
        req2.end();
    }
});
req.on('error', (e) => console.log('problem with request: ' + e.message));
req.end();
