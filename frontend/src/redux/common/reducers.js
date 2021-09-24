import { createReducer } from "@reduxjs/toolkit";
import { defaultReadListSize } from "../../application-defaults";
import { reducerRegistry } from "../reducer-registry";
import * as commonActions from './actions';
import * as reduxUtils from '../redux-utils';
import { produce } from 'immer';

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

const reducer = createReducer(INITIAL_STATE, {
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
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendSuccess(commandType, action.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, state.backendResults);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    },
    [commonActions.backend.command.failed.type]: (state, action) => {
        const cmdType = action.payload.commandType;
        state.commandTypesInProgress = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        state.commandTypesBusy = commonUtils.arrayWithoutValue(state.commandTypesInProgress, cmdType);
        const result = createBackendError(commandType, action.response);
        state.backendResults = commonUtils.objectWith(state.backendResults, cmdType, state.backendResults);
        state.infoForUser = state.infoForUser.concat(action.payload.infoForUser);
    }
});

export const STORE_NAME = 'common';

reducerRegistry.register(STORE_NAME);