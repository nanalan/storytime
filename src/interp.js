'use strict'

const chalk = require('chalk')
const arr_eq = require('array-equal')

function error(type, msg, i, s) {
  const ln = require('get-line-from-pos')(s, i-1)

  console.error(
    chalk.red(
      'Uncaught '
      +
      type
      +
      'Error: '
    )
    +
    chalk.red(msg)
    + ' on ' +
    chalk.white.bold('line ' + ln)
  )

  process.exit(1)
}

function expr(e, scope, source, index) {
  if(typeof e === 'undefined') e = ['undefined', undefined]

  let type = e.shift()
  let args = e.map(arg => typeof arg === 'object' ? expr(arg, scope, source, index) : arg)
  let result = e

  /* types */

  if(type === 'var') {
    if(typeof scope[args[0]] === 'undefined')
      error('Reference', `${chalk.bold(args[0])} is not defined`, index, source)

    result = scope[args[0]]
  }

  if(type === 'str') result = [type, args[0]]
  if(type === 'num') result = [type, args[0]]
  if(type === 'bool') result = [type, args[0]]

  /* operators */

  if(type === 'plus') {
    result = args[0][1] + args[1][1]
  }

  if(type === 'minus') {
    if(args[0][0] !== 'num' || args[1][0] !== 'num')
      error('Moron', 'How did you think that would work?', index, source)

    result = args[0][1] - args[1][1]
  }

  /*
  if(typeof result !== 'object')
    console.log('Expression:', type, args, '\nResult:', result, '\n')
  */

  return to_type(result)
}

function to_s(xyz) {
  if(xyz[0] === 'str') return xyz[1]
  if(xyz[0] === 'num') return xyz[1]
  if(xyz[0] === 'bool' && xyz[1] === true) return 'win'
  if(xyz[0] === 'bool' && xyz[1] === false) return 'fail'
  return xyz[1]
}

function to_type(xyz) {
  if(typeof xyz === 'string')  return ['str',  xyz]
  if(typeof xyz === 'number')  return ['num',  xyz]
  if(typeof xyz === 'boolean') return ['bool', xyz]
  return xyz
}

module.exports = function interpret(tree, source) {
  let scope = {
    rite: ['def', x => console.log(to_s(x))],
    cri: ['def', x => {
      console.error(chalk.red(to_s(x)))
      process.exit(1)
    }]
  }

  let evalBlock = true
  let block = 0
  let blockFlags = {
    if: false
  }

  tree.forEach(function(line) {
    let index = line[1]
    line = line[0]

    if(evalBlock) {
      if(line[0] === 'define') {
        /*
          Variable definitions.
        */

        let vari = line[1][0]
        let to = expr(line[1][1], scope, source)

        if(typeof scope[vari] !== 'undefined')
          error('Reference', `${chalk.bold(vari)} is already defined`, index, source)

        scope[vari] = [to[0], to[1]]
      } else
      if(line[0] === 'modify') {
        /*
          Variable modifications.
        */

        let vari = line[1][1]
        let to = expr(line[1][2], scope, source, index)

        if(typeof scope[vari] === 'undefined')
          error('Reference', `${chalk.bold(vari)} is not defined`, index, source)

        scope[vari] = to
      } else
      if(line[0] === 'call') {
        /*
          Definition calls.
        */

        let identifier = line[1][0]
        let args = line[1][1].map(arg => expr(arg, scope, source, index))

        if(typeof scope[identifier] !== 'undefined') {
          scope[identifier][1](...args)
        } else error('Reference', `${chalk.bold(identifier)} is not defined`, index, source)
      } else
      if(line[0] === 'if') {
        /*
          Conditional if.
        */

        let expression = expr(line[1], scope, source, index)
        let result = expr(line[2], scope, source, index)

        if(arr_eq(expression, result)) evalBlock = true
        else evalBlock = false

        blockFlags.if = true
        block++
      }
    }

    if(line[0] === 'end') {
      /*
        Close code block.
      */

      if(block === 0) error('Syntax', `Unexpected token ${chalk.bold('gtfo')}`, index, source)

      block--
      blockFlags = {}
      evalBlock = true
    } else
    if(line[0] === 'else') {
      /*
        Else part of an if.
      */

      if(!blockFlags.if) error('Syntax', `Unexpected token ${chalk.bold('elsz')}`, index, source)

      blockFlags.if = false
      blockFlags.else = true

      evalBlock = !evalBlock
    }
  })
}