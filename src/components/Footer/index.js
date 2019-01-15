import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import GameBoardBottom from 'scenes/Home/components/GameBoardBottom';
const cx = classnames.bind(style);

export default class Footer extends React.Component {
  static propTypes = {
    betValue: PropTypes.number.isRequired,
    isAutoBiddingChecked: PropTypes.bool.isRequired,
    isConfirmButtonClickable: PropTypes.bool,
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onAutoBiddingClick: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onPickerClick: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    onRandom: PropTypes.func,
  }

  static defaultProps = {
    betValue: 0.1,
    isConfirmButtonClickable: false,
  }

  handleConfirm = e => {
    const {
      isConfirmButtonClickable,
      onConfirm,
    } = this.props;

    isConfirmButtonClickable && onConfirm && onConfirm(e);
  }

  render() {
    const { 
      betValue, 
      isAutoBiddingChecked,
      isConfirmButtonClickable,
      isDisableClean,
      isDisableRandom,
      onAutoBiddingClick,
      onPickerClick,
      onReset,
      onRandom,
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


        <div className={cx('confirm-line')}>
          <a 
            className={cx('confirm', { 'checkable': isConfirmButtonClickable })}
            onClick={this.handleConfirm}
          >
            <span className={cx('title')}>
              出拳
            </span>
          </a>
        </div>

        <GameBoardBottom
          onReset={onReset} 
          onRandom={onRandom} 
          isDisableRandom={isDisableRandom}
          isDisableClean={isDisableClean}
        />

      </div>
    )
  }
}
