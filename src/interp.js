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

function expr(e, scope) {
  if(e[0] === 'var') e = scope[e[1]]
  
  return e
}

module.exports = function interpret(tree, source) {
  let scope = {
    print: ['def', x => console.log(x[1])]
  }

  tree.forEach(function(line) {
    let index = line[1]
    line = line[0]

    if(line[0] === 'define') {
      /*
        Variable definitions.
        (num|str) <var> [(=|is) <value>]
      */

      let type = line[1][0]
      let vari = line[1][1]
      let to = expr(line[1][2],scope)

      if(type !== to[0]) error(`Type mismatch; ${chalk.bold(vari)} is type ${chalk.cyan(type)}`, index, source)

      scope[vari] = [type, to[1]]
    } else
    if(line[0] === 'modify') {
      /*
        Variable modifications.
        <var> (=|is) <value>
      */

      let vari = line[1][1]
      let type = scope[vari][0]
      let to = expr(line[1][2],scope)

      if(type !== to[0]) error(`Type mismatch; ${chalk.bold(vari)} is type ${chalk.cyan(type)}`, index, source)

      scope[vari] = [type, to[1]]
    } else
    if(line[0] === 'call') {
      /*
        Definition calls.
        <var> [arg1[, arg2[, arg3]]]
      */

      let identifier = line[1][0]
      let args = line[1][1].map(arg => expr(arg,scope))

      if(typeof scope[identifier] !== 'undefined') {
        scope[identifier][1](...args)
      } else error(`${chalk.bold(identifier)} is not defined`, index, source)
    }
  })
}