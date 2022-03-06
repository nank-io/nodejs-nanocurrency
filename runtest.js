
const { tools } = require('nanocurrency-web');
const ProxyAPI = require('./src/proxy-api');
const ProxyRPC = require('./src/proxy-rpc');
const Wallet = require('./src/wallet');
const Transaction = require('./src/wallet/transaction');

// load 2 wallets
const mnemonic = 'stomach claim mango clever palm adapt travel wage trust gown cheap spoil join soap garlic bachelor crouch erode alien stamp fatal update piano kidney'
const mnemonic2 = 'curious entire coral neck draw nose hurt any bunker goose kitten palace suspect prosper caution mansion recycle broom truly middle autumn more loyal leisure'
const wallet = new Wallet()
const wallet2 = new Wallet()
wallet.importWithMnemonic(mnemonic)
wallet2.importWithMnemonic(mnemonic2)

// setup proxy rpc
const hostname = 'proxy.nanos.cc'
const path = '/proxy'
const proxyAPI = new ProxyAPI({ hostname, path })
const proxyRPC = new ProxyRPC({ proxyAPI })

const walletTransaction = new Transaction({ wallet, proxyRPC })
const walletTransaction2 = new Transaction({ wallet: wallet2, proxyRPC })

const sendFromWallet1ToWallet2 = async () => {
  const sendRes = await walletTransaction.send({
    amount: 0.000222,
    to: wallet2.address
  })
  console.log(`Send from wallet 1. Hash: ${sendRes.hash}`)
  
  const receiveRes = await walletTransaction2.receive({ transactionHash: sendRes.hash })
  console.log(`Receive in wallet 2. Hash: ${receiveRes.hash}`)

  const balance = await proxyRPC.getBalanceOf(wallet2.address)
  console.log(`Wallet 2 balance`, balance)
}

const sendFromWallet2ToWallet1 = async () => {
  const sendRes = await walletTransaction2.send({
    amount: 0.000222,
    to: wallet.address
  })
  console.log(`Send from wallet 2. Hash: ${sendRes.hash}`)
  
  const receiveRes = await walletTransaction.receive({ transactionHash: sendRes.hash })
  console.log(`Receive in wallet 1. Hash: ${receiveRes.hash}`)

  const balance = await proxyRPC.getBalanceOf(wallet.address)
  console.log(`Wallet 1 balance`, balance)
}

const balances = async () => {
  const balance = await proxyRPC.getBalanceOf(wallet.address)
  console.log(`Wallet 1 balance`, balance)

  const balance2 = await proxyRPC.getBalanceOf(wallet2.address)
  console.log(`Wallet 2 balance`, balance2)
}

if (process.argv[2] == '1') {
  sendFromWallet1ToWallet2()
} else if (process.argv[2] == '2') {
  sendFromWallet2ToWallet1()
} else if (process.argv[2] == '3') {
  balances()
}