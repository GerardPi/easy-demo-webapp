import { createAction } from '@reduxjs/toolkit';

const actions = {
    command: {
        succeeded: createAction('BACKEND_COMMAND_SUCCEEDED', (commandType, response, userFeedback) =>
            ({payload: { commandType, response, userFeedback}})),
        failed: createAction('BACKEND_COMMAND_FAILED', (commandType, response, userFeedback, errorResponseData = null) =>
            ({payload: { commandType, response, userFeedback, errorResponseData}})),
        refreshCommandTypesBusy: createAction('REFRESH_COMMAND_TYPES_BUSY', commandType =>
            ({ payload: { commandType }}))
    }
};

export default actions;
