import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import BetField from '../BetField';
import Punch from '../Punch';
import GameBoardBottom from '../GameBoardBottom';
const cx = classnames.bind(style);

export default class GameBoard extends React.Component {
  render() {
    return (
      <div className={cx('container')}>
        <div className={cx('wrapper')}>
          <BetField />
          <BetField />
          <BetField />
          <BetField />
          <BetField />

          <Punch punchType="scissor" />
          <Punch punchType="stone" />
          <Punch punchType="paper" />

          <span className={cx('player')}></span>
          <span className={cx('banker')}></span>
        </div>
        <GameBoardBottom />
      </div>
    )
  }
}