import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class HowToPlay extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { onClose, } = this.props;
    return (
      <div className={cx('container')}>
        <div className={cx('content')}>
          <div className={cx('logo')}></div>
          <h1 className={cx('headline')}>怎麼玩?</h1>
          <p>
            BOY tokens grant you dividend payouts based on EOSGAMEBOY profit.
            100% of profit is distributed to BOY token holders, so the more BOY you have, the more EOS you get!
          </p>
          <p>
            Currently, we are airdropping BOY tokens at rate of 1:20 for out lucky bettors.
            This means that for every wins in RPS games you will receive minimum 1:1, maximum 1:20 BOY token.
            These tokens grant you dividends for life, and there is a fixed supply of 1,000,000,000 tokens in existence.
          </p>
          <a 
            className={cx('btn-close')} 
            onClick={onClose}
          ></a>
        </div>
      </div>
    )
  }
}
