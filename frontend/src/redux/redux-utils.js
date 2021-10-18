import * as commonUtils from '../common-utils';
import * as userFeedbacks from './user-feedbacks';
import commonActions from './common/actions';

const ACTION_SUFFIX = {
    command: '_CMD',
    commandRepeat: '_CMD_REPEAT',
    ok: '_CMD_OK',
    fail: '_CMD_FAIL'
};

export const backendAction = {
    command: {
        create: prefix => prefix + ACTION_SUFFIX.command,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.command),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.command),
        suffix: ACTION_SUFFIX.command
    },
    commandRepeat: {
        create: prefix => prefix + ACTION_SUFFIX.commandRepeat,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.commandRepeat),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.commandRepeat),
        suffix: ACTION_SUFFIX.commandRepeat
    },
    ok: {
        create: prefix => prefix + ACTION_SUFFIX.ok,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.ok),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.ok),
        suffix: ACTION_SUFFIX.ok,
        toCommand: actionType => actionType.substr(0, actionType.length - ACTION_SUFFIX.ok.length) + ACTION_SUFFIX.command
    },
    fail: {
        create: prefix => prefix + ACTION_SUFFIX.fail,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.fail),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.fail),
        suffix: ACTION_SUFFIX.fail,
        toCommand: actionType => actionType.substr(0, actionType.length - ACTION_SUFFIX.fail.length) + ACTION_SUFFIX.command
    },
};

function getUserFeedback(commandAction) {
  return commonUtils.isSubvalueNullOrEmpty(commandAction.payload, 'userFeedback')
      ? userFeedbacks.USER_FEEDBACK_DEFAULT
      : commandAction.payload.userFeedback;
}


export function failureUserFeedbackFromCommandAction(commandAction, ticketId) {
  const userFeedback = getUserFeedback(commandAction);
  return {
      notificationArrangement: userFeedback.notificationArrangement.warning,
      text: userFeedback.text.fail,
      ticketId
  };
}

export function successUserFeedbackFromCommandAction(commandAction) {
  const userFeedback = getUserFeedback(commandAction);
  return {
    notificationArrangement: userFeedback.notificationArrangement.info,
    text: userFeedback.text.ok
  };
}

const RESPONSE_DEFAULT = '[no response available]';
const NO_DATA_AVAILABLE = '[no data available]';
const HTTP_STATUS_CODE = {
  BAD_REQUEST: 400,
  PRECONDITION_FAILED: 412
};

function resolveErrorResponse(error) {
  if (commonUtils.isSubvalueNotNullOrEmpty(error, 'response')) {
    const response = error.response;
    if (commonUtils.isSubvalueNotNullOrEmpty(response, 'status')) {
      const status = response.status;
      if (status === HTTP_STATUS_CODE.BAD_REQUEST) {
        return null;
      }

      if (status === HTTP_STATUS_CODE.PRECONDITION_FAILED) {
        return { status, result: NO_DATA_AVAILABLE };
      }

      if (commonUtils.isSubvalueNotNullOrEmpty(response, 'data')) {
        const responseData = response.data;
        if (commonUtils.isSubvalueNotNullOrEmpty(responseData, 'id')) {
          return { status, result: 'ERROR_ID', id: responseData.id };
        }
        console.log('No response.data.id was available.');
      }
    }
  }
  console.log('No response was available to resolve...');
  return null;
}

function problemTicketIdFromResponse(response) {
  if (commonUtils.isSubvalueNotNullOrEmpty(response, 'data')) {
    const data = response.data;
    if (commonUtils.isSubvalueNotNullOrEmpty(data, 'id')) {
      return data.id;
    }
  }
  return null;
}

export function createCommonSuccessAction(commandAction, someResponse) {
  console.log(`### createCommonSuccessAction ${JSON.stringify(commandAction)}`);
  const response = commonUtils.isNullOrEmpty(someResponse) ? RESPONSE_DEFAULT : someResponse;
  const userFeedback = successUserFeedbackFromCommandAction(commandAction);
  const result = commonActions.command.succeeded(commandAction.type, response, userFeedback);
  console.log(`### createCommonSuccessAction result ${JSON.stringify(result)}`);
  return result;
}

export function createCommonFailureAction(commandAction, someError) {
  const response = commonUtils.isSubvalueNullOrEmpty(someError, 'response') ? RESPONSE_DEFAULT : someError.response;
  const ticketId = problemTicketIdFromResponse(response);
  const userFeedback = failureUserFeedbackFromCommandAction(commandAction, ticketId);
  const errorResponse = resolveErrorResponse(someError);
  const result = commonActions.command.failed(commandAction.type, response, userFeedback, errorResponse);
  console.log(`### createCommonFailureAction result ${JSON.stringify(result)}`);
  return result;
}


export function isInProgress(commandType, state) {
    if (commonUtils.containsPropertyWithKey(state, 'inProgress')) {
        return state.inProgress.indexOf(commandType) > -1;
    }
    return false;
}
