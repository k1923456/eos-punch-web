import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Footer extends React.Component {
  static propTypes = {
    onAutoBiddingClick: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onBiddingValueChange: PropTypes.func.isRequired,
    biddingValue: PropTypes.number.isRequired,
    isAutoBiddingChecked: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    biddingValue: 0.1,
  }

  render() {
    const { 
      biddingValue, 
      isAutoBiddingChecked,
      onConfirm, 
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('menu')}>
          <a 
            className={cx('btn-auto-bidding', { 'checked': isAutoBiddingChecked })}
            onTouchStart={()=>{}}
          >
            <span>自動下注</span>
          </a>

          <div className={cx('bidding-value-field')}>
            <span className={cx('title')}>單注金額：</span>
            <span className={cx('field-block')}>
              <span className={cx('bidding-value')}>
                { biddingValue }
              </span>
              <span className={cx('unit-text')}>
                EOS
              </span>
            </span>
            <a className={cx('drop-down')}></a>
          </div>
        </div>

        <a 
          className={cx('confirm', { 'checkable': true })}
          onClick={onConfirm}
        >
          <span className={cx('title')}>
            出拳
          </span>
        </a>
      </div>
    )
  }
}
