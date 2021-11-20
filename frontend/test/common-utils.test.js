import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import dayjs from 'dayjs/esm';

import * as commonUtils from '../src/common-utils';

describe('common-utils', () => {
  it('null is not notNullOrEmpty', () => {
    expect(commonUtils.isNotNullOrEmpty(null)).to.be.equal(false);
    expect(commonUtils.isNotNullOrEmpty([])).to.be.equal(false);
    expect(commonUtils.isNotNullOrEmpty([1])).to.be.equal(true);
    expect(commonUtils.isNotNullOrEmpty(undefined)).to.be.equal(false);
  });
  it('null is nullOrEmpty', () => {
    expect(commonUtils.isNullOrEmpty(null)).to.be.equal(true);
    expect(commonUtils.isNullOrEmpty(undefined)).to.be.equal(true);
    expect(commonUtils.isNullOrEmpty([])).to.be.equal(true);
    expect(commonUtils.isNullOrEmpty([1])).to.be.equal(false);
  });
  it('objectWith to result in an extened object and original is not touched', () => {
    const a = { a: 1, b: 2, c: 3 };
    expect(commonUtils.objectWith(a, 'd', 4)).to.eql({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });
    expect(a).to.eql({ a: 1, b: 2, c: 3 });
    expect(commonUtils.objectWith(a, 'e', 'kaas')).to.eql({
      a: 1,
      b: 2,
      c: 3,
      e: 'kaas',
    });
    expect(a).to.eql({ a: 1, b: 2, c: 3 });
  });
  it('objectWithout to result in a truncated object', () => {
    const a = { a: 1, b: 2, c: 3 };
    expect(commonUtils.objectWithout(a, 'b')).to.eql({ a: 1, c: 3 });
    expect(a).to.eql({ a: 1, b: 2, c: 3 });
    expect(commonUtils.objectWithout(a, 'a')).to.eql({ b: 2, c: 3 });
    expect(a).to.eql({ a: 1, b: 2, c: 3 });
  });
  it('endsWith works properly', () => {
    expect(commonUtils.endsWith('abcdefg', 'efg')).to.be.equal(true);
    expect(commonUtils.endsWith('abcdefg', 'efgh')).to.be.equal(false);
    expect(commonUtils.endsWith('abcdefg', 'ef')).to.be.equal(false);
    expect(commonUtils.endsWith('abcdefg', 'abc')).to.be.equal(false);
    expect(commonUtils.endsWith('abcdefg', null)).to.be.equal(false);
  });
  it('startWith works properly', () => {
    expect(commonUtils.startsWith('abcdefg', 'efg')).to.be.equal(false);
    expect(commonUtils.startsWith('abcdefg', 'efgh')).to.be.equal(false);
    expect(commonUtils.startsWith('abcdefg', 'ef')).to.be.equal(false);
    expect(commonUtils.startsWith('abcdefg', 'abc')).to.be.equal(true);
    expect(commonUtils.startsWith('abcdefg', null)).to.be.equal(false);
  });
  it('arrayWithoutValue works properly', () => {
    const a = [1, 2, 3, 4];
    expect(commonUtils.arrayWithoutValue(a, 2)).to.eql([1, 3, 4]);
    expect(a).to.eql([1, 2, 3, 4]);
  });
  it('assertNoNullOrEmptyValues throws no exception when passing an object with non null values', () => {
    const a = { b: 1, c: 2, d: 3 };
    commonUtils.assertNoNullOrEmptyValues(a);
    // No exception is thrown
  });
  it('assertNoNullOrEmptyValues throws an exception when passing an object with a null value', () => {
    const a = { b: 1, c: null, d: 3 };
    expect(() => commonUtils.assertNoNullOrEmptyValues(a)).to.throw(
      'Missing arguments: ["c"]'
    );
  });
  it('isDateTimeBefore', () => {
    const t1 = dayjs();
    const t2 = t1.subtract(10, 'seconds');

    expect(commonUtils.isDateTimeOlderThanSeconds(t1, 5)).to.be.equal(false);
    expect(commonUtils.isDateTimeOlderThanSeconds(t2, 5)).to.be.equal(true);
  });
});
