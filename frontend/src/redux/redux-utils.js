import * as commonUtils from '../common-utils';
import * as userInfo from './info-for-user';
import * as commonActions from './common/actions';

const ACTION_SUFFIX = {
    command: '_CMD',
    commandRepeat: '_CMD_REPEAT',
    ok: '_OK',
    fail: '_FAIL'
};

export const backendAction = {
    command: {
        create: prefix => prefix + ACTION_SUFFIX.command,
        is: action => commonUtils.endsWith(action, ACTION_SUFFIX.command),
        suffix: ACTION_SUFFIX.command
    },
    commandRepeat: {
        create: prefix => prefix + ACTION_SUFFIX.commandRepeat,
        is: action => commonUtils.endsWith(action, ACTION_SUFFIX.commandRepeat),
        suffix: ACTION_SUFFIX.commandRepeat
    },
    ok: {
        create: prefix => prefix + ACTION_SUFFIX.ok,
        is: action => commonUtils.endsWith(action, ACTION_SUFFIX.ok),
        suffix: ACTION_SUFFIX.ok,
        toCommand: actionType => actionType.substr(0, actionType.length - ACTION_SUFFIX.ok.length) + ACTION_SUFFIX.command
    },
    fail: {
        create: prefix => prefix + ACTION_SUFFIX.fail,
        is: action => commonUtils.endsWith(action, ACTION_SUFFIX.fail),
        suffix: ACTION_SUFFIX.fail,
        toCommand: actionType => actionType.substr(0, actionType.length - ACTION_SUFFIX.fail.length) + ACTION_SUFFIX.command
    },
};

function getInfoForUser(commandAction) {
  return commonUtils.isSubvalueNullOrEmpty(commandAction.payload, 'infoForUser')
      ? userInfo.INFO_FOR_USER_DEFAULT
      : commandAction.payload.infoForUser;
}


export function failureUserInfoFromCommandAction(commandAction, ticketId) {
  const infoForUser = getInfoForUser(commandAction);
  return {
      notificationArrangement: infoForUser.notificationArrangement.warning,
      text: infoForUser.text.fail,
      commandType: commandAction.type,
      ticketId
  };
}

export function successUserInfoFromCommandAction(commandAction) {
  const infoForUser = getInfoForUser(commandAction);
  return {
    notificationArrangement: infoForUser.notificationArrangement.info,
    text: infoForUser.text.ok,
    commandType: commandAction.type
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
      } else if (status === HTTP_STATUS_CODE.PRECONDITION_FAILED) {
        return { status, result: NO_DATA_AVAILABLE };
      } else if (commonUtils.isSubvalueNotNullOrEmpty(response, 'data')) {
        const responseData = response.data;
        if (commonUtils.isSubvalueNotNullOrEmpty(responseData, 'id')) {
          return { status, result: ERROR_ID, id: responseData.id };
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
  const response = commonUtils.isValueNullOrEmpty(someResponse) ? RESPONSE_DEFAULT : someResponse;
  const infoForUser = successUserInfoFromCommandAction(commandAction);
  return commonActions.backend.command.succeeded(commandAction.type, response, infoForUser);
}

export function createCommonFailureAction(commandAction, someError) {
  const response = commonUtils.isSubvalueNullOrEmpty(someError, 'response') ? RESPONSE_DEFAULT : someError.response;
  const ticketId = problemTicketIdFromResponse(response);
  const infoForUser = failureUserInfoFromCommandAction(commandAction, ticketId);
  const errorResponse = resolveErrorResponse(someError);
  return commonActions.backend.command.failed(commandAction.type, response, infoForUser, errorResponse);
}


export function isInProgress(commandType, state) {
    if (commonUtils.containsPropertyWithKey(state, 'inProgress')) {
        return state.inProgress.indexOf(commandType) > -1;
    }
    return false;
}
