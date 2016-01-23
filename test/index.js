/* (c) 2016 EMIW, LLC. emiw.xyz/license */
import test from 'ava';
import * as index from '..';
import { valid } from 'semver';
import createParser from '../dist/Parser';

test('createParser', t => {
  t.is(index.createParser, createParser, 'proper createParser');
});

test('valid version', t => {
  t.ok(valid(index.version), 'valid version');
});
