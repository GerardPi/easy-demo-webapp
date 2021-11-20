import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers';
import store from '../../redux/store';
import addressListStyle from './style';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import * as commonUtils from '../../common-utils';
import { ADDRESS_COLUMNS } from './columns';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';
import '@kor-ui/kor/components/spinner';
import '@kor-ui/kor/components/modal';
import '@kor-ui/kor/components/checkbox';
import '@kor-ui/kor/components/input';
import './address-dialog';
import * as userFeedback from '../../redux/user-feedback';

export class AddressList extends connect(store)(LitElement) {
  static get styles() {
    return [addressListStyle];
  }

  constructor() {
    super();
    this.title = '';
    this.items = [];
    this.inProgress = false;
    this.multiSelect = true;
    this.selectedIds = [];
    this.columns = ADDRESS_COLUMNS;
  }

  stateChanged(state) {
    this.items = addressbookSelectors.address.list.items(state);
    const existingIds = this.items.map(item => item.id);
    console.log(`## existingIds: ${JSON.stringify(existingIds)}`);
    console.log(`## selectedIds: ${JSON.stringify(this.selectedIds)}`);
    this.selectedIds = this.selectedIds.filter(selectedId =>
      existingIds.includes(selectedId)
    );
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
          .map(
            column => html`<kor-table-cell head title=${column.tooltip}>
              ${column.name}
            </kor-table-cell>`
          )}
      </kor-table-row>
    `;
  }

  renderColumn(row, path) {
    if (path === '_select') {
      if (this.multiSelect) {
        return html` <kor-table-cell>
          <kor-checkbox
            @click=${e => this._rowSelectToggled(e, row)}
          ></kor-checkbox>
        </kor-table-cell>`;
      }
      return html``;
    }
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

  _rowSelectToggled(e, row) {
    if (this.selectedIds.includes(row.id)) {
      this.selectedIds = this.selectedIds.filter(id => row.id !== id);
    } else {
      this.selectedIds.push(row.id);
    }
    console.log(
      `## _rowSelectToggled selectedIds=${JSON.stringify(this.selectedIds)}`
    );
    e.stopPropagation();
  }

  get _addressDialog() {
    return this.renderRoot.querySelector('address-dialog');
  }

  renderBody(rows, columns) {
    if (commonUtils.isNotNullOrEmpty(rows)) {
      return rows.map(
        row =>
          html`<kor-table-row @click=${e => this._rowClicked(e, row)}
            >${this.renderColumns(row, columns)}</kor-table-row
          >`
      );
    }
    if (this.inProgress) {
      return html`<kor-table-row>
        <kor-table-cell grid-cols="7" alignment="center">
          <kor-spinner label="Loading..."></kor-spinner>
        </kor-table-cell>
      </kor-table-row>`;
    }
    return html`<kor-table-row
      ><kor-table-cell>no data</kor-table-cell></kor-table-row
    >`;
  }

  refreshButtonClicked() {
    this.refreshTable();
  }

  _getItemForId(itemId) {
    const itemsForId = this.items.filter(item => item.id === itemId);
    return itemsForId[0];
  }

  _deleteButtonClicked() {
    const count = this.selectedIds.length;
    const deleteActions = this.selectedIds.map(id =>
      addressbookActions.address.delete.command(
        id,
        this._getItemForId(id).etag,
        userFeedback.deleteItem()
      )
    );
    this._bulkDeletionConfirmationDialog.open(
      'Are you sure?',
      `Confirm that you want to delete these selected ${count} addresses.`,
      deleteActions
    );
  }

  get _bulkDeletionConfirmationDialog() {
    return this.renderRoot.querySelector('#bulk-deletion-confirmation-dialog');
  }

  renderDeleteButton() {
    if (this.selectedIds.length > 0) {
      return html`
        <kor-button
          slot="functions"
          @click=${this._deleteButtonClicked}
          icon="delete"
          color="danger"
          title="Add"
        ></kor-button>
      `;
    }
    return html``;
  }

  render() {
    const columnCount = this.columns.length - 2 + (this.mutiSelect ? 1 : 0);
    return html`
      <kor-card icon="house" label="Addresses">
        <kor-button slot="functions" @click=${
          this.refreshButtonClicked
        } icon="refresh" color="secondary" title="Refresh"></kor-button>
        <kor-button slot="functions" @click=${
          this._addButtonClicked
        } icon="add" color="secondary" title="Add"></kor-button>
        ${this.renderDeleteButton()}
        <kor-table condensed columns="repeat(${columnCount}, 1fr)">
          ${this.renderHeader(this.columns)}
          ${this.renderBody(this.items, this.columns)}
        <kor-table>
      </kor-card>
    <address-dialog></address-dialog>
    <confirmation-dialog id="bulk-deletion-confirmation-dialog" label="Are you sure" text="message">
    </confirmation-dialog>
    `;
  }
}

AddressList.properties = {
  title: { type: String },
  columns: { type: Array },
  items: { type: Array },
  inProgress: { type: Boolean },
  selectedIds: { type: Array, reflect: true },
  multiSelect: { type: Boolean, reflect: true },
};

customElements.define('address-list', AddressList);
