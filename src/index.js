/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import pkg from '../package.json';

// We need a default version b/c semantic-release doesn't let us have a version unless it's the
// released version.
// TODO: Is this the development version that we want? Should we change it to `999.999.999-dev`?
/* istanbul ignore next: untestable */
const version = pkg.version || '0.0.0-dev';

export { default as createParser } from './Parser';
export { version };
