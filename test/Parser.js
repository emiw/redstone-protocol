/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import test from 'ava';
import { Readable } from 'stream';
import { Wrapper, Data, Ctrl } from '../dist/redstone.proto';
import createParser from '../dist/Parser';

test.beforeEach(t => {
  t.context.parser = createParser();
  t.context.input = new Readable();
  t.context.input._read = () => {};
  t.context.parser.next = event => new Promise(resolve => t.context.parser.once(event, resolve));
  t.context.input.pipe(t.context.parser.stream);
});

test('wrapper event', async ({ context: { parser, input }, ...t }) => {
  const nextWrapper = parser.next('wrapper');
  const wrapperBuf = new Wrapper({
    type: 1,
    data: new Data({
      friendID: 12345,
      data: new Buffer('testing the wrapper event', 'utf8'),
    }),
  }).toBuffer();
  input.push(wrapperBuf);
  // I know this is the worst possible way to compare these, but <shrug emoji>
  t.same((await nextWrapper).toBuffer().toString('hex'), wrapperBuf.toString('hex'));
});

test('packet event', async ({ context: { parser, input }, ...t }) => {
  const nextPacket = parser.next('packet');
  const data = new Data({ friendID: 12345, data: new Buffer('testing the packet event', 'utf8') });
  input.push(new Wrapper({ type: 1, data }).toBuffer());
  const packet = await nextPacket;
  t.is(packet.type, 'data', 'data type is correct');
  // I know this is the worst possible way to compare these, but <shrug emoji>
  t.same(
    packet.packet.toBuffer().toString('hex'),
    data.toBuffer().toString('hex'),
    'packet is correct'
  );
});

test('$packetType event (data)', async ({ context: { parser, input }, ...t }) => {
  const nextData = parser.next('data');
  const data = new Data({ friendID: 12345, data: new Buffer('testing the data event', 'utf8') });
  input.push(new Wrapper({ type: 1, data }).toBuffer());
  // I know this is the worst possible way to compare these, but <shrug emoji>
  t.same(
    (await nextData).toBuffer().toString('hex'),
    data.toBuffer().toString('hex'),
    'packet is correct'
  );
});

test('$packetType event (ctrl)', async ({ context: { parser, input }, ...t }) => {
  const nextCtrl = parser.next('ctrl');
  const ctrl = new Ctrl({ friendID: 12345, json: '{foo:"bar"}' });
  input.push(new Wrapper({ type: 2, ctrl }).toBuffer());
  // I know this is the worst possible way to compare these, but <shrug emoji>
  t.same(
    (await nextCtrl).toBuffer().toString('hex'),
    ctrl.toBuffer().toString('hex'),
    'packet is correct'
  );
});

test('invalid packets', ({ context: { input }, ...t }) => {
  t.throws(() => input.push('foo!'), /invalid packet/i);
});
