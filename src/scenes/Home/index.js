import React from 'react';
import classnames from 'classnames/bind';
import style from './style.scss';
import Loading from 'components/Loading';
import * as EosHelper from 'services/EosHelper';
const cx = classnames.bind(style);
const JUNGLE_TEST_NET = {
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  httpEndpoint: 'https://jungle2.cryptolions.io:443',
};

export default class Home extends React.Component {
  state = {
    accountName: '',
    keyProvider: '',
    isLoading: true,
    isConnected: false,
  }

  connect = (accountName, keyProvider) => {
    this.setState({
      accountName,
      keyProvider,
      isLoading: false,
      isConnected: true,
    }, () => {
      window.eos = EosHelper.createEosInstance(JUNGLE_TEST_NET.chainId, JUNGLE_TEST_NET.httpEndpoint, keyProvider, `${accountName}@active`);
    });
  }

  render() {
    const {
      isLoading,
      isConnected,
    } = this.state;

    return (
      <div className={cx('container')}>
        {
          isConnected &&
          <div>
          </div>
        }
        {
          isLoading && <Loading />
        }
      </div>
    )
  }
}
