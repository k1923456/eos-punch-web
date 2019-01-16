import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class ErrorMessage extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    errorMessage: '',
  }

  componentDidMount() {
    const { onClose, } = this.props;
    this.closeErrorMessage = setTimeout(onClose, 3000);
  }

  render() {
    const { errorMessage, } = this.props;

    return (
      <div className={cx('error-message-container')}>
        <div className={cx('wrapper')}>
          {
            errorMessage || '帳戶 CPU 不足'
          }
        </div>
      </div>
    )
  }
}
