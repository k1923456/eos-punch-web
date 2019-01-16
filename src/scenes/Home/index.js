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
import ErrorMessage from 'components/ErrorMessage';
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
  apiJackpot,
  apiFetchAccountInfo,
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
    balance: 10,
    betValue: 0.5,
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
    jackpot: 0,
    winCount: 0,
    loseCount: 0,
    drawCount: 0,
    totalPrise: 0,
    animationWinPrise: 0,
    errorMessage: '',
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
    isShowErrorMessage: false,
  }

  componentDidMount() {
    // FIXME: for development, should be removed.
    // window.setTimeout(() => {
    //   this.connect('jacky1234512', '5KUVCSKrLihT4LQPZwmENjYNeXo8ouhusB8D6LX7eifq6JFcM6Q', 10);
    // }, 500);
  }

  updateJackpot = () => {
    apiJackpot(window.eos).then(result => {
      const { jackpot, } = result.rows[0];
      this.setState({
        jackpot: jackpot / 10000,
      });
    });
  }

  fetchAccountInfo = async () => {
    const { accountName, } = this.state;
    const { core_liquid_balance, } = await apiFetchAccountInfo(window.eos, accountName);
    if(!core_liquid_balance) {
      return 0;
    }

    const str = core_liquid_balance.split(' ').shift();
    const balance = Math.floor(Number(str) * 100) / 100;
    return balance;
  }

  connect = async (accountName, keyProvider, balance = 10) => {
    this.setState({
      accountName,
      keyProvider,
      balance,
      isLoading: false,
    });

    window.eos = EosHelper.createEosInstance(JUNGLE_TEST_NET.chainId, JUNGLE_TEST_NET.httpEndpoint, keyProvider, `${accountName}@active`);
    this.updateJackpot();
  }

  handleToggleHowToPlay = () => {
    this.setState({
      isShowHowToPlay: !this.state.isShowHowToPlay,
    });
  }

  handleToggleAutoBidding = () => {
    this.setState({
      isAutoBiddingChecked: !this.state.isAutoBiddingChecked,
    }, this.handleConfirm);
  }

  handleCloseErrorMessage = () => {
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
      errorMessage: '',
      isGameOver: false,
      isAllSelected: false,
      isBankerPunchDone: false,
      isRevealed: false,
      isAutoBidding: false,
      isRevealing: false,
      isShowErrorMessage: false,
      isAutoBiddingChecked: false,
    });
  }

  // 關閉結算揭示板
  handleCloseReveal = () => {
    if (window.confirmRevealCountdown) {
      clearTimeout(window.confirmRevealCountdown);
    }

    const {
      games,
      winCount: loseWinCount,
      loseCount: lastLoseCount,
      drawCount: lastDrawCount,
      totalPrise: lastTotalPrise,
      isAutoBiddingChecked,
      betValue,
      balance,
    } = this.state;

    const winCount = loseWinCount + games.filter(x => x.result === 'win').length;
    const loseCount = lastLoseCount + games.filter(x => x.result === 'lose').length;
    const drawCount = lastDrawCount + games.filter(x => x.result === 'draw').length;
    const animationWinPrise = games.reduce((acc, cur) => Math.floor((acc + cur.prise) * 100) / 100, 0);
    const totalPrise = lastTotalPrise + animationWinPrise;
    const totalBetValue = betValue * 5;

    this.handleReset();
    this.updateJackpot();
    this.setState({
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      animationWinPrise,
    });

    if (isAutoBiddingChecked && balance >= totalBetValue) {
      this.handleAutoBetting();
    }
  }

  // 關閉結算揭示板與自動下注
  handleCloseRevealAndCancelAuto = () => {
    if (window.confirmRevealCountdown) {
      clearTimeout(window.confirmRevealCountdown);
    }

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
    const animationWinPrise = games.reduce((acc, cur) => Math.floor((acc + cur.prise) * 100) / 100, 0);
    const totalPrise = lastTotalPrise + animationWinPrise;

    this.handleReset();
    this.updateJackpot();
    this.setState({
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      animationWinPrise,
      isAutoBidding: false,
      isAutoBiddingChecked: false,
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

    if (!specifyIndex && selectedIndex === -1) {
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
      errorMessage: '',
      isGameOver: false,
      isAllSelected: false,
      isBankerPunchDone: false,
      isRevealed: false,
      isAutoBidding: false,
      isRevealing: false,
      isShowErrorMessage: false,
    });
  }

  functionRandom = (specifyIndex) => () => {
    const punch = getRandomPunch();
    this.handlePunch(punch, specifyIndex);
  }

  handleRandom = () => {
    const autoPlayerBet = window.setInterval(() => {
      if (this.state.isAllSelected) {
        clearInterval(autoPlayerBet);
        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.functionRandom(nextIndex)();
    }, 200);
  }

  // 出拳
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

    const autoPlayerBet = window.setInterval(() => {
      if (this.state.isAllSelected) {
        clearInterval(autoPlayerBet);
        this.handleReveal();
        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.functionRandom(nextIndex)();
    }, 100);
  }

  // 開獎
  handleReveal = async () => {
    const {
      accountName,
      betValue,
      games,
    } = this.state;

    this.setState({
      isAutoBidding: false,
      isRevealing: true,
    });

    const punches = games.sort((a, b) => a.id - b.id).map(game => game.player).join(','); // sort player punches in ascending by id
    const totalBetValue = betValue * 5;
    const memo = translatePunches('api', punches).join('');

    try {
      await new Promise(r => window.setTimeout(r, 1000));
      const punchTransaction = await apiBetPunch(window.eos, accountName, totalBetValue, memo);
      this.revealResult(accountName, punches, betValue);
    } catch (errorString) {
      const { error, } = JSON.parse(errorString);
      console.log('error', error)
      switch(error.code) {
        case 3050003:
          this.setState({
            errorMessage: '帳戶餘額不足，下注失敗',
            isShowErrorMessage: true,
          });
          break;
        case 3080004:
        default:
          this.setState({
            errorMessage: '帳戶 CPU 不足，下注失敗',
            isShowErrorMessage: true,
          });
          break;
      }
    }
  }

  revealResult = async (accountName, punches, betValue) => {
    const { rows, } = await apiFetchGameRecords(window.eos);
    const userRecord = rows.find(row => row.userName === accountName);
    const gameResult = transformGameRecords(userRecord, punches, betValue);
    const newGames = [
      {
        id: 0,
        player: 'revealing',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 1,
        player: 'revealing',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 2,
        player: 'revealing',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 3,
        player: 'revealing',
        banker: '',
        result: '',
        prise: 0,
      },
      {
        id: 4,
        player: 'revealing',
        banker: '',
        result: '',
        prise: 0,
      },
    ];

    this.setState({
      games: newGames,
    });

    (async () => {
      for (let index = 0; index < gameResult.round.length; index++) {
        newGames[index].player = gameResult.round[index].player;
        newGames[index].banker = gameResult.round[index].banker;
        newGames[index].result = gameResult.round[index].result;
        newGames[index].prise = gameResult.round[index].prise;
        const selectedIndex = index + 1;
        this.setState({
          isGameOver: true,
          games: newGames,
          selectedIndex,
        });

        await new Promise(r => window.setTimeout(r, 200));
      }

      this.stepGameOver();
    })();
  }

  stepGameOver = async () => {
    this.stepReveal();
  }

  stepReveal = async () => {
    await new Promise(r => window.setTimeout(r, 2000));
    const balance = await this.fetchAccountInfo();
    this.setState({
      isRevealed: true,
      isRevealing: false,
      balance,
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
      errorMessage,
      isLoading,
      isAllSelected,
      isAutoBiddingChecked,
      isAutoBidding,
      isRevealing,
      isGameOver,
      isRevealed,
      isShowHowToPlay,
      isShowPicker,
      isShowErrorMessage,
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
          isAllSelected={isAllSelected}
          onSelect={this.handleBetFieldSelected}
          onScissorPunch={this.handleScissorPunch}
          onStonePunch={this.handleStonePunch}
          onPaperPunch={this.handlePaperPunch}
        />
        <Footer
          betValue={betValue}
          isAutoBiddingChecked={isAutoBiddingChecked}
          isConfirmButtonClickable={isConfirmButtonClickable}
          isDisableClean={isDisableClean}
          isDisableRandom={isDisableRandom}
          onAutoBiddingClick={this.handleToggleAutoBidding}
          onPickerClick={this.handleTogglePicker}
          onConfirm={this.handleConfirm}
          onReset={this.handleReset}
          onRandom={this.handleRandom}

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
          isAutoBiddingChecked={isAutoBiddingChecked}
          onConfirm={this.handleCloseReveal}
          onCancel={this.handleCloseRevealAndCancelAuto}
        />
        {
          isShowErrorMessage && 
          <ErrorMessage 
            errorMessage={errorMessage} 
            onClose={this.handleCloseErrorMessage}
          />
        }
        {
          isLoading && <Loading />
        }
      </div>
    )
  }
}
