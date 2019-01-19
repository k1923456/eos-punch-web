import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class GameBoard extends React.Component {
  static propTypes = {
    isDisableClean: PropTypes.bool,
    isDisableRandom: PropTypes.bool,
    onReset: PropTypes.func.isRequired,
    onRandom: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
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
      intl,
    } = this.props;

    return (
      <div className={cx('game-board-bottom')}>
        <a
          className={cx('clean', { 'disable': isDisableClean })}
          onClick={this.handleClean}
        >
          { intl.formatMessage({ id: 'panel.reset'}) }
        </a>
        <a
          className={cx('random', { 'disable': isDisableRandom })}
          onClick={this.handleRandom}
        >
          { intl.formatMessage({ id: 'panel.random'}) }
        </a>
      </div>
    )
  }
}

export default injectIntl(GameBoard);
