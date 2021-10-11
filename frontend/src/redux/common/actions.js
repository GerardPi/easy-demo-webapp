import { createAction } from '@reduxjs/toolkit';

const actions = {
    command: {
        succeeded: createAction('BACKEND_COMMAND_SUCCEEDED', (commandType, response, infoForUser) =>
            ({payload: { commandType, response, infoForUser}})),
        failed: createAction('BACKEND_COMMAND_FAILED', (commandType, response, infoForUser, errorResponseData = null) =>
            ({payload: { commandType, response, infoForUser, errorResponseData}})),
        refreshCommandTypesBusy: createAction('REFRESH_COMMAND_TYPES_BUSY', commandType => ({ payload: { commandType }}))
    }
};

export default actions;
