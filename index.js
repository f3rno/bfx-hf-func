'use strict'

module.exports = {
  ...require('./lib/backtest'),
  ...require('./lib/errors'),
  ...require('./lib/exec'),
  ...require('./lib/f'),
  ...require('./lib/indicators'),
  ...require('./lib/util')
}
