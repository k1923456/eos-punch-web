import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Jackpot extends React.Component {
  numberScroll = React.createRef();

  static propTypes = {
    jackpot: PropTypes.number.isRequired,
  }

  static defaultProps = {
    jackpot: 0,
  }

  componentDidMount() {
    const { jackpot } = this.props;
    new window.Odometer({
      el: this.numberScroll,
      value: jackpot,
      format: '(,ddd).dd',
      theme: 'default'
    });
  }

  render() {
    return (
      <div className={cx('container')}>
        <span className={cx('title')}>
          彩池獎金
        </span>
        <span className={cx('jackpot-number')}><span ref={ el => this.numberScroll = el }></span></span>
        <span className={cx('unit-text')}>
          EOS
        </span>
      </div>
    )
  }
}
