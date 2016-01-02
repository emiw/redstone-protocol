/* (c) 2015-2016 EMIW, LLC. emiw.xyz/license */

export const END_OF_PACKET = ';';
export const META_SEPARATOR = ':';
export const DATA_ENCODING = 'base64';

const isWorthEncoding = str => str !== void 0 && str !== null;

export function encode(meta = null, data = new Buffer('')) {
  if (!(data instanceof Buffer)) throw new TypeError('Data must be a Buffer');
  data = data.toString(DATA_ENCODING);
  if (isWorthEncoding(meta)) {
    meta = JSON.stringify(meta);
    meta = encodeURIComponent(meta);
  } else {
    meta = '';
  }
  return `${meta}${META_SEPARATOR}${data}${END_OF_PACKET}`;
}

export function decode(str) {
  // I think this is slightly more performant in the long run, because we iterate over the string only once
  const strLen = str.length;
  let metaComplete = false;
  let metaStr = '';
  let dataStr = '';

  if (str[strLen - 1] !== ';') throw new Error('Invalid Packet: Incomplete');

  if (str[0] === ':') {
    // If there's not any meta information, then we can cheat.
    dataStr = str.slice(1, -1);
  } else {
    for (let i = 0; i < strLen - 1; ++i) {
      const char = str[i];
      if (char === META_SEPARATOR) {
        metaComplete = true;
      } else if (metaComplete) {
        dataStr += char;
      } else {
        metaStr += char;
      }
    }
  }

  let meta;

  if (metaStr !== '') {
    metaStr = decodeURIComponent(metaStr);
    meta = JSON.parse(metaStr);
  } else {
    meta = null;
  }
  const data = new Buffer(dataStr, DATA_ENCODING);

  return { meta, data };
}
