import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class GameBoard extends React.Component {
  static propTypes = {
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onRandom: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isDisableClean: false,
    isDisableRandom: false,
  }

  handleClean = e => {
    const {
      isDisableClean,
      onReset,
    } = this.props;

    isDisableClean === false && onReset && onReset(e);
  }

  handleRandom = e => {
    const {
      isDisableRandom,
      onRandom,
    } = this.props;

    isDisableRandom === false && onRandom && onRandom(e);
  }

  render() {
    const {
      isDisableClean,
      isDisableRandom,
    } = this.props;

    return (
      <div className={cx('functions-wrapper')}>
        <a
          className={cx('clean', { 'disable': isDisableClean })}
          onClick={this.handleClean}
        >
          清空
        </a>
        <a
          className={cx('random', { 'disable': isDisableRandom })}
          onClick={this.handleRandom}
        >
          隨機
        </a>
      </div>
    )
  }
}
