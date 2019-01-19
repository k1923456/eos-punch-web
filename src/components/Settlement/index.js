import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class Settlement extends React.PureComponent {
  refWin = React.createRef();
  refLose = React.createRef();
  refDraw = React.createRef();
  refPrise = React.createRef();
  reward = React.createRef();

  static propTypes = {
    winCount: PropTypes.number.isRequired,
    loseCount: PropTypes.number.isRequired,
    drawCount: PropTypes.number.isRequired,
    totalPrise: PropTypes.number.isRequired,
    winPrise: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
  }

  componentDidMount() {
    const {
      winCount,
      loseCount,
      drawCount,
      totalPrise,
    } = this.props;
    this.setOdometer(this.refWin, winCount);
    this.setOdometer(this.refLose, loseCount);
    this.setOdometer(this.refDraw, drawCount);
    this.setOdometer(this.refPrise, totalPrise);
  }

  componentDidUpdate() {
    const {
      winCount,
      loseCount,
      drawCount,
      totalPrise,
    } = this.props;
    
    this.updateOdometer(this.refWin, winCount);
    this.updateOdometer(this.refLose, loseCount);
    this.updateOdometer(this.refDraw, drawCount);
    this.updateOdometer(this.refPrise, totalPrise);
    this.reward.classList.add(cx('show'));

    setTimeout(() => {
      this.reward.classList.remove(cx('show'));
    }, 1000);
  }

  setOdometer = (el, value) => {
    new window.Odometer({
      el,
      value,
      format: '(,ddd).dd',
      theme: 'default'
    });
  }

  updateOdometer = (el, value) => {
    el.innerHTML = value;
  }

  render() {
    const { 
      winPrise,
      intl, 
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('point-wrapper')}>
          <div className={cx('field', 'win')}>
            <span className={cx('title')}>{ intl.formatMessage({ id: 'panel.settlement.win'}) }</span>
            <span className={cx('count')}>
              <span ref={ el => this.refWin = el }></span>
            </span>
          </div>
          <div className={cx('field', 'draw')}>
            <span className={cx('title')}>{ intl.formatMessage({ id: 'panel.settlement.draw'}) }</span>
            <span className={cx('count')}>
              <span ref={ el => this.refDraw = el }></span>
            </span>
          </div>
          <div className={cx('field', 'lost')}>
            <span className={cx('title')}>{ intl.formatMessage({ id: 'panel.settlement.lose'}) }</span>
            <span className={cx('count')}>
              <span ref={ el => this.refLose = el }></span>
            </span>
          </div>
        </div>
        <div className={cx('prise-wrapper')}>
          <span className={cx('title')}>
            淨利獎金
          </span>
          <span className={cx('prise-number')}>
            <span ref={ el => this.refPrise = el }>0.0</span>
            <span className={cx('reward-animation')} ref={ el => this.reward = el }>{ winPrise > 0 ? `+${winPrise}` : winPrise }</span>
          </span>
          <span className={cx('unit-text')}>
            EOS
          </span>
        </div>
      </div>
    )
  }
}

export default injectIntl(Settlement);
