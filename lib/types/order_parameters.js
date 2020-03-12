'use strict'

/**
 * Order creation parameters
 *
 * @typedef {object} OrderParameters
 * @property {number} [cid] - client ID
 * @property {number} [gid] - group ID
 * @property {number} [price] - optional for MARKET orders
 * @property {number} [stopPrice] - stop price for STOP LIMIT and OCO orders
 * @property {number} [distance] - trail distance for TRAILING STOP orders
 * @property {number} amount - amount
 * @property {string} type - order type
 * @property {boolean} [hidden] - hidden flag
 * @property {boolean} [postonly] - postonly flag
 * @property {boolean} [reduceonly] - reduceonly flag
 * @property {boolean} [posclose] - posclose flag
 * @property {boolean} [oco] - oco flag
 * @property {string} [affiliateCode] - affiliate code
 * @property {number} [tif] - TIF timestamp
 */
