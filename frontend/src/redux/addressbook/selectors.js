import addressbookActions from './actions';
import commonSelectors from '../common/selectors';

const selectors = {
  address: {
    one: {
      item: state => state.addressbook.address.one.item,
    },
    list: {
      items: state => state.addressbook.address.list.items,
      selectionData: state => state.addressbook.address.list.selectionData,
      inProgress: state => commonSelectors.isCommandTypeInProgress(state, addressbookActions.address.readList.command.type)
    }
  },
  person: {
    one: {
      item: state => state.addressbook.person.one.item,
    },
    list: {
      items: state => state.addressbook.person.list.items,
      selectionData: state => state.addressbook.person.list.selectionData,
      inProgress: state => commonSelectors.isCommandTypeInProgress(state, addressbookActions.person.readList.command.type)
    }
  }
}

export default selectors;
