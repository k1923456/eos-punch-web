import React from 'react';
import classnames from 'classnames/bind';
import style from './style.scss';
import Loading from 'components/Loading';
import Header from 'components/Header';
import Footer from 'components/Footer';
import HowToPlay from 'components/HowToPlay';
import SystemMessage from 'components/SystemMessage';
import RevealBoard from 'components/RevealBoard';
import Panel from './components/Panel';
import Picker from 'components/Picker';
import * as EosHelper from 'services/EosHelper';
import {
  getNextBetFieldIndex,
  getRandomPunch,
  translatePunches,
  transformGameRecords,
} from './services';
import {
  apiBetPunch,
  apiFetchGameRecords,
} from 'services/ContractAPIs';


const cx = classnames.bind(style);
const JUNGLE_TEST_NET = {
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  httpEndpoint: 'https://jungle2.cryptolions.io:443',
};

export default class Home extends React.Component {
  state = {
    accountName: '',
    keyProvider: '',
    betValue: 1,
    games: [
      {
        id: 0,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 1,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 2,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 3,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 4,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      },
    ],
    selectedIndex: 0,                 // 游標選在第幾個賭注
    gameLogs: [],
    jackpot: 999.99,
    winCount: 0,
    loseCount: 0,
    drawCount: 0,
    totalPrise: 0,
    animationWinPrise: 0,
    isLoading: true,
    isAllSelected: false,             // 五個選項皆已下注
    isBankerPunchDone: false,         // 莊家出完拳
    isAutoBiddingChecked: false,      // 勾選自動下注   TODO: isAutoBiddingChecked use the wrong word, should be fixed to isAutoBettingChecked
    isAutoBidding: false,             // 系統自動下注中 TODO: isAutoBidding use the wrong word, should be fixed to isAutoBetting
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
    const {
      games,
      winCount: loseWinCount,
      loseCount: lastLoseCount,
      drawCount: lastDrawCount,
      totalPrise: lastTotalPrise,
    } = this.state;

    const winCount = loseWinCount + games.filter(x => x.result === 'win').length;
    const loseCount = lastLoseCount + games.filter(x => x.result === 'lose').length;
    const drawCount = lastDrawCount + games.filter(x => x.result === 'draw').length;
    const animationWinPrise = games.reduce((acc, cur) => Math.floor((acc + cur.prise) * 10) / 10, 0);
    const totalPrise =lastTotalPrise + animationWinPrise;

    this.handleReset();
    this.setState({
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      animationWinPrise,
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

  handlePunch = (punchType, specifyIndex, role = 'player') => {
    const {
      games,
      selectedIndex,
    } = this.state;

    if(!specifyIndex && selectedIndex === -1) {
      return;
    }

    const newGames = games.map(game => Object.assign({}, game));
    newGames[specifyIndex || selectedIndex][role] = punchType;

    const nextIndex = getNextBetFieldIndex(newGames, role);

    const stateFlag = role === 'player' ? 'isAllSelected' : 'isBankerPunchDone';

    this.setState({
      games: newGames,
      selectedIndex: nextIndex,
      [stateFlag]: nextIndex === -1,
    });
  }

  handleReset = () => {
    const { games, } = this.state;
    const newGames = games.map((game, idx) => (
      {
        id: idx,
        player: '',
        banker: '',
        result: '',
        prise: 0,
      }
    ));

    this.setState({
      games: newGames,
      selectedIndex: 0,
      isGameOver: false,
      isAllSelected: false,
      isBankerPunchDone: false,
      isRevealed: false,
    });
  }

  handleRandom = (specifyIndex) => () => {
    const punch = getRandomPunch();
    this.handlePunch(punch, specifyIndex);
  }

  // 出拳按鈕
  handleConfirm = () => {
    if (this.state.isAllSelected) {
      this.handleReveal();
      return;
    }
    this.handleAutoBetting();
  }

  // 自動投注
  handleAutoBetting = () => {
    this.setState({
      isAutoBidding: true,
    });

    const autoBetting = window.setInterval(() => {
      if (this.state.isAllSelected) {
        clearInterval(autoBetting);
        this.handleReveal();
        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.handleRandom(nextIndex)();
    }, 500);
  }

  // 開獎
  handleReveal = () => {
    const {
      accountName,
      betValue,
      games,
    } = this.state;

    this.setState({
      isAutoBidding: false,
      isRevealing: true,
      selectedIndex: 0,
    });

    const punches = games.sort((a, b) => a.id - b.id).map(game => game.player).join(','); // sort player punches in ascending by id
    const totalBetValue = betValue * 5;
    const memo = translatePunches('api', punches);
    // const punchTransaction = apiBetPunch(window.eos, accountName, totalBetValue, memo);
    // const gameRecords = apiFetchGameRecords(window.eos);
    const gameResult = transformGameRecords('', punches, betValue);  //transformGameRecords(gameRecords);

    (async () => {
      for (let index = 0; index < gameResult.round.length; index++) {
        const t = games.slice();
        t[index].banker = gameResult.round[index].banker;
        t[index].result = gameResult.round[index].result;
        t[index].prise = gameResult.round[index].prise;

        const selectedIndex = index + 1;
        this.setState({
          games: t,
          selectedIndex,
        });

        await new Promise(r => window.setTimeout(r, 500));
      }

      this.stepGameOver();
    })();
  }

  stepGameOver = async () => {
    await new Promise(r => window.setTimeout(r, 1000));

    this.setState({
      isGameOver: true,
    }, this.stepReveal);
  }

  stepReveal = async () => {
    await new Promise(r => window.setTimeout(r, 3000));

    this.setState({
      isRevealed: true,
      isRevealing: false,
    });
  }

  render() {
    const {
      jackpot,
      games,
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      animationWinPrise,
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
          jackpot={jackpot}
          winCount={winCount}
          loseCount={loseCount}
          drawCount={drawCount}
          totalPrise={totalPrise}
          games={games}
          winPrise={animationWinPrise}
          selectedIndex={selectedIndex}
          isGameOver={isGameOver}
          isRevealing={isRevealing}
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
          round={games}
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
