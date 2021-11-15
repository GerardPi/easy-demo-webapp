import { LitElement, html } from 'lit';
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
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _filterTransientUserFeedback(userFeedbackArray) {
    return userFeedbackArray.filter(fb => fb.notificationArrangement === userFeedback.NOTIFICATION_TYPES.transient);
  }

  stateChanged(state) {
    console.log(`## state has changed`);
    this.transientUserFeedback = this._filterTransientUserFeedback(commonSelectors.userFeedback(state));
    const fbIds = this.transientUserFeedback.map(fb => fb.feedbackId);
    store.dispatch(commonActions.transientUserFeedback.deleteLater(fbIds));
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
    return html`
        <kor-notification-item label="Some other notification" visible sticky>
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
};

customElements.define('user-feedback-notification', UserFeedbackNotification);
