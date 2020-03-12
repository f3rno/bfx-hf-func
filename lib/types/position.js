'use strict'

/**
 * A position opened via live trading or during a backtest
 *
 * @typedef {Map} Position
 * @property {List<Map>} trades - all trades that affected the position,
 *   including close
 * @property {number} basePrice - base price
 * @property {number} amount - last position amount
 * @property {number} mts - creation timestamp
 * @property {string} symbol - symbol
 * @property {number} target - automated price target
 * @property {number} stop - automated stop loss
 */
