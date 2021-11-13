import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../global-variables';

import * as reduxUtils from '../../src/redux/redux-utils';

describe('redux-utils', () => {
  it('creating an action type works as expected', () => {
    expect(reduxUtils.backendAction.command.createType('ABC')).to.be.equal(
      'ABC_CMD'
    );
    expect(reduxUtils.backendAction.ok.createType('ABC')).to.be.equal(
      'ABC_CMD_OK'
    );
    expect(reduxUtils.backendAction.fail.createType('ABC')).to.be.equal(
      'ABC_CMD_FAIL'
    );
  });
  it('creating an action CMD type from a CMD_* type works as expected', () => {
    expect(reduxUtils.toCommandType('ABC_CMD_OK')).to.be.equal('ABC_CMD');
    expect(reduxUtils.toCommandType('ABC_CMD_FAIL')).to.be.equal('ABC_CMD');
  });
});
