'use strict'

const { Map } = require('immutable')
const { isBacktesting, updateState } = require('../state')

// TODO: Extract
const executeOnBacktest = (strategy, orderParams, lastPrice) => {
  const trades = strategy.get('trades')
  const { price = lastPrice, amount } = orderParams // MARKET has no price
  const nv = price * amount
  const trade = Map({ // TODO: Extract as generateTrade()
    ...orderParams,
    mts: Date.now(),
    nv
  })

  updateState(strategy, 'trades', trades.push(trade))

  return trade
}

// TODO: Extract
const executeLive = (strategy, orderParams) => {
  throw new Error('live execution is WIP')
}

// TODO: document
const execute = async (strategy, orderParams, lastPrice) => {
  if (isBacktesting) {
    return executeOnBacktest(strategy, orderParams, lastPrice)
  } else {
    return executeLive(strategy, orderParams)
  }
}

module.exports = execute
