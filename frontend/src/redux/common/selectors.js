import * as commonUtils from '../../common-utils';

const selectors = {
  commandTypeInProgress: (state, commandType) => state.common.commandTypesInProgress.includes(commandType)
}

export default selectors;
