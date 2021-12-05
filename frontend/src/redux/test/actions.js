import { ajax } from 'rxjs/ajax';
import * as reduxUtils from '../redux-utils';
import { createAction } from '@reduxjs/toolkit';
import APP_DEFAULTS from '../../application-defaults';
import * as userFeedback from '../user-feedback';

const actionTypePrefixes = {
  testOne: 'TEST_ONE'
};

const test = {
  a: {
    command: createAction(
      reduxUtils.backendAction.command.createType(
        actionTypePrefixes.testOne
      ),
      (testAData, userFeedbackData = userFeedback.testA()) => ({
        payload: { testAData, userFeedbackData },
      })
    ),
    ok: createAction(
      reduxUtils.backendAction.ok.createType(actionTypePrefixes.testOne),
      (response, meta) => ({ payload: { response, meta } })
    )
  },
};

const actions = {
  test
};

export default actions;
