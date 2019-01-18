import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import BetField from '../BetField';
import Punch from '../Punch';
import GameBoardBottom from '../GameBoardBottom';
const cx = classnames.bind(style);

export default class GameBoard extends React.Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
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
  }

  render() {
    const {
      games, 
      selectedIndex,
      isDisableClean,
      isDisableRandom,
      isAllSelected,
      onSelect,
      onScissorPunch,
      onStonePunch,
      onPaperPunch,
      onReset,
      onRandom,
    } = this.props;

    const game = games[selectedIndex];
    const playerPunch = game ? game.player : '';

    return (
      <div className={cx('container')}>
        <div className={cx('wrapper')}>
          {
            games.map((game, idx) => (
              <BetField 
                key={idx} 
                index={ idx }
                player={game.player}
                banker={game.banker}
                result={game.result}
                prise={game.prise}
                isFocus={ selectedIndex === idx } 
                onSelect={onSelect}
              />
            ))
          }

          <Punch punchType="scissor" isSelected={ playerPunch === 'scissor' } hasValue={ playerPunch !== '' || isAllSelected }  onClick={onScissorPunch} />
          <Punch punchType="stone" isSelected={ playerPunch === 'stone' } hasValue={ playerPunch !== '' || isAllSelected } onClick={onStonePunch} />
          <Punch punchType="paper" isSelected={ playerPunch === 'paper' } hasValue={ playerPunch !== '' || isAllSelected } onClick={onPaperPunch} />

          <span className={cx('player')}></span>
          <span className={cx('banker')}></span>
        </div>
        { false && <GameBoardBottom 
          onReset={onReset} 
          onRandom={onRandom} 
          isDisableRandom={isDisableRandom}
          isDisableClean={isDisableClean} />}
      </div>
    )
  }
}