import * as reduxToolkit from "@reduxjs/toolkit";
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';
import * as commonUtils from '../../common-utils';

const INITIAL_VALUES = {
    commandTypesBusy: [],
    commandTypesInProgress: [],
    backendResults: {},
    infoForUser: []
};

const INITIAL_STATE = {
    commandTypesBusy: INITIAL_VALUES.commandTypesBusy,
    commandTypesInProgress: INITIAL_VALUES.commandTypesInProgress,
    backendResults: INITIAL_VALUES.backendResults,
    infoForUser: INITIAL_VALUES.infoForUser
};

function createBackendResult(commandType, response, message, isSuccess) {
    return {
        commandType,
        response,
        message,
        success: isSuccess
    };
}

function getErrorMessage(response) {
    return 'some error message: TODO: fix this';
}

function createBackendSuccess(commandType, response) {
    return createBackendResult(commandType, response, 'success', true);
}

function createBackendError(commandType, response) {
    return createBackendResult(commandType, response, getErrorMessage(response), false);
}

const reducer = reduxToolkit.createReducer(
  INITIAL_STATE,
  (builder) => {
    builder
    .addCase(commonActions.command.refreshCommandTypesBusy, (state, action) => {
        const cmdType = action.payload.commandType;
        if (reduxUtils.isInProgress(cmdType, state)) {
            state.commandTypesBusy = commonUtils.arrayWithValue(cmdType, state.commandTypesBusy);
        } else {
            state.commandTypesBusy = commonUtils.arrayWithoutValue(cmdType, state.commandTypesBusy);
        }
    })
    .addMatcher(reduxUtils.backendAction.command.is, (state, action) => {
        const cmdType = action.type;
        state.commandTypesInProgress = commonUtils.arrayWithValue(state.commandTypesInProgress, cmdType);
        state.backendResults = commonUtils.objectWithout(state.backendResults, cmdType);
    })
    .addMatcher(reduxUtils.backendAction.ok.is, (state, action) => {
        const cmdType = action.type;
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendSuccess(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    })
    .addMatcher(reduxUtils.backendAction.fail.is, (state, action) => {
        const cmdType = action.type;
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendError(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    })
  }
);

export default reducer;
