import * as commonUtils from '../common-utils';
import * as userFeedback from './user-feedback';
import commonActions from './common/actions';

const ACTION_SUFFIX = {
    command: '_CMD',
    commandRepeat: '_CMD_REPEAT',
    ok: '_CMD_OK',
    fail: '_CMD_FAIL'
};

export function toCommandType(okOrFailType) {
  if (okOrFailType.endsWith(ACTION_SUFFIX.fail)) {
    return okOrFailType.substr(0, okOrFailType.length - ACTION_SUFFIX.fail.length) + ACTION_SUFFIX.command
  }
  if (okOrFailType.endsWith(ACTION_SUFFIX.ok)) {
    return okOrFailType.substr(0, okOrFailType.length - ACTION_SUFFIX.ok.length) + ACTION_SUFFIX.command
  }
  throw new Error(`Command type to process must end with either '${ACTION_SUFFIX.fail}' or '${ACTION_SUFFIX.ok}'`);
}

export const backendAction = {
    command: {
        createType: prefix => prefix + ACTION_SUFFIX.command,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.command),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.command),
        suffix: ACTION_SUFFIX.command
    },
    commandRepeat: {
        createType: prefix => prefix + ACTION_SUFFIX.commandRepeat,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.commandRepeat),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.commandRepeat),
        suffix: ACTION_SUFFIX.commandRepeat
    },
    ok: {
        createType: prefix => prefix + ACTION_SUFFIX.ok,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.ok),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.ok),
        suffix: ACTION_SUFFIX.ok
    },
    fail: {
        createType: prefix => prefix + ACTION_SUFFIX.fail,
        is: action => commonUtils.endsWith(action.type, ACTION_SUFFIX.fail),
        isType: actionType => commonUtils.endsWith(actionType, ACTION_SUFFIX.fail),
        suffix: ACTION_SUFFIX.fail
    },
};

function getUserFeedbackData(commandAction) {
  return commonUtils.isSubvalueNullOrEmpty(commandAction.payload, 'userFeedbackData')
      ? userFeedback.USER_FEEDBACK_DATA_DEFAULT
      : commandAction.payload.userFeedbackData;
}


export function createFailureMetaData(commandAction, ticketId) {
  const userFeedbackData = getUserFeedbackData(commandAction);
  return {
    userFeedback: {
      notificationArrangement: userFeedbackData.notificationArrangement.warning,
      text: userFeedbackData.text.fail,
      ticketId
    },
    commandType: commandAction.type
  };
}


const RESPONSE_DEFAULT = '[no response available]';
const NO_TICKET_ID_AVAILABLE = '[no ticket ID available]';
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
  return NO_TICKET_ID_AVAILABLE;
}

export function createSuccessMetaData(commandAction) {
  const userFeedbackData = getUserFeedbackData(commandAction);
  return {
    userFeedback: {
      notificationArrangement: userFeedbackData.notificationArrangement.info,
      text: userFeedbackData.text.ok
    },
    commandType: commandAction.type
  };
}

export function createCommonSuccessAction(commandAction, someResponse) {
  const meta = createSuccessMetaData(commandAction);
  const response = commonUtils.isNullOrEmpty(someResponse) ? RESPONSE_DEFAULT : someResponse;
  const result = commonActions.command.succeeded(response, meta);
  return result;
}

export function createCommonFailureAction(commandAction, someError) {
  const response = commonUtils.isSubvalueNullOrEmpty(someError, 'response') ? RESPONSE_DEFAULT : someError.response;
  const ticketId = problemTicketIdFromResponse(response);
  const meta = createFailureMetaData(commandAction, ticketId);
  const errorResponse = resolveErrorResponse(someError);
  return commonActions.command.failed(response, meta, errorResponse);
}

export function createRepeatAction(commandAction, currentS) {
}

export function isInProgress(commandType, state) {
    if (commonUtils.containsPropertyWithKey(state, 'inProgress')) {
        return state.inProgress.indexOf(commandType) > -1;
    }
    return false;
}
