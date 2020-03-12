'use strict'

process.env.DEBUG = 'bfx:hf:*'

const debug = require('debug')('bfx:hf:func:examples:ema-cross')
const data = require('bfx-hf-func-data')
const { EMA } = require('bfx-hf-indicators')
const HFF = require('../')

// const emasCrossed = ({ s, l }) => s.crossed(l.v())

const strategy = async (f) => {
  await f.defineIndicators({
    l: new EMA([100]),
    s: new EMA([20])
  })

  // await f.breakIf.indicators(({ s, l }) => s.crossed(l.v()))

  /*
  return f.condition.indicators(emasCrossed, async ({ s, l } = {}) => {
    debug('indicators crossed: s:%f <-> l:%f', s.v(), l.v())

    if (f.inPosition()) {
      return f.closePosition()
    } else {
      return f.openPosition({ amount: 6 })
    }
  })
  */

  await f.condition.threshold('s', '==', 'l', () => {
    const i = f.getIndicators()
    debug('whoop %d == %d', i.s.v(), i.l.v())
  })
}

const run = async () => {
  await HFF.backtest({
    strategy,
    defaultSymbol: 'tLEOUSD',
    datasets: {
      tLEOUSD: data['trade:1m:tLEOUSD']
    }
  })
}

try {
  run()
} catch (e) {
  debug('error: %s', e.stack)
}
