import React from 'react';
import classnames from 'classnames/bind';
import style from './style.scss';

import {
  Loading,
  Header,
  Footer,
  HowToPlay,
  SystemMessage,
  RevealBoard,
  Panel,
  Picker,
  ErrorMessage,
} from 'components';

import {
  apiBetPunch,
  apiFetchGameRecords,
  apiJackpot,
  apiFetchAccountInfo,
  createEosInstance,
  getNextBetFieldIndex,
  getRandomPunch,
  translatePunches,
  transformGameRecords,
  contractNumberTranslate,
  generateResetDataObject,
} from 'services';

const cx = classnames.bind(style);

export default class Home extends React.Component {
  state = {
    accountName: '',
    keyProvider: '',
    balance: 0,
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
    isRandomPunching: false,
    isAllSelected: false,             // 五個選項皆已下注
    isBankerPunchDone: false,         // 莊家出完拳
    isAutoBettingChecked: false,      // 勾選自動下注
    isAutoBetting: false,             // 系統自動下注中
    isRevealing: false,               // 開獎中
    isGameOver: false,                // 開獎完成，遊戲結束
    isRevealed: false,                // 當局結算
    isShowHowToPlay: false,
    isShowPicker: false,
    isShowErrorMessage: false,
  }

  connect = async (accountName, keyProvider, balance = 0) => {
    window.eos = createEosInstance(keyProvider, `${accountName}@active`);

    this.setState({
      accountName,
      keyProvider,
      balance,
      isLoading: false,
    });

    this.updateJackpot();
  }

  componentDidMount() {
    // FIXME: for development, should be removed.
    // window.setTimeout(() => {
    //   this.connect('jacky1234512', '5KUVCSKrLihT4LQPZwmENjYNeXo8ouhusB8D6LX7eifq6JFcM6Q', 10);
    // }, 500);
  }

  // 更新彩池獎金
  updateJackpot = () => {
    apiJackpot(window.eos).then( result => {
      const { jackpot: oldJackpot, } = result.rows[0];
      const jackpot = contractNumberTranslate(oldJackpot);

      this.setState({
        jackpot,
      });
    });
  }

  // 更新帳戶餘額，防止錢包帶進來的是錯誤餘額
  updateBalance = async () => {
    const balance = await this.fetchAccountInfo();
    this.setState({
      balance,
    });
  }

  fetchJackpot = async () => {
    const result = await apiJackpot(window.eos);
    const { jackpot: oldJackpot, } = result.rows[0];
    return contractNumberTranslate(oldJackpot);
  }

  // 取得帳號資料，更新餘額
  fetchAccountInfo = async () => {
    const { accountName, } = this.state;
    const { core_liquid_balance, } = await apiFetchAccountInfo(window.eos, accountName);
    if(!core_liquid_balance) {
      return 0;
    }

    const str = core_liquid_balance.split(' ').shift();
    const balance = Math.floor(Number(str) * 100) / 100;

    console.log('core_liquid_balance', core_liquid_balance);
    console.log('balance', balance);

    return balance;
  }

  // 開啟/關閉導覽
  handleToggleHowToPlay = () => {
    this.setState({
      isShowHowToPlay: !this.state.isShowHowToPlay,
    });
  }

  // 開啟/關閉自動下注
  handleToggleAutoBetting = () => {
    const { isAutoBettingChecked: oldValue } = this.state;
    const isAutoBettingChecked = !oldValue;
    const isAutoBetting = isAutoBettingChecked;

    this.setState({
      isAutoBettingChecked,
      isAutoBetting,
    });

    if(isAutoBettingChecked) {
      this.handleConfirm();
    }
  }

  // 關閉系統錯誤訊息
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
      isAutoBetting: false,
      isRevealing: false,
      isShowErrorMessage: false,
      isAutoBettingChecked: false,
    });
  }

  // 關閉結算揭示板
  handleCloseReveal = async () => {
    const {
      games,
      winCount: loseWinCount,
      loseCount: lastLoseCount,
      drawCount: lastDrawCount,
      totalPrise: lastTotalPrise,
      isAutoBettingChecked,
      betValue,
      balance,
    } = this.state;

    const winCount = loseWinCount + games.filter(x => x.result === 'win').length;
    const loseCount = lastLoseCount + games.filter(x => x.result === 'lose').length;
    const drawCount = lastDrawCount + games.filter(x => x.result === 'draw').length;
    const animationWinPrise = games.reduce((acc, cur) => acc + cur.prise, 0) / 10000;
    const totalPrise = lastTotalPrise + animationWinPrise;
    const totalBetValue = betValue * 5;
    const resetData = generateResetDataObject();
    const isAutoBetting = isAutoBettingChecked;

    this.updateJackpot();
    this.setState({
      ...resetData,
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      animationWinPrise,
      isAutoBetting,
    });

    if (isAutoBettingChecked && balance >= totalBetValue) {
      this.functionAutoBetting();
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
    const animationWinPrise = games.reduce((acc, cur) => acc + cur.prise, 0) / 10000;
    const totalPrise = lastTotalPrise + animationWinPrise;
    const resetData = generateResetDataObject();
    
    this.updateJackpot();
    this.setState({
      winCount,
      loseCount,
      drawCount,
      totalPrise,
      isAutoBetting: false,
      isAutoBettingChecked: false,
      ...resetData,
    });
  }

  // 調整單柱金額
  handleBetValueChange = betValue => {
    this.setState({
      betValue,
    });
  }

  // 開啟/關閉下注金額 Picker
  handleTogglePicker = () => {
    this.setState({
      isShowPicker: !this.state.isShowPicker,
    });
  }

  // 注幾被點選
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

  // 剪刀石頭布
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

  // 清空
  handleReset = () => {
    const data = generateResetDataObject();
    this.setState({
      ...data,
    });
  }

  functionRandom = (specifyIndex) => () => {
    const punch = getRandomPunch();
    this.handlePunch(punch, specifyIndex);
  }

  // 隨機
  handleRandom = () => {
    this.setState({
      isRandomPunching: true,
    });

    const autoPlayerBet = window.setInterval(() => {
      if (this.state.isAllSelected) {
        clearInterval(autoPlayerBet);
        this.setState({
          isRandomPunching: false,
        });
        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.functionRandom(nextIndex)();
    }, 500);
  }

  // 自動投注
  functionAutoBetting = () => {
    const autoPlayerBet = window.setInterval(() => {
      if (this.state.isAllSelected) {
        clearInterval(autoPlayerBet);
        this.handleReveal();
        return;
      }

      const nextIndex = getNextBetFieldIndex(this.state.games);
      this.functionRandom(nextIndex)();
    }, 500);
  }

  // 確認
  handleConfirm = () => {
    const {
      balance,
      betValue,
      isAllSelected,
    } = this.state;

    if(balance < betValue * 5) {
      this.setState({
        errorMessage: '帳戶餘額不足，下注失敗',
        isShowErrorMessage: true,
      });
      return;
    }

    if (isAllSelected) {
      this.handleReveal();
      return;
    }
    this.functionAutoBetting();
  }

  // 開獎
  handleReveal = async () => {
    const {
      accountName,
      betValue,
      games,
    } = this.state;

    this.setState({
      isAutoBetting: false,
      isRevealing: true,
    });

    const punches = games.sort((a, b) => a.id - b.id).map(game => game.player).join(','); // sort player punches in ascending by id
    const totalBetValue = betValue * 5;
    const memo = translatePunches('api', punches).join('');

    try {
      const punchTransaction = await apiBetPunch(window.eos, accountName, totalBetValue, memo);
      this.revealResult(accountName, punches, betValue);
    } catch (errorString) {
      const { error, } = JSON.parse(errorString);
      console.log('error', error);
      
      switch(error.code) {
        case 3050003:
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

        await new Promise(r => window.setTimeout(r, 500));
      }

      this.stepReveal();
    })();
  }

  stepReveal = async () => {
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
      isAutoBettingChecked,
      isAutoBetting,
      isRevealing,
      isGameOver,
      isRevealed,
      isShowHowToPlay,
      isShowPicker,
      isShowErrorMessage,
      isRandomPunching,
    } = this.state;

    const isDisableClean = isAutoBetting || isRevealing || isRandomPunching || isRevealed || games.filter(game => game.player !== '').length === 0;
    const isDisableRandom = isAutoBetting || isRevealing || isRevealed;
    const isConfirmButtonClickable = isAllSelected && !isRevealing && !isAutoBetting && !isAutoBettingChecked && !isRevealed && !isRandomPunching;
    
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
          isAutoBettingChecked={isAutoBettingChecked}
          isConfirmButtonClickable={isConfirmButtonClickable}
          isDisableClean={isDisableClean}
          isDisableRandom={isDisableRandom}
          onAutoBettingClick={this.handleToggleAutoBetting}
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
          (isAutoBetting || isRevealing) &&
          <SystemMessage
            isAutoBetting={isAutoBetting}
            isRevealing={isRevealing}
          />
        }
        <Picker
          isShow={isShowPicker}
          betValue={betValue}
          onChange={this.handleBetValueChange}
          onClose={this.handleTogglePicker}
        />

        { 
          isRevealed && 
          <RevealBoard
            round={games}
            isRevealed={isRevealed && false}
            isAutoBettingChecked={isAutoBettingChecked}
            onConfirm={this.handleCloseReveal}
            onCancel={this.handleCloseRevealAndCancelAuto}
          />
        }

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
