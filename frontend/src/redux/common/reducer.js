import * as reduxToolkit from "@reduxjs/toolkit";
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';
import * as commonUtils from '../../common-utils';

const INITIAL_VALUES = {
    commandTypesBusy: [],
    commandTypesInProgress: [],
    backendResults: {},
    userFeedback: []
};

const INITIAL_STATE = {
    commandTypesBusy: INITIAL_VALUES.commandTypesBusy,
    commandTypesInProgress: INITIAL_VALUES.commandTypesInProgress,
    backendResults: INITIAL_VALUES.backendResults,
    userFeedback: INITIAL_VALUES.userFeedback
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
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        if (state.commandTypesInProgress.includes(cmdType)) {
            state.commandTypesBusy.push(cmdType);
        }
    })
    .addCase(commonActions.command.succeeded, (state, action) => {
        const cmdType = reduxUtils.backendAction.ok.toCommand(action.payload.commandType);
        console.log(`### action=${JSON.stringify(action)} cmdType=${cmdType}`);
        console.log(`### 1 state.commandTypesInProgress=${JSON.stringify(state.commandTypesInProgress)}`);
        state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
        console.log(`### 2 state.commandTypesInProgress=${JSON.stringify(state.commandTypesInProgress)}`);
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        const result = createBackendSuccess(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.userFeedback = state.userFeedback.concat(action.payload.userFeedback);
    })
    .addCase(commonActions.command.failed, (state, action) => {
        const cmdType = reduxUtils.backendAction.fail.toCommand(action.payload.commandType);
        console.log(`### action=${JSON.stringify(action)} cmdType=${cmdType}`);
        console.log(`### 3 state.commandTypesInProgress=${JSON.stringify(state.commandTypesInProgress)}`);
        state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
        console.log(`### 4 state.commandTypesInProgress=${JSON.stringify(state.commandTypesInProgress)}`);
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        const result = createBackendError(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.userFeedback = state.userFeedback.concat(action.payload.userFeedback);
    })
    .addMatcher(reduxUtils.backendAction.command.is, (state, action) => {
        const cmdType = action.type;
        state.commandTypesInProgress.push(cmdType);
        state.backendResults = commonUtils.objectWithout(state.backendResults, cmdType);
    })
  }
);

export default reducer;
