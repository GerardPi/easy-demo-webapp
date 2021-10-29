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
const MODE_ADD = 'ADD';
const MODE_EDIT = 'EDIT';
const MODE_VIEW = 'VIEW';

export class AddressEditDialog extends connect(store)(LitElement) {
  constructor() {
   super();
   this.open = false;
   this.address = EMPTY_ADDRESS;
   this.mode = MODE_VIEW;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    this.address = EMPTY_ADDRESS;
    this.visible = false;
  }

  openForAddition() {
    this.address = {};
    this.mode = MODE_ADD;
    this.visible = true;
  }

  openForEdit(address) {
    this.address = address;
    this.mode = MODE_EDIT;
    this.visible = true;
  }

  open(address) {
    this.address = address;
    this.mode = MODE_VIEW;
    this.visible = true;
  }

  remove() {
    console.log(`removing ${JSON.stringify(this.address)}`);
    store.dispatch(addressbookActions.address.delete.command(this.address.id, this.address.etag, userFeedback.deleteItem()));
    this.close();
  }


  _getAddressFromForm() {
    return {
      countryCode: this.renderRoot.querySelector('#countryCode').value,
      city: this.renderRoot.querySelector('#city').value,
      postalCode: this.renderRoot.querySelector('#postalCode').value,
      street: this.renderRoot.querySelector('#street').value,
      houseNumber: this.renderRoot.querySelector('#houseNumber').value
    };
  }

  save() {
    const newAddress = this._getAddressFromForm();
    console.log(`saving ${JSON.stringify(newAddress)}`);
    store.dispatch(addressbookActions.address.create.command(newAddress, userFeedback.createItem()));
    this.close();
  }

  _renderIdAndEtag() {
    if (this.mode === MODE_ADD) {
      return html``;
    }
    const { id, etag} = this.address;
    return html`
        <kor-input label="ID" value="${id}"></kor-input>
        <kor-input label="Entity tag" value="${etag}"></kor-input>
    `;
  }

  _renderDetails() {
    const { countryCode, city, postalCode, street, houseNumber, id, etag} = this.address;
    return html`
      <kor-input label="Country code" id="countryCode" value="${countryCode}"></kor-input>
      <kor-input label="City" id="city" value="${city}"></kor-input>
      <kor-input label="Postal code" id="postalCode" value="${postalCode}"></kor-input>
      <kor-input label="Street" id="street" value="${street}"></kor-input>
      <kor-input label="Housenumber" id="houseNumber" value="${houseNumber}"></kor-input>
      ${this._renderIdAndEtag()}
    `;
  }

  _renderButtons() {
    if (this.mode === MODE_VIEW) {
      return html`<kor-button slot="footer" color="secondary" icon="delete" @click="${this.remove}"></kor-button>`;
    }
    if (this.mode === MODE_ADD) {
      return html`<kor-button slot="footer" color="secondary" icon="save" @click="${this.save}"></kor-button>`;
    }
    return html``;
  }

  render() {
    return html`
      <kor-modal id="inner-modal" label="Address" height="500px" ?visible=${this.visible}>
        ${this._renderDetails()}
        ${this._renderButtons()}
        <kor-button slot="footer" color="secondary" label="Close" @click="${this.close}"></kor-button>
      </kor-modal>
    `;
  }
}
AddressEditDialog.properties = {
  visible: {type: Boolean},
  address: {type: Object},
  mode: {type: String}
};
customElements.define('address-edit-dialog', AddressEditDialog);
