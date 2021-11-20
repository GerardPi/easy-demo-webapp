import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import commonReducer from '../../../src/redux/common/reducer';
import {
  INITIAL_STATE,
  INITIAL_VALUES,
} from '../../../src/redux/common/initial';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

describe('common reducer', () => {
  beforeEach(() => {});
  afterEach(() => {});
  it('successfull command is detected', () => {
    const currentState = INITIAL_STATE;
    const givenAction = commonActions.command.succeeded(
      {},
      { commandType: 'SOME_CMD' }
    );
    console.log(`### givenAction=${JSON.stringify(givenAction)}`);
    const newState = commonReducer(currentState, givenAction);
    console.log(`### currentState=${JSON.stringify(currentState)}`);
    console.log(`### newState=${JSON.stringify(newState)}`);
    // TODO: assert something
  });
});
