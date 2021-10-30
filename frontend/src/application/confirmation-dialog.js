import {LitElement, html} from 'lit';
import { connect } from 'pwa-helpers';
import store from '../redux/store';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/modal';

export class ConfirmationDialog extends connect(store)(LitElement) {
  constructor() {
    super();
    this.label = 'no label';
    this.text = 'no text';
    this.action = null;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    this._innerModal.visible = false;
  }

  open(label, text, action) {
    this.label = label;
    this.text = text;
    this.action = action;
    this._innerModal.visible = true;
  }

  okButtonClicked() {
    store.dispatch(this.action);
    this.action = null;
    this.close();
  }

  cancelButtonClicked() {
    this.action = null;
    this.close();
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  render() {
    return html`
      <kor-modal id="inner-modal" label="${this.label}" sticky height="500px">
        <slot></slot>
        ${this.text}
        <kor-button slot="footer" color="secondary" label="Cancel" @click="${this.cancelButtonClicked}"></kor-button>
        <kor-button slot="footer" color="secondary" label="Ok" @click="${this.okButtonClicked}"></kor-button>
      </kor-modal>
    `;
  }
}

ConfirmationDialog.properties = {
  label: {type: String},
  text: {type: String},
  action: {type: Object}
};

customElements.define('confirmation-dialog', ConfirmationDialog);
