import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import style from './style.scss';
import Picker from 'rmc-picker';
const cx = classnames.bind(style);
import 'rmc-picker/assets/index.css';

export default class Header extends React.Component {
  static propTypes = {
    betValue: PropTypes.string.isRequired,
    isShow: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    betValue: '5',
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
            <Picker.Item className={cx('picker-item')} value={'1'}>1</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'2'}>2</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'3'}>3</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'4'}>4</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'5'}>5</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'6'}>6</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'7'}>7</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'8'}>8</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'9'}>9</Picker.Item>
            <Picker.Item className={cx('picker-item')} value={'10'}>10</Picker.Item>
          </Picker>
        </div>
      </div>
    );
  }
}