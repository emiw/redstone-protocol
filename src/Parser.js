/* (c) 2015-2016 EMIW, LLC. emiw.xyz/license */
import EventEmitter from 'events';
import { encode, decode, END_OF_PACKET } from './parse';

export default function createParser(socket = null) {
  const ee = new EventEmitter(); // TODO: Maybe switch to EventEmitter2?
  let chunk = '';
  const parser = {
    on: ::ee.on, // FIXME: This doesn't make us a real EE, we should figure out a way to do it properly.

    addChunk(newChunk) {
      chunk += newChunk;
      const parts = chunk.split(END_OF_PACKET);

      chunk = parts.pop(); // Whatever's left over

      parts.forEach((part) => {
        const ret = decode(part + ';');
        ee.emit('packet', ret);
        if (ret.data) ee.emit('data', ret.data);
        if (ret.meta) ee.emit('meta', ret.meta);
      });
    },

    write(meta, data) {
      return socket.write(encode(meta, data));
    },
  };

  if (socket) socket.on('data', parser.addChunk);

  return parser;
}
