import addressbookActions from './actions';
import commonSelectors from '../common/selectors';

const selectors = {
  address: {
    one: {
      item: state => state.addressbook.address.one.item,
    },
    list: {
      items: state => state.addressbook.address.list.items,
      inProgress: state => commonSelectors.commandTypeInProgress(state, addressbookActions.address.readList.command.type)
    }
  },
  person: {
    one: {
      item: state => state.addressbook.person.one.item,
    },
    list: {
      items: state => state.addressbook.person.list.items
    }
  }
}

export default selectors;
