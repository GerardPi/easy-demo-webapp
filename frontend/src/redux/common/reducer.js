import * as reduxToolkit from "@reduxjs/toolkit";
import { defaultReadListSize } from "../../application-defaults";
import * as commonActions from './actions';
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
    return createBackendResult(commandType, response, getErrorMessage(response), true);
}

function createBackendError(commandType, response) {
    return createBackendResult(commandType, response, getErrorMessage(response), false);
}

const reducer = reduxToolkit.createReducer(INITIAL_STATE, {
    [commonActions.backend.command.refreshCommandTypesBusy.type]: (state, action) => {
        const cmdType = action.payload.commandType;
        if (reduxUtils.isInProgress(cmdType, state)) {
            state.commandTypesBusy = commonUtils.arrayWithValue(cmdType, state.commandTypesBusy);
        } else {
            state.commandTypesBusy = commonUtils.arrayWithoutValue(cmdType, state.commandTypesBusy);
        }
    },
    [commonActions.backend.command.started.type]: (state, action) => {
        const cmdType = action.payload.commandType;
        state.commandTypesInProgress = commonUtils.arrayWithValue(cmdType, state.commandTypesInProgress);
        state.backendResults = commonUtils.objectWithout(state.backendResults, cmdType);
    },
    [commonActions.backend.command.succeeded.type]: (state, action) => {
        const cmdType = action.payload.commandType;
        console.log(`###### commonActions.backend.command.succeeded.type: ${JSON.stringify(action)}, action.payload= ${JSON.stringify(action.payload)}`);
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendSuccess(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    },
    [commonActions.backend.command.failed.type]: (state, action) => {
        const cmdType = action.payload.commandType;
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendError(cmdType, action.payload.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, result);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    }
});

export default reducer;
