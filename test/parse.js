/* (c) 2015-2016 EMIW, LLC. emiw.xyz/license */
import test from 'ava';
import { encode, decode } from '../dist/parse';

test('decode(encode(null, x)).data === x', t => {
  const data = new Buffer('foo bar baz');
  const encoded = encode(null, data);
  const decoded = decode(encoded);
  t.same(decoded.data, data, 'decode(encode(null, x)).data === x');
});

test('decode(encode(x, ...)).meta === x', t => {
  const meta = { foo: ['bar:', 'baz;'], qux: true };
  const encoded = encode(meta);
  const decoded = decode(encoded);
  t.same(decoded.meta, meta, 'decode(encode(x, ...)).meta === x');
});

test('decode(encode(x, y)) === { meta: x, data: y }', t => {
  const meta = { foo: ['bar:', 'baz;'], qux: true };
  const data = new Buffer('foo bar baz');
  const encoded = encode(meta, data);
  const decoded = decode(encoded);
  t.same(decoded.meta, meta, 'decode(encode(x, y)).meta === x');
  t.same(decoded.data, data, 'decode(encode(x, y)).data === y');
});

test('decode(encode(\'\', \'\'))', t => {
  const encoded = encode('', new Buffer(''));
  const decoded = decode(encoded);
  t.same(decoded.meta, '');
  t.same(decoded.data, new Buffer(''));
});

test('invalid decoding', t => {
  const testDecode = decodee => t.throws(() => decode(decodee));
  testDecode('foo');
  testDecode('');
  testDecode({ foo: 'bar' });
});

test('invalid encoding (data not a Buffer)', t => {
  const testEncode = decodee => t.throws(() => encode(null, decodee));
  testEncode('foo');
  testEncode({ foo: 'bar' });
  testEncode('');
});
