'use strict'

/**
 * An indicator instance
 *
 * @typedef {object} Indicator
 * @property {Function} v - query current value
 * @property {Function} l - query total number of values
 * @property {Function} prev - query historical value
 * @property {Function} update - update the current value with a new data point
 * @property {Function} add - add a new value with a new data point
 * @property {Function} crossed - query if the indicator crossed a value
 * @property {Function} ready - query if the indicator is seeded
 */
