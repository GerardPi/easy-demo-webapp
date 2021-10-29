import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import { reducer as commonReducer } from '../../../src/redux/common/reducer';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

describe('addressbook epics', () => {
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('successfull command is detected', {
    let previousState = {}
    commonReducer()
  });
});
