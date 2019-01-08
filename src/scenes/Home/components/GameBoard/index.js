import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import BetField from '../BetField';
const cx = classnames.bind(style);

export default class GameBoard extends React.Component {
  static propTypes = {
    onCleanClick: PropTypes.func.isRequired,
    onRandomClick: PropTypes.func.isRequired,
  }

  render() {
    const {
      onCleanClick,
      onRandomClick,
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('bet-wrapper')}>
          <BetField />
          <BetField />
          <BetField />
          <BetField />
          <BetField />
          <a className={cx('scissor')}></a>
          <a className={cx('stone')}></a>
          <a className={cx('paper')}></a>
        </div>
        <div className={cx('functions-wrapper')}>
          <a
            className={cx('clean', { 'disable': true })}
            onClick={onCleanClick}
          >
            清空
          </a>
          <a
            className={cx('random', { 'disable': true })}
            onClick={onRandomClick}
          >
            隨機
          </a>
        </div>
      </div>
    )
  }
}
