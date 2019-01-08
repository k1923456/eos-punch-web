import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Jackpot extends React.Component {
  static propTypes = {
    jackpot: PropTypes.string.isRequired,
  }

  static defaultProps = {
    jackpot: '999,999',
  }

  render() {
    const {
      jackpot,
    } = this.props;

    return (
      <div className={cx('container')}>
        <span className={cx('title')}>
          彩池獎金
        </span>
        <span className={cx('jackpot-number')}>
          { jackpot }
        </span>
        <span className={cx('unit-text')}>
          EOS
        </span>
      </div>
    )
  }
}
