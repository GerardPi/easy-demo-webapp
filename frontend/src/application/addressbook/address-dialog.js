import { LitElement, html } from 'lit';
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
import '@kor-ui/kor/components/popover';
import '../confirmation-dialog';
import './address-details';

const EMPTY_ADDRESS = {};
export const MODE_ADD = 'ADD';
export const MODE_EDIT = 'EDIT';
export const MODE_VIEW = 'VIEW';

export class AddressDialog extends connect(store)(LitElement) {
  constructor() {
    super();
    this.open = false;
    this.address = EMPTY_ADDRESS;
    this.mode = MODE_VIEW;
    this.visible = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    this.address = EMPTY_ADDRESS;
    this._innerModal.visible = false;
  }

  openForAddition() {
    this.address = {};
    this.mode = MODE_ADD;
    this.requestUpdate();
    this._innerModal.visible = true;
  }

  openForEdit(address) {
    this.address = address;
    this.mode = MODE_EDIT;
    this._innerModal.visible = true;
  }

  openForView(address) {
    this.address = address;
    this.mode = MODE_VIEW;
    this._innerModal.visible = true;
  }

  _delete() {
    const deleteActions = [
      addressbookActions.address.delete.command(
        this.address.id,
        this.address.etag,
        userFeedback.deleteItem()
      ),
    ];
    this._deletionAddressDetails.address = this.address;
    this._deletionConfirmationDialog.open(
      'Are you sure?',
      'Confirm that you want to delete this address',
      deleteActions
    );
    this.close();
  }

  _save() {
    const newAddress = this._addressDetails.getAddressFromForm();
    console.log(`saving ${JSON.stringify(newAddress)}`);
    store.dispatch(
      addressbookActions.address.create.command(
        newAddress,
        userFeedback.createItem()
      )
    );
    this.close();
  }

  _renderIdAndEtag() {
    if (this.mode === MODE_ADD) {
      return html``;
    }
    const { id, etag } = this.address;
    return html`
      <kor-input label="ID" readonly value="${id}"></kor-input>
      <kor-input label="Entity tag" readonly value="${etag}"></kor-input>
    `;
  }

  _renderButtons() {
    if (this.mode === MODE_VIEW) {
      return html`<kor-button
        slot="footer"
        color="secondary"
        label="Delete"
        @click="${this._delete}"
      ></kor-button>`;
    }
    if (this.mode === MODE_ADD) {
      return html`<kor-button
        slot="footer"
        color="secondary"
        label="Submit"
        @click="${this._save}"
      ></kor-button>`;
    }
    return html``;
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }
  get _deletionConfirmationDialog() {
    return this.renderRoot.querySelector('#deletion-confirmation-dialog');
  }

  get _deletionAddressDetails() {
    return this.renderRoot.querySelector('#deletion-address-details');
  }

  get _addressDetails() {
    return this.renderRoot.querySelector('#address-details');
  }

  _renderDeletionConfirmationDialog() {
    if (this.mode === MODE_VIEW) {
      return html`
        <confirmation-dialog
          id="deletion-confirmation-dialog"
          label="Are you sure"
          text="You want to delete this address?"
        >
          <address-details
            id="deletion-address-details"
            .mode=${MODE_VIEW}
          ></address-details>
        </confirmation-dialog>
      `;
    }
    return html``;
  }

  render() {
    const { countryCode, city, postalCode, street, houseNumber, id, etag } =
      this.address;
    const readOnly = this.mode === MODE_VIEW;
    const sticky = this.mode !== MODE_VIEW; // Allow dialog to be closed by clicking next to it.
    return html`
      <kor-modal
        id="inner-modal"
        label="Address"
        height="500px"
        ?sticky=${sticky}
      >
        <address-details
          id="address-details"
          .address=${this.address}
          .mode=${this.mode}
        ></address-details>
        ${this._renderButtons()}
        <kor-button
          slot="footer"
          color="secondary"
          label="Close"
          @click="${this.close}"
        ></kor-button>
      </kor-modal>
      ${this._renderDeletionConfirmationDialog()}
    `;
  }
}

AddressDialog.properties = {
  address: { type: Object },
  mode: { type: String },
};
customElements.define('address-dialog', AddressDialog);
