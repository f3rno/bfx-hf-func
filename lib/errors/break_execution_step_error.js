'use strict'

/**
 * An error that indicates a strategy execution step needs to terminate early,
 * skipping the rest of the strategy's logic.
 *
 * @memberOf module:Errors
 */
class BreakExecutionStepError extends Error {
  /**
   * Construct a new error
   *
   * @param {string} message - error message
   */
  constructor (message) {
    super(message)
    this.name = 'BreakExecution'
  }
}

module.exports = BreakExecutionStepError
