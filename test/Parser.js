/* (c) 2015-2016 EMIW, LLC. emiw.xyz/license */
import test from 'ava';
import createFakeSocket from './_fakeSocket';
import { encode } from '../dist/parse';
import createParser from '../dist/Parser';


test.beforeEach(t => {
  t.context.parser = createParser();
  t.context.metas = [{ foo: 'bar' }, { baz: [1, 'qux'] }, { quux: [1, 2, 3] }];
  t.context.datas = ['foo', 'bar', 'baz'];
  t.context.emitPacket = () => t.context.parser.addChunk(encode(t.context.metas[0], new Buffer(t.context.datas[0])));
  let tEndCalled = false;
  t.context.done = (tt) => {
    if (t.context.datas.length === 0 && t.context.metas.length === 0 && !tEndCalled) {
      tEndCalled = true;
      tt.end();
    }
  };
});

test.cb('whole packets', ({ context: { parser, metas, datas, emitPacket, done }, ...t }) => {
  t.plan(6);

  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
    done(t);
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
    done(t);
  });

  emitPacket();
  emitPacket();
  emitPacket();
});

test.cb('partial packets', ({ context: { parser, metas, datas, done }, ...t }) => {
  t.plan(6);
  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
    done(t);
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
    done(t);
  });

  const combinedStr = datas.reduce((str, data, i) => {
    return str + encode(metas[i], new Buffer(data));
  }, '');


  parser.addChunk(combinedStr.slice(0, 10));
  parser.addChunk(combinedStr.slice(10));
});

test.cb('`packet` event', ({ context: { parser, metas, datas, emitPacket }, ...t }) => {
  parser.on('fullPacket', (packet) => {
    t.is(packet.data.toString('utf8'), datas.shift(), 'data matches');
    t.same(packet.meta, metas.shift(), 'meta matches');
    t.end();
  });

  emitPacket();
  emitPacket();
  emitPacket();
});

test.cb('passing in a socket (full packets)', ({ context: { metas, datas, done }, ...t }) => {
  t.plan(6);

  const { client, server } = createFakeSocket();
  const parser = createParser(client);
  const writePacket = () => server.write(encode(metas[0], new Buffer(datas[0])));

  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
    done(t);
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
    done(t);
  });

  writePacket();
  writePacket();
  writePacket();
});

test.cb('passing in a socket (partial packets)', ({ context: { metas, datas, done }, ...t }) => {
  t.plan(6);

  const { client, server } = createFakeSocket();
  const parser = createParser(client);

  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
    done(t);
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
    done(t);
  });

  const combinedStr = datas.reduce((str, data, i) => {
    return str + encode(metas[i], new Buffer(data));
  }, '');


  server.write(combinedStr.slice(0, 10));
  server.write(combinedStr.slice(10));
});
