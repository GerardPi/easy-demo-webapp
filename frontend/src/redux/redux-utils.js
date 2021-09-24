import * as commonUtils from '../common-utils';

const actionSuffix = {
    command: '_CMD',
    commandRepeat: '_CMD_REPEAT',
    ok: '_OK',
    fail: '_FAIL'
};

export const backendAction = {
    command: { 
        create: prefix => prefix + actionSuffix.command, 
        is: action => commonUtils.endsWith(actionSuffix.command),
        suffix: actionSuffix.command 
    },
    commandRepeat: { 
        create: prefix => prefix + actionSuffix.commandRepeat,
        is: action => commonUtils.endsWith(actionSuffix.commandRepeat),
        suffix: actionSuffix.commandRepeat 
    },
    ok: { 
        create: prefix => prefix + actionSuffix.ok, 
        is: action => commonUtils.endsWith(actionSuffix.ok),
        suffix: actionSuffix.ok,
        toCommand: actionType => actionType.substr(0, actionType.length = actionSuffix.ok.length) + actionSuffix.command
    },
    fail: { 
        create: prefix => prefix + actionSuffix.fail, 
        is: action => commonUtils.endsWith(actionSuffix.fail),
        suffix: actionSuffix.fail,
        toCommand: actionType => actionType.substr(0, actionType.length = actionSuffix.fail.length) + actionSuffix.command
    },
};


export function failureFromCommandAction(commandAction, ticketId) {
    const specificInfoForUser = commonUtils.isSubvalueNullOrEmpty(commandAction.payload, 'infoForUser')
        ? defaultInfoForUser 
        : commandAction.payload.infoForUser;
    return {
        commandType: commandAction.type,
        text: infoForUser.text.fail,
        notificationType: infoForUser.notificationType.warning,
        ticketId
    };
}

export function successFromCommandAction(commandAction) {
    const specificInfoForUser = commonUtils.isSubvalueNullOrEmpty(commandAction.payload, 'infoForUser')
        ? defaultInfoForUser 
        : commandAction.payload.infoForUser;
    return {
        commandType: commandAction.type,
        text: infoForUser.text.fail,
        notificationType: infoForUser.notificationType.warning,
        ticketId
    };
}

export function isInProgress(commandType, state) {
    if (commonUtils.containsPropertyWithKey(state, 'inProgress')) {
        return state.inProgress.indexOf(commandType) > -1;
    }
    return false;
}
