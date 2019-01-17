import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class RevealBoard extends React.Component {
  test = React.createRef();

  static propTypes = {
    round: PropTypes.array,
    isRevealed: PropTypes.bool,
    isAutoBiddingChecked: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isRevealed: false,
  }

  state = {
    seconds: 3,
  }

  componentDidUpdate() {
    const { isRevealed, } = this.props;

    if(isRevealed) {
      if(this.countdown) {
        return;
      }
      this.countdown = setInterval(() => {
        const { seconds: lastSeconds, } = this.state;
        const seconds = lastSeconds - 1;
        this.setState({
          seconds,
        }, () => {

          /**
           * FIXME: this component's state control is suck, should refactor
           */
          if(seconds <= 0) {
            this.handleConfirm();
          }
        });
      }, 1000);
    }
  }

  handleConfirm = () => {
    clearInterval(this.countdown);
    this.countdown = null;
    this.props.onConfirm();
    setTimeout(()=>{
      this.setState({
        seconds: 3,
      });
    }, 1000);
  }

  handleCancel = () => {
    clearInterval(this.countdown);
    this.countdown = null;
    this.props.onCancel();
    setTimeout(()=>{
      this.setState({
        seconds: 3,
      });
    }, 1000);
  }

  render() {
    const { seconds, } = this.state;
    const { round, isRevealed, isAutoBiddingChecked, } = this.props;
    const totalPrise = round.reduce((acc, cur) => {
      const prise = Math.floor((acc + cur.prise) * 100) / 100;
      return Number(prise);
    }, 0);

    return (
      <div ref={ el => this.test = el } className={cx('reveal-board', { reveal: isRevealed })}>
        <div className={cx('wrapper')}>
          <h1 className={cx('headline')}>本局結算</h1>
          <div className={cx('title')}>
            <span className={cx('index')}>注別</span>
            <span className={cx('player')}>你的</span>
            <span className={cx('banker')}>莊的</span>
            <span className={cx('result')}>輸贏</span>
          </div>

          {
            round.map((bet, idx) => (
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
                    {
                      bet.result === 'win' ? '閒贏' :
                      bet.result === 'lose' ? '莊贏' : '平局'
                    }
                  </span>
                  { bet.prise > 0 ? `+${bet.prise}` : `${bet.prise}` }
                </span>
              </div>
            ))
          }

          <div className={cx('total-settlement')}>
            <span className={cx('icon')}>總結算</span>
            <div className={cx('total-bet')}>
              <span>
                { totalPrise > 0 ? `+${totalPrise}` : `${totalPrise}` }
              </span>
              <span className={cx('unit')}>EOS</span>
            </div>
          </div>
          <div className={cx('buttons')}>
            <a className={cx('confirm')} onClick={this.handleConfirm}>{`確定 ${seconds}s`}</a>
            { isAutoBiddingChecked && <a className={cx('cancel-auto')} onClick={this.handleCancel}>取消自動下注</a> }
          </div>
        </div>
      </div>
    )
  }
}
