import {LitElement, html} from 'lit';
import personListStyle from './style';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import * as commonUtils from '../../common-utils';
import { PERSON_COLUMNS} from './columns';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/table';
import '@kor-ui/kor/components/card';

export class PersonList extends connect(store)(LitElement) {

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
      personListStyle
    ];
  }

  constructor() {
   super();
   this.title = '';
   this.columns = PERSON_COLUMNS;
   this.items = [];
   this.inProgress = false;
  }

  stateChanged(state) {
    this.items = addressbookSelectors.person.list.items(state);
    this.inProgress = addressbookSelectors.person.list.inProgress(state);
    return this.requestUpdate();
  }

  connectedCallback() {
    this.refreshTable();
    super.connectedCallback();
  }

  refreshTable() {
    store.dispatch(addressbookActions.person.readList.command());
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

  renderBody(rows, columns) {
    if (commonUtils.isNotNullOrEmpty(rows)) {
      return rows
        .map((row) => html`<kor-table-row>${this.renderColumns(row, columns)}</kor-table-row>`);
    }

    if (this.inProgress) {
      return html`<kor-table-row><kor-table-cell><img src="assets/loader-bar.gif" title="loading..."></kor-table-cell></kor-table-row>`;
    }

    return html`<kor-table-row><kor-table-cell>no data</kor-table-cell></kor-table-row>`;
  }
  refreshButtonClicked() {
    this.refreshTable();
  }
  render() {
    return html`
    <kor-card icon="person" label="Persons">
      <kor-button @click=${this.refreshButtonClicked} label="Reload"></kor-button>
      <kor-table condensed columns="repeat(${this.columns.length - 2}, 1fr)">
        ${this.renderHeader(this.columns)}
        ${this.renderBody(this.items, this.columns)}
      <kor-table>
    </kor-card>
    `;
  }
}
customElements.define('person-list', PersonList);
