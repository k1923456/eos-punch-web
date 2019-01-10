import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Punch extends React.Component {
  static propTypes = {
    punchType: PropTypes.string,
    isSelected: PropTypes.bool,
    isDisable: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    punchType: 'scissor',
    isSelected: false,
    isDisable: false,
  }

  handleClick = e => {
    const {
      onClick,
      isDisable,
    } = this.props;

    isDisable === false && onClick && onClick(e);
  }

  render() {
    const { 
      punchType,
      isSelected,
      isDisable,
    } = this.props;

    return (
      <a 
        className={ cx('punch', punchType, { selected: isSelected, disable: isDisable }) }
        onClick={this.handleClick}
      >
        <span className={cx('border')}></span>
      </a>
    )
  }
}