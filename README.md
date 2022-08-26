# agentkeepalive-timeout-issue

This repo reproduces an issue where the agentkeepalive will use the wrong timeout when waiting for requests that are still active, after receiving the 'free' event.

When the 'free' event is called but requests are still active, the socket should remain using the given active socket timeout, but instead, it uses the free socket timeout. Because of this, the timeout is rather short, and if the server or client doesn't complete within the shorter time frame.

This setup has a 60 second timeout, but the active timeout is much shorter at 800ms. If a request is still active, the 800ms timeout shouldn't be in use.

# Running

Install packages (`npm ci`), then run one of the following:

```
DEBUG=agentkeepalive node slow-client.js
DEBUG=agentkeepalive node slow-server.js
```

# Output

## Slow Client

```
  agentkeepalive sock[0#0.0.0.0:8089:] create, timeout 60000ms +0ms
Responding with redirect to /fake-path
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 1, finished: 1) free +11ms
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) will be reuse on agent free event +0ms
Responding normally
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) timeout after 800ms, listeners 4, defaultTimeoutListenerCount 3, hasHttpRequest true, HttpRequest timeoutListenerCount 0 +805ms
  agentkeepalive timeout listeners: onTimeout, onTimeout, emitRequestTimeout, responseOnTimeout +1ms
  agentkeepalive sock[0#0.0.0.0:8089:] destroy with timeout error +1ms
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) error: Error: Socket timeout
    at Socket.onTimeout (/private/tmp/agentkeepalive-timeout-issue/node_modules/agentkeepalive/lib/agent.js:346:23)
    at Socket.emit (node:events:539:35)
    at Socket._onTimeout (node:net:516:8)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  code: 'ERR_SOCKET_TIMEOUT',
  timeout: 800
}, listenerCount: 2 +0ms
/private/tmp/agentkeepalive-timeout-issue/slow-client.js:50
            throw e;
            ^

Error: Socket timeout
    at Socket.onTimeout (/private/tmp/agentkeepalive-timeout-issue/node_modules/agentkeepalive/lib/agent.js:346:23)
    at Socket.emit (node:events:539:35)
    at Socket._onTimeout (node:net:516:8)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  code: 'ERR_SOCKET_TIMEOUT',
  timeout: 800
}
```

## Slow Server

```
  agentkeepalive sock[0#0.0.0.0:8089:] create, timeout 60000ms +0ms
Responding with redirect to /fake-path
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 1, finished: 1) free +12ms
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) will be reuse on agent free event +0ms
Responding normally
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) timeout after 800ms, listeners 3, defaultTimeoutListenerCount 3, hasHttpRequest true, HttpRequest timeoutListenerCount 0 +803ms
  agentkeepalive timeout listeners: onTimeout, onTimeout, emitRequestTimeout +0ms
  agentkeepalive sock[0#0.0.0.0:8089:] destroy with timeout error +0ms
  agentkeepalive sock[0#0.0.0.0:8089:](requests: 2, finished: 1) error: Error: Socket timeout
    at Socket.onTimeout (/private/tmp/agentkeepalive-timeout-issue/node_modules/agentkeepalive/lib/agent.js:346:23)
    at Socket.emit (node:events:539:35)
    at Socket._onTimeout (node:net:516:8)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  code: 'ERR_SOCKET_TIMEOUT',
  timeout: 800
}, listenerCount: 2 +1ms
/private/tmp/agentkeepalive-timeout-issue/slow-server.js:50
            throw e;
            ^

Error: Socket timeout
    at Socket.onTimeout (/private/tmp/agentkeepalive-timeout-issue/node_modules/agentkeepalive/lib/agent.js:346:23)
    at Socket.emit (node:events:539:35)
    at Socket._onTimeout (node:net:516:8)
    at listOnTimeout (node:internal/timers:559:17)
    at processTimers (node:internal/timers:502:7) {
  code: 'ERR_SOCKET_TIMEOUT',
  timeout: 800
}
```