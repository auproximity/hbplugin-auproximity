# hbplugin-auproximity
A plugin for [Hindenburg](https://github.com/skeldjs/Hindenburg) to work with
[auproximity](https://github.com/auproximity/auproximity)'s custom server backend.

Also written to demonstrate writing plugins for Hindenburg, and serves as a great
real-world example.

## Installation
You can install the plugin in two ways:
* Running `yarn install-plugin hbplugin-auproximity` in your Hindenburg directory.
* `git clone`-ing this repository into your Hindenburg plugin directory. (Make
sure to `yarn install` and `yarn build`)

## Configuration
### `host`
The interface to host the websocket server on. Set to `0.0.0.0` for any interface.

**Default:** `0.0.0.0`

### `pingInterval`
How often to ping the sockets of tracked rooms, in miliseconds.

**Default:** `10000` (10 seconds)

### `sourceWhitelist`
A whitelist of IP addresses or domain names to only accept websocket connections
from.

**Default:** `[]` (accept any)