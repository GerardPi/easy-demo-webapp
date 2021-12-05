import * as reduxToolkit from '@reduxjs/toolkit';
import applicationDefaults from '../../application-defaults';
import testActions from './actions';

const INITIAL_VALUES = {
  test: {
    a: ''
  },
};

const INITIAL_STATE = {
  test: {
    a: INITIAL_VALUES.test.a
  }
};

const reducer = reduxToolkit.createReducer(INITIAL_STATE, {
  [testActions.test.a.command.type]: (state, action) => {
    state.test.aResult = INITIAL_VALUES.test.aResult;
  },
  [testActions.test.a.ok.type]: (state, action) => {
    state.test.aResult = action.payload.response.content;
  }
});

export default reducer;
