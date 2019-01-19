import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import GameBoardBottom from '../GameBoardBottom';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class Footer extends React.Component {
  static propTypes = {
    betValue: PropTypes.number.isRequired,
    isAutoBettingChecked: PropTypes.bool.isRequired,
    isConfirmButtonClickable: PropTypes.bool,
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onAutoBettingClick: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onPickerClick: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    onRandom: PropTypes.func,
    intl: intlShape.isRequired,
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
      isAutoBettingChecked,
      isConfirmButtonClickable,
      isDisableClean,
      isDisableRandom,
      onAutoBettingClick,
      onPickerClick,
      onReset,
      onRandom,
      intl,
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('menu-wrapper')}>
          <a 
            className={cx('auto-betting', { 'checked': isAutoBettingChecked })}
            onClick={onAutoBettingClick}
            onTouchStart={()=>{}}
          >
             { intl.formatMessage({ id: 'footer.auto-bet'}) }
          </a>

          <div className={cx('betting-value-field')} onClick={onPickerClick}>
            <span className={cx('title')}>
              { intl.formatMessage({ id: 'footer.bet-value'}) }：
            </span>
            <span className={cx('field-block')}>
              <span className={cx('betting-value')}>
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
              { intl.formatMessage({ id: 'footer.confirm'}) }
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

export default injectIntl(Footer);
