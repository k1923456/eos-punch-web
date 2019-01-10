import React from 'react';
import classnames from 'classnames/bind';
import style from './style.scss';
import Jackpot from '../Jackpot';
import Settlement from '../Settlement';
import GameBoard from '../GameBoard';
const cx = classnames.bind(style);

export default class Panel extends React.Component {
  render() {
    return (
      <div className={cx('container')}>
        <Jackpot />
        <Settlement />
        <GameBoard />
      </div>
    )
  }
}