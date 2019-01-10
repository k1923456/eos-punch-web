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
    games: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    isGameOver: PropTypes.bool,
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onSelect: PropTypes.func,
    onScissorPunch: PropTypes.func,
    onStonePunch: PropTypes.func,
    onPaperPunch: PropTypes.func,
    onReset: PropTypes.func,
    onRandom: PropTypes.func,
  }

  static defaultProps = {
    selectedIndex: 0,
    isGameOver: false,
  }

  render() {
    const {
      games, 
      selectedIndex,
      isGameOver,
      isDisableClean,
      isDisableRandom,
      onSelect,
      onScissorPunch,
      onStonePunch,
      onPaperPunch,
      onReset,
      onRandom,
    } = this.props;

    return (
      <div className={cx('container')}>
        <Jackpot />
        <Settlement />
        <GameBoard 
          games={games} 
          selectedIndex={selectedIndex} 
          isGameOver={isGameOver}
          isDisableClean={isDisableClean}
          isDisableRandom={isDisableRandom}
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