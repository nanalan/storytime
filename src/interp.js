'use strict'

const chalk = require('chalk')

function error(msg, i, s) {
  const ln = require('get-line-from-pos')(s, i-1)

  console.error(
    chalk.red(msg)
    + ' on ' +
    chalk.white('line ' + ln)
  )

  process.exit(1)
}

function expr(e) {
  return e
}

module.exports = function interpret(tree, source) {
  let scope = {
    print: ['def', () => console.log(arguments.map(arg => arg[1]()))],
    if: ['def', (expression, fn) => expression? fn : function() {}]
  }

  tree.forEach(function(line) {
    let index = line[1]
    line = line[0]

    switch(line[0]) {
      case 'define':
        /*
          Variable definitions.
          (num|str) <var> [(=|is) <value>]
        */

        let type = line[1][0]
        let vari = line[1][1]
        let to = line[1][2]

        if(type !== to[0]) error('Type mismatch', index, source)

        scope[vari] = [type, () => to[1]]
      break

      case 'modify':
        /*
          Variable modifications.
          <var> (=|is) <value>
        */
      break

      case 'call':
        /*
          Definition calls.
          <var> [arg1[, arg2[, arg3]]]
        */

        let identifier = line[1][0]
        let args = line[1][1].map(arg => expr(arg))
        
        if(typeof scope[identifier] !== 'undefined') {
          scope[identifier][1](...args)
        } else error(`${chalk.bold(identifier)} is not defined`, index, source)
      break
    }
  })
}