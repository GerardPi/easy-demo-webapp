import * as reduxToolkit from "@reduxjs/toolkit";
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';
import * as commonUtils from '../../common-utils';
import { INITIAL_STATE, INITIAL_VALUES } from './initial';
import * as userFeedback from '../user-feedback';

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

function createCommandBackendSuccess(commandType, response) {
    return createBackendResult(commandType, response, 'success', true);
}

function createCommandBackendError(commandType, response) {
    return createBackendResult(commandType, response, getErrorMessage(response), false);
}

function isCommandSuccessAction(action) {
  const common = (action.type === commonActions.command.succeeded.type);
  const specific = reduxUtils.backendAction.ok.isType(action.type);
  return common || specific;
}

function isCommandFailureAction(action) {
  const common = (action.type === commonActions.command.failed.type);
  const specific = reduxUtils.backendAction.fail.isType(action.type);
  return common || specific;
}

function processCommandResult(state, action, isSuccess) {
  const cmdType = action.payload.meta.commandType;
  const result = isSuccess
    ? createCommandBackendSuccess(cmdType, action.payload.response)
    : createCommandBackendError(cmdType, action.payload.response);
  state.commandTypesInProgress = state.commandTypesInProgress.filter(type => type !== cmdType);
  state.commandTypesBusy = state.commandTypesBusy.filter(type => type !== cmdType);
  state.backendResults[cmdType] = result;
  const fb = {
    ...action.payload.meta.userFeedback,
    commandType: cmdType,
    feedbackId: commonUtils.generateId('feedback_'),
    success: isSuccess,
    dateTime: commonUtils.currentDateTime()
  };
  state.userFeedback.push(fb);
}

function mustUserFeedbackBeRetained(fb, feedbackIdsToDelete) {
  const isTransientFb = fb.notificationArrangement === userFeedback.NOTIFICATION_TYPES.transient;
  return !(isTransientFb && feedbackIdsToDelete.includes(fb.feedbackId));
}

function deleteTransientUserFeedback(userFeedbackArray, feedbackIdsToDelete) {
  return userFeedbackArray.filter(fb => mustUserFeedbackBeRetained(fb, feedbackIdsToDelete));
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
    .addCase(commonActions.transientUserFeedback.deleteNow, (state, action) => {
      state.userFeedback = deleteTransientUserFeedback(state.userFeedback, action.payload.transientUserFeedbackIds);
    })
    .addMatcher(isCommandSuccessAction, (state, action) => {
        processCommandResult(state, action, true);
    })
    .addMatcher(isCommandFailureAction, (state, action) => {
        processCommandResult(state, action, false);
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
