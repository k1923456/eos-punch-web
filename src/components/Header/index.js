import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Header extends React.Component {
  static propTypes = {
    onInfoClick: PropTypes.func.isRequired,
  }

  leaveButton = React.createRef();
  infoButton = React.createRef();

  handleLeave = e => {
    e.preventDefault();
    const leaveEvent = new Event('leaveEOSPunch', {});
    document.dispatchEvent(leaveEvent);
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
    return (
      <div className={cx('container')}>
        <div className={cx('wrapper')}>
          <a className={cx('button', 'leave')}
            ref={el => this.leaveButton = el}
            onClick={this.handleLeave}
            onTouchStart={()=>{}}
          >
            離開
          </a>

          <a className={cx('button', 'info')}
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
