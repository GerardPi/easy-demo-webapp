import * as commonUtils from '../../common-utils';
import * as userFeedback from '../user-feedback';

const selectors = {
  isCommandTypeInProgress: (state, commandType) => state.common.commandTypesInProgress.includes(commandType),
  isSomethingInProgress: (state) => commonUtils.isNotNullOrEmpty(state.common.commandTypesInProgress),
  isSomethingBusy: (state) => commonUtils.isNotNullOrEmpty(state.common.commandTypesBusy),
  userFeedback: {
    custom: (state) => state.common.userFeedback[userFeedback.NOTIFICATION_TYPES.custom],
    confirmed: (state) => state.common.userFeedback[userFeedback.NOTIFICATION_TYPES.confirmed],
    transient: (state) => state.common.userFeedback[userFeedback.NOTIFICATION_TYPES.transient],
    none: (state) => state.common.userFeedback[userFeedback.NOTIFICATION_TYPES.none]
  }
};

export default selectors;
