import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Footer extends React.Component {
  static propTypes = {
    onAutoBiddingClick: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onPickerClick: PropTypes.func.isRequired,
    betValue: PropTypes.string.isRequired,
    isAutoBiddingChecked: PropTypes.bool.isRequired,
    isCheckable: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    betValue: 0.1,
    isCheckable: false,
  }

  handleConfirm = e => {
    const {
      isCheckable,
      onConfirm,
    } = this.props;

    isCheckable && onConfirm && onConfirm(e);
  }

  render() {
    const { 
      betValue, 
      isAutoBiddingChecked,
      isCheckable,
      onAutoBiddingClick,
      onPickerClick,
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('menu-wrapper')}>
          <a 
            className={cx('auto-bidding', { 'checked': isAutoBiddingChecked })}
            onClick={onAutoBiddingClick}
            onTouchStart={()=>{}}
          >
            自動下注
          </a>

          <div className={cx('bidding-value-field')} onClick={onPickerClick}>
            <span className={cx('title')}>單注金額：</span>
            <span className={cx('field-block')}>
              <span className={cx('bidding-value')}>
                { betValue }
              </span>
              <span className={cx('unit-text')}>
                EOS
              </span>
            </span>
            <a className={cx('drop-down')}></a>
          </div>
        </div>

        <a 
          className={cx('confirm', { 'checkable': isCheckable })}
          onClick={this.handleConfirm}
        >
          <span className={cx('title')}>
            出拳
          </span>
        </a>
      </div>
    )
  }
}
