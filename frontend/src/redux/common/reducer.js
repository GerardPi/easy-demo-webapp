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

function isSuccessAction(action) {
  const common = (action.type === commonActions.command.succeeded.type);
  const specific = reduxUtils.backendAction.ok.isType(action.type);
  return common || specific;
}

function isFailureAction(action) {
  const common = (action.type === commonActions.command.failed.type);
  const specific = reduxUtils.backendAction.fail.isType(action.type);
  return common || specific;
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
    .addMatcher(isSuccessAction, (state, action) => {
        const cmdType = action.payload.meta.commandType;
        state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        const result = createBackendSuccess(cmdType, action.payload.response);
        state.backendResults = state.backendResults[cmdType] = result;
        state.userFeedback.push(action.payload.meta.userFeedback);
    })
    .addMatcher(isFailureAction, (state, action) => {
        const cmdType = action.payload.meta.commandType;
        state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        const result = createBackendError(cmdType, action.payload.response);
        state.backendResults = state.backendResults[cmdType] = result;
        state.userFeedback.push(action.payload.meta.userFeedback);
    })
    .addMatcher(reduxUtils.backendAction.command.is, (state, action) => {
        const cmdType = action.type;
        state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
        state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
        state.commandTypesInProgress.push(cmdType);
        delete state.backendResults[cmdType];
    })
  }
);

export default reducer;
