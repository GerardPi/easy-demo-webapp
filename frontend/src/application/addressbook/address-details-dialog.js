import {LitElement, html} from 'lit';
import addressListStyle from './style';
import store from '../../redux/store';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import { connect } from 'pwa-helpers';
import * as userInfo from '../../redux/info-for-user';
import * as commonUtils from '../../common-utils';
import { ADDRESS_COLUMNS} from './columns';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/spinner';
import '@kor-ui/kor/components/modal';
import '@kor-ui/kor/components/input';

const EMPTY_ADDRESS = {};

export class AddressDetailsDialog extends connect(store)(LitElement) {

  static get properties() {
    return {
      address: {type: Object}
    }
  }

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
    store.dispatch(addressbookActions.address.delete.command(this.address.id, this.address.etag, userInfo.deleteItem()));
    this.close();
  }

  _renderDetails() {
      const address = this.address;
      return html`
          <kor-input label="Country code" value="${address.countryCode}" readonly></kor-input>
          <kor-input label="City" value="${address.city}" readonly></kor-input>
          <kor-input label="Postal code" value="${address.postalCode}" readonly></kor-input>
          <kor-input label="Street" value="${address.street}" readonly></kor-input>
          <kor-input label="Housenumber" value="${address.houseNumber}" readonly></kor-input>
          <kor-input label="ID" value="${address.id}" readonly></kor-input>
          <kor-input label="Entity tag" value="${address.etag}" readonly></kor-input>
          `;
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  render() {
    return html`
      <kor-modal id="inner-modal" label="Address" height="500px">
        ${this._renderDetails()}
        <kor-button slot="footer" color="secondary" icon="delete" @click="${(e) => this.remove()}"></kor-button>
        <kor-button slot="footer" color="secondary" label="Close" @click="${(e) => this.close()}"></kor-button>
      </kor-modal>
    `;
  }
}
customElements.define('address-details-dialog', AddressDetailsDialog);
