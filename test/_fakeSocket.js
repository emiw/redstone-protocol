/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import EventEmitter from 'events';

function createWrite(target, output) {
  target.write = (...args) => output.emit('data', ...args);
}

export default function createFakeSocket() {
  const client = new EventEmitter();
  const server = new EventEmitter();
  createWrite(client, server);
  createWrite(server, client);

  return { client, server };
}
