import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames/bind';
import style from './style.scss';
const cx = classnames.bind(style);

export default class Loading extends React.Component {
  render() {
    return ReactDOM.createPortal(
      <div className={cx('container')}>
        LOADING
      </div>
    , document.querySelector('#modal'));
  }
}
