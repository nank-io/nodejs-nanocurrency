const { tools, block } = require("nanocurrency-web")
const Wallet = require(".")

class Transaction {
  constructor({ wallet, proxyRPC }) {
    if (!Wallet.isValid(wallet)) {
      throw new Error('invalid wallet')
    }

    this.wallet = wallet
    this.proxyRPC = proxyRPC
  }

  async send({ amount, to }) {
    const account = await this.proxyRPC.getAccountInfo(this.wallet.address)
    const { work } = await this.proxyRPC.doWorkGenerate(account.frontier)

    const blockData = {
      walletBalanceRaw: account.balance,
      amountRaw: tools.convert(amount, 'NANO', 'RAW'),
      fromAddress: this.wallet.address,
      toAddress: to,
      representativeAddress: account.representative,
      frontier: account.frontier,
      work
    }
    
    const blockCreated = block.send(blockData, this.wallet.secretKey)

    const result = await this.proxyRPC.doProcess({
      subtype: 'send',
      block: blockCreated
    })

    return result
  }

  async receive({ transactionHash }) {
    let pendingBlocks = [transactionHash]

    if (!transactionHash) {
      pendingBlocks = await this.proxyRPC.getPending(this.wallet.address)  
    }

    if (!pendingBlocks.length) {
      throw new Error('no receive transaction found')
    }
    
    const account = await this.proxyRPC.getAccountInfo(this.wallet.address)
    const { work } = await this.proxyRPC.doWorkGenerate(account.frontier)

    const blockData = {
      walletBalanceRaw: account.balance,
      amountRaw: account.receivable,
      toAddress: this.wallet.address,
      transactionHash: pendingBlocks[0],
      representativeAddress: account.representative,
      frontier: account.frontier,
      work
    }
    
    const blockCreated = block.receive(blockData, this.wallet.secretKey)

    const result = await this.proxyRPC.doProcess({
      subtype: 'receive',
      block: blockCreated
    })

    return result
  }
}

module.exports = Transaction