import { LitElement, html } from 'lit';
import '@kor-ui/kor/components/input';

const EMPTY_ADDRESS = {};
const MODE_ADD = 'ADD';
const MODE_EDIT = 'EDIT';
const MODE_VIEW = 'VIEW';

export class AddressDetails extends LitElement {
  constructor() {
    super();
    this.address = EMPTY_ADDRESS;
    this.mode = MODE_VIEW;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  getAddressFromForm() {
    return {
      countryCode: this.renderRoot.querySelector('#countryCode').value,
      city: this.renderRoot.querySelector('#city').value,
      postalCode: this.renderRoot.querySelector('#postalCode').value,
      street: this.renderRoot.querySelector('#street').value,
      houseNumber: this.renderRoot.querySelector('#houseNumber').value,
    };
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

  render() {
    const { countryCode, city, postalCode, street, houseNumber, id, etag } =
      this.address;
    const readOnly = this.mode === MODE_VIEW;
    return html`
      <kor-input
        label="Country code"
        id="countryCode"
        ?readonly=${readOnly}
        value="${countryCode}"
      ></kor-input>
      <kor-input
        label="City"
        id="city"
        ?readonly=${readOnly}
        value="${city}"
      ></kor-input>
      <kor-input
        label="Postal code"
        id="postalCode"
        ?readonly=${readOnly}
        value="${postalCode}"
      ></kor-input>
      <kor-input
        label="Street"
        id="street"
        ?readonly=${readOnly}
        value="${street}"
      ></kor-input>
      <kor-input
        label="Housenumber"
        id="houseNumber"
        ?readonly=${readOnly}
        value="${houseNumber}"
      ></kor-input>
      ${this._renderIdAndEtag(readOnly)}
    `;
  }
}

AddressDetails.properties = {
  address: { type: Object },
  mode: { type: String },
};
customElements.define('address-details', AddressDetails);
