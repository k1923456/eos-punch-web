import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class HowToPlay extends React.Component {
  static propTypes = {
    isAutoBidding: PropTypes.bool,
    isRevealing: PropTypes.bool,
  }

  static defaultProps = {
    isAutoBidding: false,
    isRevealing: false,
  }

  render() {
    const {
      isAutoBidding,
      isRevealing,
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('message', { alert: isAutoBidding, warning: isRevealing })}>
          { isAutoBidding && <span>自動下注中</span>}
          { isRevealing && <span>開獎中</span>}
        </div>
      </div>
    )
  }
}
