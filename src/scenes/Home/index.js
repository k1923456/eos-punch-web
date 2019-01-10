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
import { 
  getNextBetFieldIndex, 
  getRandomPunch,
} from './services';

const cx = classnames.bind(style);
const JUNGLE_TEST_NET = {
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  httpEndpoint: 'https://jungle2.cryptolions.io:443',
};

export default class Home extends React.Component {
  state = {
    accountName: '',
    keyProvider: '',
    betValue: '1',
    games: [
      {
        id: 0,
        player: '',
        banker: '',
        result: '',
        prise: '',
      },
      {
        id: 1,
        player: '',
        banker: '',
        result: '',
        prise: '',
      },
      {
        id: 2,
        player: '',
        banker: '',
        result: '',
        prise: '',
      },
      {
        id: 3,
        player: '',
        banker: '',
        result: '',
        prise: '',
      },
      {
        id: 4,
        player: '',
        banker: '',
        result: '',
        prise: '',
      },
    ],
    selectedIndex: 0,                 // 游標選在第幾個賭注
    gameLogs: [],
    isLoading: true,
    isAllSelected: false,             // 五個選項皆已下注
    isAutoBiddingChecked: false,      // 勾選自動下注
    isAutoBidding: false,             // 系統自動下注中
    isRevealing: false,               // 開獎中
    isGameOver: false,                // 開獎完成，遊戲結束
    isRevealed: false,                // 當局結算
    isShowHowToPlay: false,
    isShowPicker: false,
  }

  componentDidMount() {
    // FIXME: for development, should be removed.
    window.setTimeout(() => {
      this.connect('jacky1234512', '5KUVCSKrLihT4LQPZwmENjYNeXo8ouhusB8D6LX7eifq6JFcM6Q');
    }, 500);
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

  handleCloseReveal = () => {
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

  handleBetFieldSelected = index => () => {
    this.setState({
      selectedIndex: index,
    });
  }

  handleScissorPunch = () => {
    this.handlePunch('scissor');
  }

  handleStonePunch = () => {
    this.handlePunch('stone');
  }

  handlePaperPunch = () => {
    this.handlePunch('paper');
  }

  handlePunch = (punchType, specifyIndex) => {
    const {
      games,
      selectedIndex,
    } = this.state;

    const newGames = games.map(game => Object.assign({}, game));
    newGames[specifyIndex || selectedIndex].player = punchType;

    const nextIndex = getNextBetFieldIndex(newGames);
    
    this.setState({
      games: newGames,
      selectedIndex: nextIndex !== -1 ? nextIndex : selectedIndex,
      isAllSelected: nextIndex === -1,
    });
  }

  handleReset = () => {
    const { games, } = this.state;
    const newGames = games.map((game, idx) => (
      {
        id: idx,
        player: '',
        banker: ',',
        result: '',
        prise: '',
      }
    ));

    this.setState({
      games: newGames,
      selectedIndex: 0,
      isAllSelected: false,
    });
  }

  handleRandom = specifyIndex => () => {
    const punch = getRandomPunch();
    this.handlePunch(punch, specifyIndex);
  }

  handleConfirm = () => {
    const {
      isAllSelected,
      isAutoBiddingChecked,
    } = this.state;

    if(isAllSelected) {
      alert('準備開獎');
      return;
    }

    this.setState({
      isAutoBidding: true,
    });

    const autoBidding = window.setInterval(()=> {
      if(this.state.isAllSelected) {
        clearInterval(autoBidding);
        alert('自動選擇完成');

        this.setState({
          isAutoBidding: false,
        });

        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.handleRandom(nextIndex)();
    }, 500);

    // const nextIndex = getNextBetFieldIndex(games);
  }

  render() {
    const {
      games,
      selectedIndex,
      betValue,
      isLoading,
      isAllSelected,
      isAutoBiddingChecked,
      isAutoBidding,
      isRevealing,
      isGameOver,
      isRevealed,
      isShowHowToPlay,
      isShowPicker,
    } = this.state;

    const isDisableClean = isAutoBidding || isRevealing || games.filter(game => game.player !== '').length === 0;
    const isDisableRandom = isAutoBidding || isRevealing;
    const isConfirmButtonClickable = (isAllSelected || isAutoBiddingChecked) && !isRevealing && !isAutoBidding;

    return (
      <div className={cx('container')}>
        <Header onInfoClick={this.handleToggleHowToPlay} />
        <Panel 
          games={games} 
          selectedIndex={selectedIndex} 
          isGameOver={isGameOver}
          isDisableClean={isDisableClean}
          isDisableRandom={isDisableRandom}
          onSelect={this.handleBetFieldSelected}
          onScissorPunch={this.handleScissorPunch}
          onStonePunch={this.handleStonePunch}
          onPaperPunch={this.handlePaperPunch}
          onReset={this.handleReset}
          onRandom={this.handleRandom()}
        />
        <Footer
          betValue={betValue}
          isAutoBiddingChecked={isAutoBiddingChecked}
          isConfirmButtonClickable={isConfirmButtonClickable}
          onAutoBiddingClick={this.handleToggleAutoBidding}
          onPickerClick={this.handleTogglePicker}
          onConfirm={this.handleConfirm}
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
          onConfirm={this.handleCloseReveal}
        />
        {
          isLoading && <Loading />
        }
      </div>
    )
  }
}
