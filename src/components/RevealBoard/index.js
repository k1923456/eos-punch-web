import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import * as MathHelper from 'services/MathHelper';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class RevealBoard extends React.PureComponent {
  test = React.createRef();

  static propTypes = {
    round: PropTypes.array,
    isRevealed: PropTypes.bool,
    isAutoBettingChecked: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    isRevealed: false,
  }

  state = {
    seconds: 3,
  }

  componentDidMount() {
    this.countdown = setInterval(() => {
      const { seconds: lastSeconds, } = this.state;
      const seconds = lastSeconds - 1;
      this.setState({
        seconds,
      });
    }, 1000);

    this.confirmCountDown = setTimeout(() => {
      this.handleConfirm();
    }, 4600);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
    clearTimeout(this.confirmCountDown);
    clearTimeout(this.confirmDelay);
  }

  handleConfirm = () => {
    this.revealBoard.classList.add(cx('move-out'));
    this.confirmDelay = setTimeout(this.props.onConfirm, 700);
  }

  handleCancel = () => {
    this.revealBoard.classList.add(cx('move-out'));
    this.confirmDelay = setTimeout(this.props.onCancel, 700);
  }

  renderPrise(prise) {
    return prise / 10000;
  }

  render() {
    const { seconds, } = this.state;
    const { 
      round,
      isRevealed,
      isAutoBettingChecked,
      intl,
    } = this.props;
    const totalPrise = round.reduce((acc, cur) => acc + cur.prise, 0) / 10000;

    return (
      <div ref={ el => this.revealBoard = el } className={cx('reveal-board', { reveal: isRevealed })}>
        <div className={cx('wrapper')}>
          <h1 className={cx('headline')}>{ intl.formatMessage({ id: 'reveal.headline'}) }</h1>
          <div className={cx('title')}>
            <span className={cx('index')}>{ intl.formatMessage({ id: 'reveal.title.index'}) }</span>
            <span className={cx('player')}>{ intl.formatMessage({ id: 'reveal.title.player'}) }</span>
            <span className={cx('banker')}>{ intl.formatMessage({ id: 'reveal.title.banker'}) }</span>
            <span className={cx('result')}>{ intl.formatMessage({ id: 'reveal.title.result'}) }</span>
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
                      bet.result === 'win' ? intl.formatMessage({ id: 'reveal.result.win'}) :
                      bet.result === 'lose' ? intl.formatMessage({ id: 'reveal.result.lose'}) : intl.formatMessage({ id: 'reveal.result.draw'})
                    }
                  </span>
                  { bet.prise > 0 ? `+${this.renderPrise(bet.prise)}` : `${this.renderPrise(bet.prise)}` }
                </span>
              </div>
            ))
          }

          <div className={cx('total-settlement')}>
            <span className={cx('icon')}>{intl.formatMessage({ id: 'reveal.result.total'})}</span>
            <div className={cx('total-bet')}>
              <span>
                { totalPrise > 0 ? `+${totalPrise}` : `${totalPrise}` }
              </span>
              <span className={cx('unit')}>EOS</span>
            </div>
          </div>
          <div className={cx('buttons')}>
            <a className={cx('confirm')} onClick={this.handleConfirm}>{`${intl.formatMessage({ id: 'reveal.result.confirm'})} ${seconds < 0 ? '0' : seconds}s`}</a>
            { isAutoBettingChecked && <a className={cx('cancel-auto')} onClick={this.handleCancel}>{ intl.formatMessage({ id: 'reveal.result.cancel'}) }</a> }
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(RevealBoard);
