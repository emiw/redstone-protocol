# redstone-protocol
---

### The protocol and parser the worker-client communication in redstone

[//]: # "ProTip(tm): This is how you make a comment in markdown. Anything between the quotes is ignored."

---
[![Version][version-badge]][npm-link]
[![Downloads][downloads-badge]][npm-link]
[![Build Status][build-badge]][build-link]
[![Coverage Status][coverage-badge]][coverage-link]
[![Dependency Status][deps-badge]][deps-link]
[![devDependency Status][devDeps-badge]][devDeps-link]
[![Commitizen friendly][cz-badge]][cz-link]
[![semantic-release][sr-badge]][sr-link]
[![MIT License][license-badge]][license-link]


[//]: # "These use the npm package name"
[version-badge]: 	https://img.shields.io/npm/v/%40emiw%2Fredstone-protocol.svg   "npm version"
[downloads-badge]: https://img.shields.io/npm/dm/%40emiw%2Fredstone-protocol.svg "npm downloads"
[npm-link]:  http://npm.im/%40emiw%2Fredstone-protocol                           "npm"

[license-badge]: https://img.shields.io/npm/l/%40emiw%2Fredstone-protocol.svg    "MIT License"
[license-link]:  http://emiw.mit-license.org             "MIT License"

[//]: # "The rest just use the repo slug"
[build-badge]: https://travis-ci.org/emiw/redstone-protocol.svg                   "Travis CI Build Status"
[build-link]:  https://travis-ci.org/emiw/redstone-protocol                       "Travis CI Build Status"

[deps-badge]: https://img.shields.io/david/emiw/redstone-protocol.svg             "Dependency Status"
[deps-link]:  https://david-dm.org/emiw/redstone-protocol                         "Dependency Status"

[devDeps-badge]: https://img.shields.io/david/dev/emiw/redstone-protocol.svg      "devDependency Status"
[devDeps-link]:  https://david-dm.org/emiw/redstone-protocol#info=devDependencies "devDependency Status"

[cz-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg "Commitizen friendly"
[cz-link]: http://commitizen.github.io/cz-cli/                               "Commitizen friendly"

[sr-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[sr-link]: https://github.com/semantic-release/semantic-release

[//]: # "This comes last, as it's really long"

[coverage-badge]: https://coveralls.io/repos/emiw/redstone-protocol/badge.svg?branch=master&service=github "Code Coverage"
[coverage-link]: https://coveralls.io/github/emiw/redstone-protocol?branch=master                          "Code Coverage"

---

## Usage

```javascript
import { encode, decode, createParser } from '@emiw/redstone-protocol';

// There are two sides to this module, the lower level encode/decode, and the higher level Parser class-ish.

// Encode/Decode

// Encoding
// IMPORTANT: `meta` must be JSON serializable, and data must be a buffer!
const encoded = encode({ state: 5, foo: 'bar' }, new Buffer('foo bar baz')); // encode(meta, data)
console.log(encoded); // "%7B%22state%22%3A5%2C%22foo%22%3A%22bar%22%7D:Zm9vIGJhciBiYXo=;"

// Decoding
const decoded = decode(encoded);
console.log(decoded); // "{ meta: { state: 5, foo: 'bar' }, data: <Buffer 66 6f 6f 20 62 61 72 20 62 61 7a> }"
console.log(decoded.data.toString('utf8'); // "foo bar baz"

// See below for more on the actual protocol.

// Parser

// The parser exists as a way to abstract away the process of storing chunks as the come in from a socket, extracting
// the packets, and parsing them.
// It doesn't contain any systems for decoding. It's just for encoding.
const socket = getNetSocketSomehow();
const parser = createParser();
socket.on('data', parser.addChunk);

// WARNING: All of these events will be fired for every packet.
parser.on('packet', (packet) => {
  // packet = { meta: ..., data: ... }
});
parser.on('meta', (meta) => {
  // meta = ...
});
parser.on('data', (data) => {
  // data = Buffer(...)
});
```

---

## License

[MIT: emiw.mit-license.org.](http://emiw.mit-license.org)
