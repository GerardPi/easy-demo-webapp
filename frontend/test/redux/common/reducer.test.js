import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import commonReducer from '../../../src/redux/common/reducer';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

describe('common reducer', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('successfull command is detected', () => {
    const previousState = {}
    commonReducer(previousState, commonActions.command.succeeded({}, {}));
  });
});
