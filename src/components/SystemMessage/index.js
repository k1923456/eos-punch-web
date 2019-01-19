import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
const cx = classnames.bind(style);

export class SystemMessage extends React.Component {
  static propTypes = {
    isAutoBetting: PropTypes.bool,
    isRevealing: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    isAutoBetting: false,
    isRevealing: false,
  }

  render() {
    const {
      isAutoBetting,
      isRevealing,
      intl,
    } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('message', { alert: isAutoBetting, warning: isRevealing })}>
          { isAutoBetting && <span>{ intl.formatMessage({ id: 'system.auto-betting'}) }</span>}
          { isRevealing && <span>{ intl.formatMessage({ id: 'system.revealing'}) }</span>}
        </div>
      </div>
    )
  }
}

export default injectIntl(SystemMessage);
