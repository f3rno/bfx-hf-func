'use strict'

const _isError = require('lodash/isError')
const debug = require('debug')('bfx:hf:func:util:do-error')
const { isBacktesting } = require('../state')

/**
 * Throws the error during a backtest, and logs it during live execution
 *
 * @memberOf module:Utility
 *
 * @param {Strategy} strategy - strategy
 * @param {string|Error} error - error
 * @throws {Error} error is thrown if backtesting
 */
const doError = (strategy = {}, error) => {
  const e = _isError(error) ? error : new Error(error)

  if (isBacktesting(strategy)) {
    throw e
  } else {
    debug('error: %s', e.stack)
  }
}

module.exports = doError
