import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import Picker from 'rmc-picker';
const cx = classnames.bind(style);
import 'rmc-picker/assets/index.css';

export default class Header extends React.Component {
  static propTypes = {
    betValue: PropTypes.number.isRequired,
    isShow: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    betValue: 1,
    isShow: false,
  }

  render() {
    const {
      betValue,
      isShow,
      onChange,
      onClose,
    } = this.props;

    return (
      <div className={cx('container', { show: isShow })}>
        <div className={cx('wrapper')}>
          <div className={cx('bet-value')}>
            <span>當前單注金額 {betValue} EOS</span>
            <a onClick={onClose}>完成</a>
          </div>

          <Picker 
            selectedValue={betValue} 
            className={cx('picker')} 
            indicatorClassName={cx('indicator')}
            onValueChange={onChange}
          >
            <Picker.Item className={cx('picker-item')} value={0.1}>0.1</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.2}>0.2</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.3}>0.3</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.4}>0.4</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.5}>0.5</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.6}>0.6</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.7}>0.7</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.8}>0.8</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={0.9}>0.9</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={1}>1</Picker.Item>
          </Picker>
        </div>
      </div>
    );
  }
}