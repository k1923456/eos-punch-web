import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import Hesitation from '../Hesitation';
const cx = classnames.bind(style);

export default class BetField extends React.Component {
  static propTypes = {
    user: PropTypes.number.isRequired,
    computer: PropTypes.number.isRequired,
    prise: PropTypes.string.isRequired,
    isFocus: PropTypes.bool.isRequired,
    isUserWin: PropTypes.bool.isRequired,
    isReveal: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    user: -1,
    computer: -1,
    prise: '-0.1',
    isUserWin: false,
    isFocus: false,
    isReveal: false,
  }

  render() {
    const { user, computer, prise, isFocus, isUserWin, isReveal, } = this.props;
    return (
      <div className={cx('container')}>
        <span className={cx('title')}>
          註1
        </span>
        <div className={cx('field', { focus: isFocus, selected: user !== -1, reveal: isReveal, win: isUserWin })}>
          <span className={cx('user')}>
            {false && <Hesitation />}
            {user === -1 && <span>請選擇</span>}
            {user !== -1 &&
              <span className={cx('mark', {
                scissor: user === 1,
                stone: user === 2,
                paper: user === 3,
                win: isUserWin,
                lose: !isUserWin,
              })}
              >
              </span>
            }
          </span>

          <span className={cx('gap')}>
            {isReveal &&
              <span className={cx('point', {
                win: isUserWin,
                lose: !isUserWin,
              })}>
                {prise}
              </span>
            }
          </span>

          <span className={cx('computer')}>
            <span className={cx('mark', {
              scissor: computer === 1,
              stone: computer === 2,
              paper: computer === 3,
              win: !isUserWin,
              lose: isUserWin,
            })}
            >
            </span>
          </span>
        </div>
      </div>
    )
  }
}
