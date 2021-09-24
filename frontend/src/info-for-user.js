
const notificationType = {
    custom: 'NOTIF_TYPE_CUSTOM',
    confirmed: 'NOTIF_TYPE_CONFIRMED',
    transient: 'NOTIF_TYPE_TRANSIENT',
    none: 'NOTIF_TYPE_NONE'
};

export const notificationArrangement = {
    infoAndWarning: { info: notificationType.confirmed, warning: notificationType.confirmed },
    infoTransientAndWarning: { info: notificationType.transient, warning: notificationType.confirmed },
    warningOnly: { info: notificationType.none, warning: notificationType.confirmed },
    none: { info: notificationType.none, warning: notificationType.none }
};

export const defaultInfoForUser = {
    notificationType: infoForUser.notificationType.warningOnly,
    text: {
        fail: '[no message available (fail)]',
        ok: '[no message available (ok)]'
    }
};