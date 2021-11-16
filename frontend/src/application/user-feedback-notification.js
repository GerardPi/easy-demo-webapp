import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers';
import store from '../redux/store';
import commonSelectors from '../redux/common/selectors';
import commonActions from '../redux/common/actions';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/modal';
import '@kor-ui/kor/components/notifications';
import * as userFeedback from '../redux/user-feedback';

export class UserFeedbackNotification extends connect(store)(LitElement) {
  constructor() {
    super();
    this.transientUserFeedback = [];
    this.allUserFeedback = [];
  }
  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state) {
    const newTransientUserFeedback = commonSelectors.userFeedback.transient(state);
    const isTransientFeedbackChanged = this.transientUserFeedback !== newTransientUserFeedback;
    if (isTransientFeedbackChanged) {
      this.transientUserFeedback = newTransientUserFeedback;
      const fbIds = this.transientUserFeedback.map(fb => fb.feedbackId);
      store.dispatch(commonActions.transientUserFeedback.deleteLater(fbIds));
    }
    return this.requestUpdate();
  }

  close() {
    this._innerModal.visible = false;
  }

  okButtonClicked() {
    this.close();
  }

  cancelButtonClicked() {
    this.close();
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  renderNotificationItem(fb) {
    const icon = fb.success ? 'info' : 'report_problem'; // https://fonts.google.com/icons?selected=Material+Icons
    return html`
        <kor-notification-item icon="${icon}" label="Notification" visible sticky>
          ${fb.text}
        </kor-notification-item>`;
  }

  renderNotificationItems() {
    return this.transientUserFeedback.map(fb => this.renderNotificationItem(fb));
  }

  render() {
    return html`
      <kor-notifications position="bottom-right">
        ${this.renderNotificationItems()}
      </kor-notifications>
    `;
  }
}

UserFeedbackNotification.properties = {
    transientUserFeedback: { type: Array},
    allUserFeedback: { type: Array}
};

customElements.define('user-feedback-notification', UserFeedbackNotification);
