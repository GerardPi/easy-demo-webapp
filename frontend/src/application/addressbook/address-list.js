import {LitElement, html} from 'lit';
import addressListStyle from './style';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import * as userInfo from '../../redux/info-for-user';
import * as commonUtils from '../../common-utils';
import { ADDRESS_COLUMNS} from './columns';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/spinner';
import '@kor-ui/kor/components/modal';

export class AddressList extends connect(store)(LitElement) {

  static get properties() {
    return {
      title: {type: String},
      columns: { type: Array},
      items: {type: Array},
      inProgress: {type: Boolean}
    }
  }
  static get styles() {
    return [
      addressListStyle
    ];
  }

  constructor() {
   super();
   this.title = '';
   this.columns = ADDRESS_COLUMNS;
   this.items = [];
   this.inProgress = false;
  }

  stateChanged(state) {
    this.items = addressbookSelectors.address.list.items(state);
    this.inProgress = addressbookSelectors.address.list.inProgress(state);
    return this.requestUpdate();
  }

  connectedCallback() {
    this.refreshTable();
    super.connectedCallback();
  }

  refreshTable() {
    store.dispatch(addressbookActions.address.readList.command());
  }

  renderHeader(columns) {
    return html`
       <kor-table-row slot="header">
          ${columns
              .filter(column => this._mustRender(column.path))
              .map((column) => html`<kor-table-cell>${column.name}</kor-table-cell>`)}
       </kor-table-row>
    `;
  }

  _mustRender(columnPath) {
    return 'id' !== columnPath && 'etag' !== columnPath;
  }

  renderColumn(row, path) {
    return html`<kor-table-cell>${path}: ${row[path]}</kor-table-cell>`;
  }

  renderColumns(row, columns) {
    return columns
        .filter(column => this._mustRender(column.path))
        .map(column => this.renderColumn(row, column.path));
  }

  _rowClicked(event, row) {
    console.log(`## _rowClicked row=${JSON.stringify(row)}`);
//    this.renderRoot.querySelector('#address-details-modal').visible = true;
    this._addressDetailsModal.visible = true;
  }

  get _addressDetailsModal() {
    return this.renderRoot.querySelector('#address-details-modal');
  }

  _hideAddressDetailsModal() {
    console.log(`## hide...`);
    this._addressDetailsModal.visible = false;
  }

  renderBody(rows, columns) {
    if (commonUtils.isNotNullOrEmpty(rows)) {
      return rows
        .map((row) => html`<kor-table-row @click=${(e) => this._rowClicked(e, row)}>${this.renderColumns(row, columns)}</kor-table-row>`);
    } else if (this.inProgress) {
      return html`<kor-table-row><kor-table-cell grid-cols="7" alignment="center"><kor-spinner label="Loading..."></kor-spinner></kor-table-cell></kor-table-row>`;
    } else {
      return html`<kor-table-row><kor-table-cell>no data</kor-table-cell></kor-table-row>`;
    }
  }

  refreshButtonClicked() {
    this.refreshTable();
  }
  render() {
    return html`
    <kor-card icon="house" label="Addresses">
      <kor-button @click=${this.refreshButtonClicked} label="Reload"></kor-button>
      <kor-table condensed columns="repeat(${this.columns.length - 2}, 1fr)">
        ${this.renderHeader(this.columns)}
        ${this.renderBody(this.items, this.columns)}
      <kor-table>
    </kor-card>

    <kor-modal id="address-details-modal" label="Address" visible>
      <kor-button slot="footer" color="secondary" label="Close" @click=${(e) => this._hideAddressDetailsModal()}></kor-button>
    </kor-modal>
    `;
  }

  renderAddressDetails(address) {
    return html`
      <kor-table condensed columns="2">
        <kor-table-row>
            <kor-table-cell>Country code</kor-table-cell><kor-table-cell>${address.countryCode}</kor-table-cell>
        </kor-table-row>
        <kor-table-row>
            <kor-table-cell>City</kor-table-cell><kor-table-cell>${address.city}</kor-table-cell>
        </kor-table-row>
        <kor-table-row>
            <kor-table-cell>Postalcode</kor-table-cell><kor-table-cell>${address.postalCode}</kor-table-cell>
        </kor-table-row>
        <kor-table-row>
            <kor-table-cell>Street</kor-table-cell><kor-table-cell>${address.street}</kor-table-cell>
        </kor-table-row>
        <kor-table-row>
            <kor-table-cell>House number</kor-table-cell><kor-table-cell>${address.houseNumber}</kor-table-cell>
        </kor-table-row>
      </kor-table>`;
  }
}
customElements.define('address-list', AddressList);
