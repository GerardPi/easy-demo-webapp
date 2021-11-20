/*
This file contains user feedback data:
  * declare how to notify a user (notification arrangements)
  * structures to hold user feedback messages
  * some generic feedback messages
*/
export const NOTIFICATION_TYPES = {
  custom: 'NOTIFY_TYPE_CUSTOM',
  confirmed: 'NOTIFY_TYPE_CONFIRMED',
  transient: 'NOTIFY_TYPE_TRANSIENT',
  none: 'NOTIFY_TYPE_NONE',
};

export const notificationArrangements = {
  infoAndWarning: {
    info: NOTIFICATION_TYPES.confirmed,
    warning: NOTIFICATION_TYPES.confirmed,
  },
  infoTransientAndWarning: {
    info: NOTIFICATION_TYPES.transient,
    warning: NOTIFICATION_TYPES.confirmed,
  },
  warningOnly: {
    info: NOTIFICATION_TYPES.none,
    warning: NOTIFICATION_TYPES.confirmed,
  },
  none: { info: NOTIFICATION_TYPES.none, warning: NOTIFICATION_TYPES.none },
};

const PLEASE_TRY_AGAIN = 'Please try again.';

export const createItem = ({
  notificationArrangement = notificationArrangements.infoTransientAndWarning,
  details = null,
} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The item was created successfully',
    fail: `The item could not be created. ${details || PLEASE_TRY_AGAIN}`,
  },
});

export const deleteItem = ({
  notificationArrangement = notificationArrangements.infoTransientAndWarning,
  details = null,
} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The item was deleted successfully',
    fail: `The item was not deleted. ${details || PLEASE_TRY_AGAIN}`,
  },
});

export const readOne = ({
  notificationArrangement = notificationArrangements.warningOnly,
  details = null,
} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The item was loaded successfully',
    fail: `Item could not be loaded from server. ${
      details || PLEASE_TRY_AGAIN
    }`,
  },
});

export const readData = ({
  notificationArrangement = notificationArrangements.warningOnly,
  details = null,
} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The data was loaded successfully',
    fail: `Data could not be loaded from server. ${
      details || PLEASE_TRY_AGAIN
    }`,
  },
});

export const readList = ({
  notificationArrangement = notificationArrangements.warningOnly,
  details = null,
} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The list was loaded successfully',
    fail: `The list could not be loaded. ${details || PLEASE_TRY_AGAIN}`,
  },
});

export const USER_FEEDBACK_TEXT_OK_DEFAULT = '[no message available (ok)]';
export const USER_FEEDBACK_TEXT_FAIL_DEFAULT = '[no message available (fail)]';

export const USER_FEEDBACK_DATA_DEFAULT = {
  notificationArrangement: notificationArrangements.warningOnly,
  text: {
    ok: USER_FEEDBACK_TEXT_OK_DEFAULT,
    fail: USER_FEEDBACK_TEXT_FAIL_DEFAULT,
  },
};
