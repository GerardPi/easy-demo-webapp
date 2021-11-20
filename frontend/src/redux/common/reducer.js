import * as reduxToolkit from '@reduxjs/toolkit';
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
    success: isSuccess,
  };
}

function getErrorMessage(response) {
  return 'some error message: TODO: fix this';
}

function createCommandBackendSuccess(commandType, response) {
  return createBackendResult(commandType, response, 'success', true);
}

function createCommandBackendError(commandType, response) {
  return createBackendResult(
    commandType,
    response,
    getErrorMessage(response),
    false
  );
}

function isCommandSuccessAction(action) {
  const common = action.type === commonActions.command.succeeded.type;
  const specific = reduxUtils.backendAction.ok.isType(action.type);
  return common || specific;
}

function isCommandFailureAction(action) {
  const common = action.type === commonActions.command.failed.type;
  const specific = reduxUtils.backendAction.fail.isType(action.type);
  return common || specific;
}

function takeNotificationType(meta) {
  if (commonUtils.isNotNullOrEmpty(meta.userFeedback)) {
    return meta.userFeedback.notificationType;
  }
  return userFeedback.NOTIFICATION_TYPES.none;
}

function convertFeedback(action, cmdType, isSuccess) {
  console.log(`convertFeedback action=${JSON.stringify(action)}`);
  return {
    fb: {
      ...action.payload.meta.userFeedback,
      commandType: cmdType,
      feedbackId: commonUtils.generateId('feedback_'),
      success: isSuccess,
      dateTime: commonUtils.currentDateTime(),
    },
    notificationType: takeNotificationType(action.payload.meta),
  };
}

function processCommandResult(state, action, isSuccess) {
  const cmdType = action.payload.meta.commandType;
  const result = isSuccess
    ? createCommandBackendSuccess(cmdType, action.payload.response)
    : createCommandBackendError(cmdType, action.payload.response);
  state.commandTypesInProgress = state.commandTypesInProgress.filter(
    type => type !== cmdType
  );
  state.commandTypesBusy = state.commandTypesBusy.filter(
    type => type !== cmdType
  );
  state.backendResults[cmdType] = result;
  const { fb, notificationType } = convertFeedback(action, cmdType, isSuccess);
  state.userFeedback[notificationType].push(fb);
}

function mustUserFeedbackBeRetained(fb, feedbackIdsToDelete) {
  return !feedbackIdsToDelete.includes(fb.feedbackId);
}

function userFeedbackWithSpecificItemsDeleted(
  userFeedbackArray,
  feedbackIdsToDelete
) {
  if (feedbackIdsToDelete.length > 0) {
    return userFeedbackArray.filter(fb =>
      mustUserFeedbackBeRetained(fb, feedbackIdsToDelete)
    );
  }
  return userFeedbackArray;
}

const reducer = reduxToolkit.createReducer(INITIAL_STATE, builder => {
  builder
    .addCase(commonActions.command.refreshCommandTypesBusy, (state, action) => {
      const cmdType = action.payload.commandType;
      state.commandTypesBusy = state.commandTypesBusy.filter(
        type => type !== cmdType
      );
      if (state.commandTypesInProgress.includes(cmdType)) {
        state.commandTypesBusy.push(cmdType);
      }
    })
    .addCase(commonActions.transientUserFeedback.deleteNow, (state, action) => {
      state.userFeedback[userFeedback.NOTIFICATION_TYPES.transient] =
        userFeedbackWithSpecificItemsDeleted(
          state.userFeedback[userFeedback.NOTIFICATION_TYPES.transient],
          action.payload.transientUserFeedbackIds
        );
    })
    .addMatcher(isCommandSuccessAction, (state, action) => {
      processCommandResult(state, action, true);
    })
    .addMatcher(isCommandFailureAction, (state, action) => {
      processCommandResult(state, action, false);
    })
    .addMatcher(reduxUtils.backendAction.command.is, (state, action) => {
      const cmdType = action.type;
      state.commandTypesInProgress = state.commandTypesInProgress.filter(
        type => type !== cmdType
      );
      state.commandTypesBusy = state.commandTypesBusy.filter(
        type => type !== cmdType
      );
      state.commandTypesInProgress.push(cmdType);
      delete state.backendResults[cmdType];
    });
});

export default reducer;
