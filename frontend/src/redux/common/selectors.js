import * as commonUtils from '../../common-utils';

const selectors = {
  commandTypeInProgress: (state, commandType) => state.common.commandTypesInProgress.includes(commandType),
  isSomethingInProgress: (state) => commonUtils.isNotNullOrEmpty(state.common.commandTypesInProgress),
  isSomethingBusy: (state) => commonUtils.isNotNullOrEmpty(state.common.commandTypesBusy)
}

export default selectors;
