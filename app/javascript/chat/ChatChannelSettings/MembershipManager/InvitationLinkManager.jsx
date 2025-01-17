/* global Runtime */

import { h, Component } from 'preact';
import PropTypes from 'prop-types';

import { Button } from '@crayons';

function isClipboardSupported() {
  return (
    typeof navigator.clipboard !== 'undefined' && navigator.clipboard !== null
  );
}

const CopyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="crayons-icon copy-icon"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="fc5f15add1e114844f5e"
  >
    <title id="fc5f15add1e114844f5e">Copy Invitation Url</title>
    <path d="M7 6V3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1 1 0 013 21l.003-14c0-.552.45-1 1.007-1H7zm2 0h8v10h2V4H9v2zm-2 5v2h6v-2H7zm0 4v2h6v-2H7z" />
  </svg>
);

export default class InvitationLinkManager extends Component {
  static propTypes = {
    invitationLink: PropTypes.string.isRequired,
    currentMembership: PropTypes.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      invitationLink: props.invitationLink,
      showImageCopiedMessage: false,
      currentMembership: props.currentMembership,
    };
  }

  copyText = () => {
    this.imageMarkdownInput = document.getElementById(
      'chat-channel-unviation-url',
    );

    if (Runtime.isNativeAndroid('copyToClipboard')) {
      AndroidBridge.copyToClipboard(this.imageMarkdownInput.value);
      this.setState({ showImageCopiedMessage: true });
    } else if (isClipboardSupported()) {
      navigator.clipboard
        .writeText(this.imageMarkdownInput.value)
        .then(() => {
          this.setState({ showImageCopiedMessage: true });
        })
        .catch((_err) => {
          this.execCopyText();
        });
    } else {
      this.execCopyText();
    }
  };

  execCopyText() {
    this.imageMarkdownInput.setSelectionRange(
      0,
      this.imageMarkdownInput.value.length,
    );
    document.execCommand('copy');
    this.setState({ showImageCopiedMessage: true });
  }

  render() {
    const {
      showImageCopiedMessage,
      invitationLink,
      currentMembership,
    } = this.state;

    if (currentMembership.role !== 'mod') {
      return null;
    }

    return (
      <div className="p-4 grid gap-2 crayons-card my-4 invitation-section">
        <h3 className="text-center title">Invitation Link</h3>
        <clipboard-copy
          onClick={this.copyText}
          for="chat-channel-unviation-url"
          aria-live="polite"
          className="flex items-center flex-1"
          aria-controls="image-markdown-copy-link-announcer"
        >
          <input
            type="text"
            className="crayons-textfield mr-2"
            id="chat-channel-unviation-url"
            readOnly="true"
            value={invitationLink}
            aria-label="invitation-link"
          />
          <Button
            className="spec__image-markdown-copy"
            variant="ghost"
            contentType="icon"
            icon={CopyIcon}
          />
          <span
            id="image-markdown-copy-link-announcer"
            role="alert"
            className={`fs-s ${showImageCopiedMessage ? '' : 'opacity-0'}`}
          >
            Copied!
          </span>
        </clipboard-copy>
      </div>
    );
  }
}
