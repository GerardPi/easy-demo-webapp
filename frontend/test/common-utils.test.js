import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

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
  it ('objectWith to result in an extened object and original is not touched', () => {
    const a = { a: 1, b: 2, c: 3};
    expect(commonUtils.objectWith(a, 'd', 4))
      .to.eql({ a: 1, b: 2, c: 3, d: 4});
    expect(a).to.eql({a: 1, b:2, c: 3});
    expect(commonUtils.objectWith(a, 'e', 'kaas'))
      .to.eql({ a: 1, b: 2, c: 3, e: 'kaas'});
    expect(a).to.eql({a: 1, b:2, c: 3});
  });
  it ('objectWithout to result in a truncated object', () => {
    const a = { a: 1, b: 2, c: 3};
    expect(commonUtils.objectWithout(a, 'b')).to.eql({ a: 1, c: 3});
    expect(a).to.eql({a: 1, b:2, c: 3});
    expect(commonUtils.objectWithout(a, 'a')).to.eql({ b: 2, c: 3});
    expect(a).to.eql({a: 1, b:2, c: 3});
  });
  it ('endsWith works properly', () => {
    expect(commonUtils.endsWith("abcdefg", "efg")).to.be.equal(true);
    expect(commonUtils.endsWith("abcdefg", "efgh")).to.be.equal(false);
    expect(commonUtils.endsWith("abcdefg", "ef")).to.be.equal(false);
    expect(commonUtils.endsWith("abcdefg", "abc")).to.be.equal(false);
    expect(commonUtils.endsWith("abcdefg", null)).to.be.equal(false);
  });
  it ('startWith works properly', () => {
    expect(commonUtils.startsWith("abcdefg", "efg")).to.be.equal(false);
    expect(commonUtils.startsWith("abcdefg", "efgh")).to.be.equal(false);
    expect(commonUtils.startsWith("abcdefg", "ef")).to.be.equal(false);
    expect(commonUtils.startsWith("abcdefg", "abc")).to.be.equal(true);
    expect(commonUtils.startsWith("abcdefg", null)).to.be.equal(false);
  });
  it ('arrayWithoutValue works properly', () => {
    const a = [1, 2, 3, 4];
    expect(commonUtils.arrayWithoutValue(a, 2)).to.eql([1, 3, 4]);
    expect(a).to.eql([1, 2, 3, 4]);
  });
});
