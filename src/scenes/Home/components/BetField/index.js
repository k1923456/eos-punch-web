import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import Hesitation from '../Hesitation';
const cx = classnames.bind(style);

export default class BetField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    player: PropTypes.string.isRequired,
    banker: PropTypes.string.isRequired,
    prise: PropTypes.number.isRequired,
    result: PropTypes.string.isRequired,
    isFocus: PropTypes.bool.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    isRevealing: PropTypes.bool.isRequired,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    index: 1,
    player: '',
    banker: '',
    prise: 0,
    result: '',
    isFocus: false,
    isGameOver: false,
  }

  render() {
    const {
      index,
      player,
      banker,
      prise,
      result,
      isFocus,
      isGameOver,
      isRevealing,
      onSelect,
    } = this.props;

    const isHesitation = isFocus && !player;
    const isBankerCalculating = isRevealing && isFocus && !banker;
    const isSelected = player !== '';

    return (
      <div className={cx('container')} onClick={onSelect(index)}>
        <span className={cx('title')}>
          註{index + 1}
        </span>

        <div className={cx('field', { focus: isFocus, selected: isSelected, reveal: isGameOver, win: result === 'win' })}>
          <span className={cx('player')}>
            {
              isHesitation && <Hesitation />
            }
            {!isHesitation && !player && <span>請選擇</span>}
            {
              player &&
              <span className={cx('mark', player, result, { reveal: isGameOver })}></span>
            }
          </span>


          <span className={cx('gap')}>
            {
              isGameOver &&
              <span className={cx('point', result)}>
                { prise > 0 ? `+${prise}`: prise }
              </span>
            }
          </span>

          <span className={cx('banker')}>
            <span className={cx('mark', banker, {
              question: !isBankerCalculating,
              win: result === 'lose',
              lose: result === 'win',
              draw: result === 'draw',
              reveal: isGameOver
            })}>
              {
                isBankerCalculating && <Hesitation />
              }
            </span>
          </span>
        </div>
      </div>
    )
  }
}
