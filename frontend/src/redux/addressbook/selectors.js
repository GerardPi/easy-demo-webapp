const selectors = {
  address: {
      one: state => state.addressbook.address.one,
      list: state => state.addressbook.address.list
  },
  person: {
    one: state => state.addressbook.person.one,
    list: state => state.addressbook.person.list
  }
}

export default selectors;
