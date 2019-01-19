import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class Header extends React.Component {
  static propTypes = {
    onInfoClick: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  }

  leaveButton = React.createRef();
  infoButton = React.createRef();

  handleLeave = e => {
    e.preventDefault();
    const leaveEvent = new Event('leaveEOSPunch', {});
    document.dispatchEvent(leaveEvent);
    
    window.EosJavascriptInterface && this.androidLeave();
    window.webkit && this.iosLeave();
  }

  androidLeave = () => {
    window.EosJavascriptInterface.postMessage('leaveEOSPunch');
  }

  iosLeave = () => {
    window.webkit.messageHandlers.EosJavascriptInterface.postMessage('leaveEOSPunch');
  }

  handleInfo = () => {
    const { onInfoClick, } = this.props;
    this.infoButton.classList.add('active-button');
    setTimeout(() => {
      this.infoButton.classList.remove('active-button');
    }, 200);

    onInfoClick && onInfoClick();
  }

  render() {
    const { intl, } = this.props;
    
    return (
      <div className={cx('container')}>
        <div className={cx('wrapper')}>
          <a className={cx('leave-button')}
            ref={el => this.leaveButton = el}
            onClick={this.handleLeave}
            onTouchStart={()=>{}}
          >
            { intl.formatMessage({ id: 'header.leave'}) }
          </a>
          
          <a className={cx('info-button')}
            ref={ el => this.infoButton = el }
            onClick={this.handleInfo}
            onTouchStart={()=>{}}
          >
          </a>

          <a className={cx('logo')}></a>
        </div>
      </div>
    )
  }
}

export default injectIntl(Header);
