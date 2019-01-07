import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Header extends React.Component {
  static propTypes = {
    onLeaveClick: PropTypes.func.isRequired,
    onInfoClick: PropTypes.func.isRequired,
  }

  leaveButton = React.createRef();
  infoButton = React.createRef();

  handleLeave = () => {
    const { onLeaveClick, } = this.props;

    this.leaveButton.classList.add('active-button');
    setTimeout(()=> {
      this.leaveButton.classList.remove('active-button');
    }, 200);

    onLeaveClick && onLeaveClick();
  }

  handleInfo = () => {
    const { onInfoClick, } = this.props;
    this.infoButton.classList.add('active-button');
    setTimeout(()=> {
      this.infoButton.classList.remove('active-button');
    }, 200);

    onInfoClick && onInfoClick();
  }

  render() {
    return (
      <div className={cx('container')}>
        <div className={cx('items')}>
          <a className={cx('leave-button')}
            ref={el => this.leaveButton = el}
            onClick={this.handleLeave} >
          </a>
          <span className={cx('leave-text')}
            onClick={this.handleLeave}>
            離開
          </span>
        </div>
        <div className={cx('items', 'center')}>
          <img className={cx('logo')} src="../../assets/images/header-logo.svg" />
        </div>
        <div className={cx('items', 'right')}>
          <a className={cx('info')}
            ref={el => this.infoButton = el}
            onClick={this.handleInfo} >
          </a>
        </div>
      </div>
    )
  }
}
