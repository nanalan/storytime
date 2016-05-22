'use strict'

const chalk = require('chalk')
const arr_eq = require('array-equal')

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
    cri: ['def', x => error('Sadness', to_s(x))]
  }

  let evalBlock = true
  let block = 0
  let blockFlags = {
    if: false
  }

  const error = function(type, msg, i, s) {
    let onLine = ''

    try {
      const ln = require('get-line-from-pos')(s, i-1)
      onLine = ' on ' + chalk.white.bold('line ' + ln)
    } catch(e) {}

    const sad = chalk.red(
      'Uncated '
      +
      type
      +
      'Ewwor: '
    )
    +
    chalk.red(msg)
    +
    onLine

    if(blockFlags.try) {
      evalBlock = false
      blockFlags.err = msg
    } else {
      console.error(sad)
      process.exit(1)
    }
  }

    
  const expr = function(e, scope, source, index) {
    if(typeof e === 'undefined') e = ['undefined', undefined]

    let type = e.shift()
    let args = e.map(arg => typeof arg === 'object' ? expr(arg, scope, source, index) : arg)
    let result = e

    /* types */

    if(type === 'var') {
      if(typeof scope[args[0]] === 'undefined')
        error('Loli', `${chalk.bold(args[0])} is not defined`, index, source)

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

    if(type === 'divide') {
      if(args[0][0] !== 'num' || args[1][0] !== 'num')
        error('Moron', 'How did you think that would work?', index, source)

      result = args[0][1] / args[1][1]
    }

    if(type === 'multiply') {
      if(args[0][0] === 'str' && args[1][0] === 'num') {
        result = args[0][1].repeat(args[1][1])
      } else if(args[0][0] === 'num' && args[1][0] === 'num') {
        result = args[0][1] * args[1][1]
      } else
        error('Moron', 'How did you think that would work?', index, source)
    }

    if(type === 'power') {
      if(args[0][0] !== 'num' || args[1][0] !== 'num')
        error('Moron', 'How did you think that would work?', index, source)

      result = Math.pow(args[0][1], args[1][1])
    }

    if(type === 'eq') {
      result = arr_eq(args[0], args[1])
    }

    /*
    if(typeof result !== 'object')
      console.log('Expression:', type, args, '\nResult:', result, '\n')
    */

    return to_type(result)
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
          error('Loli', `${chalk.bold(vari)} is already defined`, index, source)

        scope[vari] = [to[0], to[1]]
      } else
      if(line[0] === 'modify') {
        /*
          Variable modifications.
        */

        let vari = line[1][1]
        let to = expr(line[1][2], scope, source, index)

        if(typeof scope[vari] === 'undefined')
          error('Loli', `${chalk.bold(vari)} is not defined`, index, source)

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
        } else error('Loli', `${chalk.bold(identifier)} is not defined`, index, source)
      } else
      if(line[0] === 'if') {
        /*
          Conditional if.
        */

        let expression = expr(line[1], scope, source, index)

        if(expression[1] === true) evalBlock = true
        else evalBlock = false

        blockFlags.if = true
        blockFlags.latest = 'if'
        block++
      } else
      if(line[0] === 'try') {
        blockFlags.try = true
        blockFlags.latest = 'try'
        blockFlags.error = ''
        block++
      }
    }

    if(line[0] === 'end') {
      /*
        Close code block.
      */

      if(block === 0) error('Syntax', `Unexpected token ${chalk.bold('gtfo')}`, index, source)

      block--
      blockFlags[blockFlags.latest] = false
      evalBlock = true
    } else
    if(line[0] === 'else') {
      /*
        Else part of an if.
      */

      if(!blockFlags.if) error('Syntax', `Unexpected token ${chalk.bold('elsz')}`, index, source)

      blockFlags.if = false
      blockFlags.else = true
      blockFlags.latest = 'else'

      evalBlock = !evalBlock
    } else
    if(line[0] === 'catch') {
        if(!blockFlags.try) error('Syntax', `Unexpected token ${chalk.bold('cat')}`, index, source)

        evalBlock = true
        blockFlags.try = false
        blockFlags.catch = true
        blockFlags.latest = 'catch'

        let err = line[1]
        scope[err] = blockFlags.err

        block++
      }
  })
}