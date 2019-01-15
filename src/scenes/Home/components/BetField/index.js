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

  renderPlayerPunch = (player, result, isHesitation) => {
    if(isHesitation) {
      return <Hesitation />;
    }

    if(!isHesitation && !player) {
      return (<span>請選擇</span>);
    }

    switch (player) {
      case 'revealing':
        return (
          <span className={cx('mark', 'revealing')}></span>
        );
      case 'scissor':
      case 'paper':
      case 'stone':
        return (
          <span className={cx('mark', player, result, { reveal: !!result })}></span>
        );
      default:
          return null;
    }
  }

  render() {
    const {
      index,
      player,
      banker,
      prise,
      result,
      isFocus,
      onSelect,
    } = this.props;

    const isHesitation = isFocus && !player;
    const isSelected = player !== '' && player !== 'revealing';
    const reveal = !!result;
    const winMoney = result === 'win' || result === 'draw';

    return (
      <div className={cx('container')} onClick={onSelect(index)}>
        <span className={cx('title', { focus: isFocus })}>
          注{index + 1}
        </span>

        <div className={cx('field', { focus: isFocus, selected: isSelected, reveal, win: winMoney })}>
          <span className={cx('player')}>
            {
              this.renderPlayerPunch(player, result, isHesitation)
            }
          </span>

          <span className={cx('gap', { 'game-over': !!prise })}>
            {
              !!prise && false &&
              <span className={cx('point', result)}>
                { prise > 0 ? `+${prise}`: prise }
              </span>
            }
          </span>

          <span className={cx('banker')}>
            <span className={cx('mark', banker, {
              question: !banker,
              win: result === 'lose',
              lose: result === 'win',
              draw: result === 'draw',
              reveal,
            })}>
              {
                false && <Hesitation />
              }
            </span>
          </span>

          {
            !!prise && 
            <div className={cx('point-wrapper')}>
              <span className={cx('point', result)}>
                { prise > 0 ? `+${prise}`: prise }
              </span>
            </div>
          }


        </div>
      </div>
    )
  }
}
