import * as userFeedback from '../user-feedback';

export const INITIAL_VALUES = {
  commandTypesBusy: [],
  commandTypesInProgress: [],
  backendResults: {},
  userFeedback: {
    [userFeedback.NOTIFICATION_TYPES.custom]: [],
    [userFeedback.NOTIFICATION_TYPES.transient]: [],
    [userFeedback.NOTIFICATION_TYPES.confirmed]: [],
    [userFeedback.NOTIFICATION_TYPES.none]: [],
  },
};

export const INITIAL_STATE = {
  commandTypesBusy: INITIAL_VALUES.commandTypesBusy,
  commandTypesInProgress: INITIAL_VALUES.commandTypesInProgress,
  backendResults: INITIAL_VALUES.backendResults,
  userFeedback: INITIAL_VALUES.userFeedback,
};
