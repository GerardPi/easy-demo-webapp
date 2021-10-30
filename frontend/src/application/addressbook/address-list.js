import {LitElement, html, css} from 'lit';
import { connect } from 'pwa-helpers';
import store from '../../redux/store';
import addressListStyle from './style';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import * as commonUtils from '../../common-utils';
import { ADDRESS_COLUMNS} from './columns';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/spinner';
import '@kor-ui/kor/components/modal';
import '@kor-ui/kor/components/checkbox';
import '@kor-ui/kor/components/input';
import './address-dialog';

export class AddressList extends connect(store)(LitElement) {

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
              .filter(column => column.hidden !== true)
              .map((column) => html`<kor-table-cell head title=${column.tooltip}>
                  ${column.name}
              </kor-table-cell>`)}
       </kor-table-row>
    `;
  }

  renderColumn(row, path) {
    return html`<kor-table-cell>${row[path]}</kor-table-cell>`;
  }

  renderColumns(row, columns) {
    return columns
        .filter(column => column.hidden !== true)
        .map(column => this.renderColumn(row, column.path));
  }

  _rowClicked(event, row) {
    this._addressDialog.openForView(row);
  }

  _addButtonClicked() {
    this._addressDialog.openForAddition();
  }

  get _addressDialog() {
    return this.renderRoot.querySelector('address-dialog');
  }

  renderBody(rows, columns) {
    if (commonUtils.isNotNullOrEmpty(rows)) {
      return rows.map((row) => html`<kor-table-row @click=${(e) => this._rowClicked(e, row)}>${this.renderColumns(row, columns)}</kor-table-row>`);
    }
    if (this.inProgress) {
      return html`<kor-table-row><kor-table-cell grid-cols="7" alignment="center"><kor-spinner label="Loading..."></kor-spinner></kor-table-cell></kor-table-row>`;
    }
    return html`<kor-table-row><kor-table-cell>no data</kor-table-cell></kor-table-row>`;
  }

  refreshButtonClicked() {
    this.refreshTable();
  }
  render() {
    return html`
      <kor-card icon="house" label="Addresses">
        <kor-button slot="functions" @click=${this.refreshButtonClicked} icon="refresh" color="secondary" title="Refresh"></kor-button>
        <kor-button slot="functions" @click=${this._addButtonClicked} icon="add" color="secondary" title="Add"></kor-button>
        <kor-table condensed columns="repeat(${this.columns.length - 2}, 1fr)">
          ${this.renderHeader(this.columns)}
          ${this.renderBody(this.items, this.columns)}
        <kor-table>
      </kor-card>
    <address-dialog></address-dialog>
    `;
  }
}

AddressList.properties = {
    title: {type: String},
    columns: { type: Array},
    items: {type: Array},
    inProgress: {type: Boolean}
};

customElements.define('address-list', AddressList);
