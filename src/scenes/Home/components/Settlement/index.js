import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Settlement extends React.Component {
  render() {
    return (
      <div className={cx('container')}>
        <div className={cx('point-wrapper')}>
          <div className={cx('field', 'win')}>
            <span className={cx('title')}>勝</span>
            <span className={cx('count')}>0</span>
          </div>
          <div className={cx('field', 'draw')}>
            <span className={cx('title')}>平</span>
            <span className={cx('count')}>0</span>
          </div>
          <div className={cx('field', 'lost')}>
            <span className={cx('title')}>輸</span>
            <span className={cx('count')}>0</span>
          </div>
        </div>
        <div className={cx('prise-wrapper')}>
          <span className={cx('title')}>
            淨利獎金
          </span>
          <span className={cx('jackpot-number')}>
            99
          </span>
          <span className={cx('unit-text')}>
            EOS
          </span>
        </div>
      </div>
    )
  }
}
