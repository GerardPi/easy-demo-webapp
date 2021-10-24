import { createAction } from '@reduxjs/toolkit';

const actions = {
    command: {
        succeeded: createAction('BACKEND_COMMAND_SUCCEEDED', (commandType, response, meta) =>
            ({payload: { commandType, response, meta}})),
        failed: createAction('BACKEND_COMMAND_FAILED', (commandType, response, meta, errorResponseData = null) =>
            ({payload: { commandType, response, meta, errorResponseData}})),
        refreshCommandTypesBusy: createAction('REFRESH_COMMAND_TYPES_BUSY', commandType =>
            ({ payload: { commandType }}))
    }
};

export default actions;
