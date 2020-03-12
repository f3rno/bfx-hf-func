'use strict'

process.env.DEBUG = 'bfx:hf:*'

const debug = require('debug')('bfx:hf:func:examples:ema-cross')
const data = require('bfx-hf-func-data')
const { EMA } = require('bfx-hf-indicators')
const _reduce = require('lodash/reduce')
const HFF = require('../')

const emasCrossed = ({ s, l }) => s.crossed(l.v())

const strategy = async (f, data) => {
  const price = HFF.priceForData(data)

  await f.defineIndicators({
    l: new EMA([100]),
    s: new EMA([20])
  })

  // await f.breakIf.indicators(({ s, l }) => s.crossed(l.v()))

  return f.condition.indicators(emasCrossed, async ({ s, l } = {}) => {
    debug('indicators crossed: s:%f <-> l:%f', s.v(), l.v())

    if (f.inPosition()) {
      console.log({ openPrice: price })
      return f.closePosition({ price })
    } else {
      return f.openPosition({ amount: 6, price })
    }
  })

  /*
  await f.condition.threshold('s', '==', 'l', () => {
    const i = f.getIndicators()
    debug('whoop %d == %d', i.s.v(), i.l.v())
  })
  */
}

// TODO: extract as util
const debugResults = (strategy) => {
  const trades = HFF.getState(strategy).get('trades').toJS()
  const positions = HFF.getState(strategy).get('positions').toJS()
  const pl = _reduce(trades.map(t => t.nv), (prev, acc) => prev + acc, 0)

  console.log(pl)
  console.log('open positions:')
  console.log(positions)
  console.log(positions.tLEOUSD.trades)
}

const run = async () => {
  await HFF.backtest({
    strategy,
    defaultSymbol: 'tLEOUSD',
    datasets: {
      tLEOUSD: data['trade:1m:tLEOUSD']
    }
  })

  debugResults(strategy)
}

try {
  run()
} catch (e) {
  debug('error: %s', e.stack)
}
