import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class GameBoard extends React.Component {
  static propTypes = {
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onCleanClick: PropTypes.func.isRequired,
    onRandomClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isDisableClean: false,
    isDisableRandom: false,
  }

  handleClean = e => {
    const {
      isDisableClean,
      onCleanClick,
    } = this.props;

    isDisableClean === false && onCleanClick && onCleanClick(e);
  }

  handleRandom = e => {
    const {
      isDisableRandom,
      onRandomClick,
    } = this.props;

    isDisableRandom === false && onRandomClick && onRandomClick(e);
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
