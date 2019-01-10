import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class RevealBoard extends React.Component {
  static propTypes = {
    settlement: PropTypes.object,
    isRevealed: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    settlement: {
      bets: [
        {
          player: 'scissor',
          banker: 'stone',
          result: 'lose',
          value: '-0.1'
        },
        {
          player: 'scissor',
          banker: 'stone',
          result: 'lose',
          value: '-0.1'
        },
        {
          player: 'scissor',
          banker: 'stone',
          result: 'lose',
          value: '-0.1'
        },
        {
          player: 'scissor',
          banker: 'stone',
          result: 'lose',
          value: '-0.1'
        },
        {
          player: 'scissor',
          banker: 'stone',
          result: 'lose',
          value: '-0.1'
        },
      ],
      total: '+0.08',
    },
    isRevealed: false,
  }

  render() {
    const { settlement, isRevealed, onConfirm, } = this.props;
    return (
      <div className={cx('container', { reveal: isRevealed })}>
        <div className={cx('wrapper')}>
          <h1 className={cx('headline')}>本局結算</h1>
          <div className={cx('title')}>
            <span className={cx('index')}>注別</span>
            <span className={cx('player')}>你的</span>
            <span className={cx('banker')}>莊的</span>
            <span className={cx('result')}>輸贏</span>
          </div>

          {
            settlement.bets.map((bet, idx) => (
              <div key={idx} className={cx('bet', {
                win: bet.result === 'win', 
                lose: bet.result === 'lose', 
                draw: bet.result === 'draw'
              })}>
                <span className={cx('index')}>注{idx + 1}</span>
                <span className={cx('player', bet.player)}></span>
                <span className={cx('banker', bet.banker)}></span>
                <span className={cx('result')}>
                  <span className={cx('result-icon')}>
                    莊贏
                  </span>
                  +0.08
                </span>
              </div>
            ))
          }

          <div className={cx('total-settlement')}>
            <span className={cx('icon')}>總結算</span>
            <div className={cx('total-bet')}>
              <span>+0.208</span>
              <span className={cx('unit')}>EOS</span>
            </div>
          </div>
          <div className={cx('buttons')}>
            <a className={cx('confirm')} onClick={onConfirm}>確定</a>
          </div>
        </div>
      </div>
    )
  }
}
