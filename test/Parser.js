/* (c) 2015-2016 EMIW, LLC. emiw.xyz/license */
import test from 'ava';
import { encode } from '../dist/parse';
import createParser from '../dist/Parser';


test.beforeEach(t => {
  t.context.parser = createParser();
  t.context.metas = [{ foo: 'bar' }, { baz: [1, 'qux'] }, { quux: [1, 2, 3] }];
  t.context.datas = ['foo', 'bar', 'baz'];
  t.context.emitPacket = () => t.context.parser.addChunk(encode(t.context.metas[0], new Buffer(t.context.datas[0])));
});

test.cb('whole packets', ({ context: { parser, metas, datas, emitPacket }, ...t }) => {
  t.plan(2);

  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
  });

  emitPacket();
  emitPacket();
  emitPacket();
});

test.cb('partial packets', ({ context: { parser, metas, datas }, ...t }) => {
  t.plan(2);
  parser.on('data', (data) => {
    t.is(data.toString('utf8'), datas.shift(), 'data matches');
  });

  parser.on('meta', (meta) => {
    t.same(meta, metas.shift(), 'meta matches');
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
