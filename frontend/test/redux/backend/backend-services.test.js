import { fixture, expect } from '@open-wc/testing';
import * as sut from '../../../src/redux/backend/backend-services';

describe('backendServices', () => {
  const urlPrefix = "http://localhost:8080/api";
  beforeEach(() => {
      window.backendUrlPrefix = urlPrefix;
  });
  it('createUrl', () => {
    expect(sut.createUrl('/kaas')).to.be.equal(`${urlPrefix}/kaas`);
  });
  it ('toQueryArguments', () => {
    expect(sut.toQueryArguments({a: 1, b: 2})).to.be.equal('a=1&b=2');
    expect(sut.toQueryArguments({a: 0, b: 2})).to.be.equal('a=0&b=2');
    expect(sut.toQueryArguments({'page': 0, 'size': 100})).to.be.equal('page=0&size=100');
    expect(sut.toQueryArguments({'page': 1, 'size': 100})).to.be.equal('page=1&size=100');
    expect(sut.toQueryArguments({'page': null, 'size': 100})).to.be.equal('size=100');
  });
});
