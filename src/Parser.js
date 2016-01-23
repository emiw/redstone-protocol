/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import { Writable } from 'stream';
import EventEmitter from 'events';
import ProtoBuf from 'protobufjs';
import redstone from './redstone.proto';

// Because git.io/fast-v8
const tryCatch = (mightThrow, handler = () => {}) => {
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
    if (encoding !== 'buffer') chunk = new Buffer(chunk, encoding); // No clue if this is right

    let wrapper = null;
    tryCatch(
      () => {
        wrapper = redstone.Wrapper.decode(chunk);
        ee.emit('wrapper', wrapper);
        const packetType = enumToString(redstone.Wrapper.Type, wrapper.type).toLowerCase();
        const packet = wrapper[packetType];
        ee.emit('packet', { packet, type: packetType });
        ee.emit(packetType, packet);
      },
      () => console.error('ERROR! INVALID PACKET!: ' + chunk.toString('hex')),
    );
    callback();
  };

  return { on: ::ee.on, once: ::ee.once, stream };
}
