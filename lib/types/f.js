'use strict'

/**
 * A collection of helper functions configured for a specific strategy. They
 * are passed to strategies during execution, and serve as an interface
 * between the strategy and the exchange/execution environment.
 *
 * @typedef {object} F
 * @property {Function} defineIndicators - used for initializing the strategy
 *   Indicator map.
 * @property {Function} getIndicators - queries the strategy's indicators Map
 * @property {Function} inPosition - queries if the strategy is in a position
 * @property {Function} closePosition - closes an option position
 * @property {Function} openPosition - opens a new position
 * @property {object} event - control flow helpers
 * @property {Function} event.indicators - allows the strategy to wait for a
 *   condition/event involving the configured indicators
 */
