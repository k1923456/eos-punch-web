import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Punch extends React.Component {
  punchRef = React.createRef();

  static propTypes = {
    punchType: PropTypes.string,
    hasValue: PropTypes.bool,
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

  componentDidMount() {
    const { punchType, } = this.props;
    const animation = `shine${punchType}`;
    this.shine(animation, punchType);
  }

  componentDidUpdate() {
    const { hasValue, punchType, } = this.props;
    const animation = `shine${punchType}`;

    if(hasValue) {
      clearInterval(this[animation]);
      this[animation] = null;
    } else {
      this.shine(animation, punchType);
    }
  }

  shine = (animation, punchType) => {
    if(this[animation]) {
      return;
    }

    this[animation] = window.setInterval(async () => {
      await this.wait(this.getTime(punchType));
      this.punchRef.classList.add('shine');
      await this.wait(100);
      this.punchRef.classList.remove('shine');
    }, 500);
  }

  wait = (ms) => {
    return new Promise(r => setTimeout(r, ms));
  }

  getTime = (punchType) => {
    switch(punchType) {
      case 'scissor':
        return 0;
      case 'stone':
        return 200;
      case 'paper':
      default:
        return 300;
    }
  }

  render() {
    const { 
      punchType,
      isSelected,
      isDisable,
    } = this.props;

    return (
      <a 
        className={ cx('punch', punchType, { selected: isSelected, disable: isDisable, hesitation: !isSelected && false }) }
        onClick={this.handleClick}
        ref={ el => this.punchRef = el }
      >
        <span className={cx('border')}></span>
      </a>
    )
  }
}