import { createAction } from '@reduxjs/toolkit';

export const backend = {
    command: {
        started: createAction('BACKEND_COMMAND_STARTED', (commandType, payload) => 
            ({payload: { commandType, payload}})),
        failed: createAction('BACKEND_COMMAND_FAILED', (commandType, response, infoForUser, errorResponseData = null) => 
            ({payload: { commandType, response, infoForUser, errorResponseData}})),
        succeeded: createAction('BACKEND_COMMAND_SUCCEEDED', (commandType, response, infoForUser) => 
            ({payload: { commandType, response, infoForUser}})),
        refreshCommandTypesBusy: createAction('REFRESH_COMMAND_TYPES_BUSY', commandType => ({ payload: { commandType }}))
    }
};