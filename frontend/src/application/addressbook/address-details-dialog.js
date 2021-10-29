import {LitElement, html} from 'lit';
import { connect } from 'pwa-helpers';
import store from '../../redux/store';
import addressbookActions from '../../redux/addressbook/actions';
import * as userFeedback from '../../redux/user-feedback';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/spinner';
import '@kor-ui/kor/components/modal';
import '@kor-ui/kor/components/input';

const EMPTY_ADDRESS = {};

export class AddressDetailsDialog extends connect(store)(LitElement) {
  constructor() {
   super();
   this.address = EMPTY_ADDRESS;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    this.address = EMPTY_ADDRESS;
    this._innerModal.visible = false;
  }

  open(address) {
    this.address = address;
    this._innerModal.visible = true;
  }

  get visible() {
    return this.address !== null;
  }



  remove() {
    console.log(`removing ${JSON.stringify(this.address)}`);
    store.dispatch(addressbookActions.address.delete.command(this.address.id, this.address.etag, userFeedback.deleteItem()));
    this.close();
  }

  _renderDetails() {
      const { countryCode, city, postalCode, street, houseNumber, id, etag} = this.address;
      return html`
          <kor-input label="Country code" value="${countryCode}" readonly></kor-input>
          <kor-input label="City" value="${city}" readonly></kor-input>
          <kor-input label="Postal code" value="${postalCode}" readonly></kor-input>
          <kor-input label="Street" value="${street}" readonly></kor-input>
          <kor-input label="Housenumber" value="${houseNumber}" readonly></kor-input>
          <kor-input label="ID" value="${id}" readonly></kor-input>
          <kor-input label="Entity tag" value="${etag}" readonly></kor-input>
          `;
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  render() {
    return html`
      <kor-modal id="inner-modal" label="Address" height="500px">
        ${this._renderDetails()}
        <kor-button slot="footer" color="secondary" icon="delete" @click="${this.remove}"></kor-button>
        <kor-button slot="footer" color="secondary" label="Close" @click="${this.close}"></kor-button>
      </kor-modal>
    `;
  }
}

AddressDetailsDialog.properties = {
  address: {type: Object}
};

customElements.define('address-details-dialog', AddressDetailsDialog);
