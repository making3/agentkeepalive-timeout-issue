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
