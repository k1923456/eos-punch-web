import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import Jackpot from '../Jackpot';
import Settlement from '../Settlement';
import GameBoard from '../GameBoard';
const cx = classnames.bind(style);

export default class Panel extends React.Component {
  static propTypes = {
    jackpot: PropTypes.number.isRequired,
    winCount: PropTypes.number.isRequired,
    loseCount: PropTypes.number.isRequired,
    drawCount: PropTypes.number.isRequired,
    totalPrise: PropTypes.number.isRequired,
    games: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    isGameOver: PropTypes.bool,
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    isRevealing: PropTypes.bool,
    onSelect: PropTypes.func,
    onScissorPunch: PropTypes.func,
    onStonePunch: PropTypes.func,
    onPaperPunch: PropTypes.func,
    onReset: PropTypes.func,
    onRandom: PropTypes.func,
  }

  render() {
    const {
      jackpot,
      totalPrise,
      winCount,
      loseCount,
      drawCount,
      games, 
      selectedIndex,
      isGameOver,
      isDisableClean,
      isDisableRandom,
      isRevealing,
      onSelect,
      onScissorPunch,
      onStonePunch,
      onPaperPunch,
      onReset,
      onRandom,
    } = this.props;

    return (
      <div className={cx('container')}>
        <Jackpot jackpot={jackpot} />
        <Settlement 
          winCount={winCount} 
          loseCount={loseCount} 
          drawCount={drawCount} 
          totalPrise={totalPrise} 
        />
        <GameBoard 
          games={games} 
          selectedIndex={selectedIndex} 
          isGameOver={isGameOver}
          isDisableClean={isDisableClean}
          isDisableRandom={isDisableRandom}
          isRevealing={isRevealing}
          onSelect={onSelect}
          onScissorPunch={onScissorPunch}
          onStonePunch={onStonePunch}
          onPaperPunch={onPaperPunch}
          onReset={onReset}
          onRandom={onRandom}
        />
      </div>
    )
  }
}