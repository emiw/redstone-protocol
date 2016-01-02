/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import pkg from '../package.json';

// We need a default version b/c semantic-release doesn't let us have a version unless it's the released version.
// TODO: Is this the development version that we should have? Maybe we should change it to `dev`? Or `999.999.999-dev`?
const { version = '0.0.0-dev' } = pkg;

export { default as createParser } from './Parser';
export { encode, decode } from './parse';
export { version };
