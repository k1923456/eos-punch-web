import React from 'react';
import classnames from 'classnames/bind';
import style from './style.scss';
import Loading from 'components/Loading';
import * as EosHelper from 'services/EosHelper';
import Header from 'components/Header';
import Footer from 'components/Footer';
import HowToPlay from 'components/HowToPlay';
import SystemMessage from 'components/SystemMessage';
import RevealBoard from 'components/RevealBoard';
import Panel from './components/Panel';
import Picker from 'components/Picker';

const cx = classnames.bind(style);
const JUNGLE_TEST_NET = {
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  httpEndpoint: 'https://jungle2.cryptolions.io:443',
};

export default class Home extends React.Component {
  state = {
    accountName: '',
    keyProvider: '',
    betValue: '5',
    isAutoBiddingChecked: false,     // 是否勾選自動下注
    isAutoBidding: false,
    isRevealing: false,
    isLoading: true,
    isRevealed: false,
    isShowHowToPlay: false,
    isShowPicker: false,
  }

  connect = (accountName, keyProvider) => {
    this.setState({
      accountName,
      keyProvider,
      isLoading: false,
    }, () => {
      window.eos = EosHelper.createEosInstance(JUNGLE_TEST_NET.chainId, JUNGLE_TEST_NET.httpEndpoint, keyProvider, `${accountName}@active`);
    });
  }

  handleToggleHowToPlay = () => {
    this.setState({
      isShowHowToPlay: !this.state.isShowHowToPlay,
    });
  }

  handleToggleAutoBidding = () => {
    this.setState({
      isAutoBiddingChecked: !this.state.isAutoBiddingChecked,
    });
  }

  handleConfirmReveal = () => {
    this.setState({
      isRevealed: false,
    });
  }

  handleBetValueChange = betValue => {
    this.setState({
      betValue,
    });
  }

  handleTogglePicker = () => {
    this.setState({
      isShowPicker: !this.state.isShowPicker,
    });
  }

  render() {
    const {
      betValue,
      isAutoBiddingChecked,
      isAutoBidding,
      isRevealing,
      isLoading,
      isRevealed,
      isShowHowToPlay,
      isShowPicker,
    } = this.state;

    return (
      <div className={cx('container')}>
        <Header onInfoClick={this.handleToggleHowToPlay} />
        <Panel />
        <Footer
          betValue={betValue}
          isAutoBiddingChecked={isAutoBiddingChecked}
          onAutoBiddingClick={this.handleToggleAutoBidding}
          onPickerClick={this.handleTogglePicker}
        />
        {
          isShowHowToPlay &&
          <HowToPlay onClose={this.handleToggleHowToPlay} />
        }
        {
          (isAutoBidding || isRevealing) &&
          <SystemMessage 
            isAutoBidding={isAutoBidding} 
            isRevealing={isRevealing} 
          />
        }
        <Picker
          isShow={isShowPicker}
          betValue={betValue}
          onChange={this.handleBetValueChange}
          onClose={this.handleTogglePicker}
        />
        <RevealBoard
          isRevealed={isRevealed}
          onConfirm={this.handleConfirmReveal}
        />
        {
          isLoading && <Loading />
        }
      </div>
    )
  }
}
