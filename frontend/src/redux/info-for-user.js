
const notificationType = {
    custom: 'NOTIFY_TYPE_CUSTOM',
    confirmed: 'NOTIFY_TYPE_CONFIRMED',
    transient: 'NOTIFY_TYPE_TRANSIENT',
    none: 'NOTIFY_TYPE_NONE'
};

export const notificationArrangements = {
    infoAndWarning: { info: notificationType.confirmed, warning: notificationType.confirmed },
    infoTransientAndWarning: { info: notificationType.transient, warning: notificationType.confirmed },
    warningOnly: { info: notificationType.none, warning: notificationType.confirmed },
    none: { info: notificationType.none, warning: notificationType.none }
};

const PLEASE_TRY_AGAIN = "Please try again.";

export const readList = ({notificationArrangement = notificationArrangements.warningOnly, details = null} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The list was loaded successfully',
    fail: 'The list could not be loaded from server. ' + (details ? details : PLEASE_TRY_AGAIN)
  }
});

export const removeItem = ({notificationArrangement = notificationArrangements.infoAndWarning, details = null} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The item was removed successfully',
    fail: 'The item was not removed. ' + (details ? details : PLEASE_TRY_AGAIN)
  }
});

export const readOne = ({notificationArrangement = notificationArrangements.warningOnly, details = null} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The item was loaded successfully',
    fail: 'Item could not be loaded from server. ' + (details ? details : PLEASE_TRY_AGAIN)
  }
});

export const readData = ({notificationArrangement = notificationArrangements.warningOnly, details = null} = {}) => ({
  notificationArrangement,
  text: {
    ok: 'The data was loaded successfully',
    fail: 'Data could not be loaded from server. ' + (details ? details : PLEASE_TRY_AGAIN)
  }
});

export const INFO_FOR_USER_DEFAULT = {
    notificationArrangement: notificationArrangements.warningOnly,
    text: {
        fail: '[no message available (fail)]',
        ok: '[no message available (ok)]'
    }
};
