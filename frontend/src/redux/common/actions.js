import { createAction } from '@reduxjs/toolkit';

const actions = {
    command: {
        succeeded: createAction('CMD_OK_COMMON', (response, meta) =>
            ({payload: { response, meta}})),
        failed: createAction('CMD_FAIL_COMMON', (response, meta, errorResponseData = null) =>
            ({payload: { response, meta, errorResponseData}})),
        refreshCommandTypesBusy: createAction('REFRESH_CMD_TYPES_BUSY', commandType =>
            ({ payload: { commandType }}))
    }
};

export default actions;
