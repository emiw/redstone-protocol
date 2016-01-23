/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import { Writable } from 'stream';
import EventEmitter from 'events';
import ProtoBuf from 'protobufjs';
import redstone from './redstone.proto';
import createDebug from 'debug';

const debug = createDebug('redstone:protocol:Parser');
const INDENT = '--->     '; // TODO: I don't like this system
const debugObject = (title, object) => {
  debug(INDENT + title);
  JSON.stringify(object, null, 2)
    .split('\n')
    .forEach(line => debug(`${INDENT}    ${line}`));
};

// Because git.io/fast-v8
/* istanbul ignore next: not worth testing */
const tryCatch = (mightThrow, handler) => {
  try {
    return mightThrow();
  } catch (err) {
    handler(err);
  }
};

// See here: https://git.io/vubLp, this ought to be built in to protobuf.js
const enumToString = (enum_, value) => ProtoBuf.Reflect.Enum.getName(enum_, value);

// I'm positive that this can be made more efficient
export default function createParser() {
  const stream = new Writable();
  const ee = new EventEmitter();

  stream._write = (chunk, encoding, callback) => {
    /* istanbul ignore next: no clue how to test */
    if (encoding !== 'buffer') chunk = new Buffer(chunk, encoding); // No clue if this is right
    debug('---> Got chunk: %s', chunk.toString('hex'));

    let wrapper = null;
    tryCatch(
      () => {
        wrapper = redstone.Wrapper.decode(chunk);
        debugObject('Decoded Wrapper:', wrapper);
        ee.emit('wrapper', wrapper);
        const packetType = enumToString(redstone.Wrapper.Type, wrapper.type).toLowerCase();
        debug(INDENT + 'Packet Type: %s', packetType);
        const packet = wrapper[packetType];
        debugObject('Packet:', packet);
        ee.emit('packet', { packet, type: packetType });
        ee.emit(packetType, packet);
      },
      () => {
        debug(INDENT + 'ERROR! Got invalid packet!');
        throw new Error('Invalid Packet!');
      }
    );
    callback();
  };

  return { on: ::ee.on, once: ::ee.once, stream };
}
