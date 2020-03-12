'use strict'

const { TIME_FRAME_WIDTHS } = require('bfx-hf-util')
const { getState } = require('../state')

/**
 * Check if the specified timestamp falls within the last candle received.
 *
 * @memberOf module:Utility
 *
 * @param {Strategy} strategy - strategy to query
 * @param {number|Date} mts - timestamp to query
 * @returns {boolean} withinLastCandle
 */
const withinLastCandle = (strategy, mts) => {
  const state = getState(strategy)
  const lastCandle = state.get('lastCandle')

  if (!lastCandle) {
    return false
  }

  const { tf } = lastCandle

  return lastCandle && (
    +mts >= lastCandle.mts && +mts <= (lastCandle.mts + TIME_FRAME_WIDTHS[tf])
  )
}

module.exports = withinLastCandle
