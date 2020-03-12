'use strict'

const _reduce = require('lodash/reduce')
const { getState } = require('../state')

// TODO: doc
const logResults = (strategy) => {
  const trades = getState(strategy).get('trades').toJS()
  const positions = getState(strategy).get('positions').toJS()
  const pl = _reduce(trades.map(t => t.nv), (prev, acc) => prev + acc, 0)

  console.log(pl)
  console.log('open positions:')
  console.log(positions)
  console.log(positions.tLEOUSD.trades)
}

module.exports = logResults
