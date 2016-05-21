'use strict'

const chalk = require('chalk')
const arr_eq = require('array-equal')

function error(msg, i, s) {
  const ln = require('get-line-from-pos')(s, i-1)

  console.error(
    chalk.red(msg)
    + ' on ' +
    chalk.white('line ' + ln)
  )

  process.exit(1)
}

function expr(e, scope, source, index) {
  if(typeof e === 'undefined') e = ['undefined', undefined]
  if(typeof e[1] === 'array') e[1] = expr[e[1]]
  if(typeof e[2] === 'array') e[2] = expr[e[2]]

  if(e[0] === 'var') {
    if(typeof scope[e[1]] === 'undefined') error(`${chalk.bold(e[1])} is not defined`, index, source)
    e = scope[e[1]]
  }

  if(e[0] === 'equals') {

  }

  return e
}

function to_s(xyz) {
  if(xyz[0] === 'str') return xyz[1]
  if(xyz[0] === 'num') return xyz[1]
  if(xyz[0] === 'bool' && xyz[1] === true) return 'tru'
  if(xyz[0] === 'bool' && xyz[1] === false) return 'fals'
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

  tree.forEach(function(line) {
    let index = line[1]
    line = line[0]

    if(evalBlock) {
      if(line[0] === 'define') {
        /*
          Variable definitions.
          issa <var>
          <var> issa <expression>
        */

        let vari = line[1][0]
        let to = expr(line[1][2], scope, source)

        scope[vari] = [to[0], to[1]]
      } else
      if(line[0] === 'modify') {
        /*
          Variable modifications.
          <var> is <expression>
        */

        let vari = line[1][1]
        let type = scope[vari][0]
        let to = expr(line[1][2], scope, source, index)

        if(typeof scope[vari] === 'undefined') error(`${chalk.bold(vari)} is not defined`, index, source)

        scope[vari] = to
      } else
      if(line[0] === 'call') {
        /*
          Definition calls.
          <var> [arg1[, arg2[, arg3]]]
        */

        let identifier = line[1][0]
        let args = line[1][1].map(arg => expr(arg, scope, source, index))

        if(typeof scope[identifier] !== 'undefined') {
          scope[identifier][1](...args)
        } else error(`${chalk.bold(identifier)} is not defined`, index, source)
      } else
      if(line[0] === 'if') {
        /*
          Conditional if.
          <is> <expression> <result>?
            code block
          kek[|uvawys,
            code block
          kek]
        */

        let expression = expr(line[1], scope, source, index)
        let result = expr(line[2], scope, source, index)

        if(arr_eq(expression, result)) evalBlock = true
        else evalBlock = false

        block++
      }
    }

    if(line[0] === 'end') {
      /*
        Close code block.
        kek
      */

      if(block === 0) error(`Cannot ${chalk.cyan('kek')} outside of block`, index, source)

      block--
      evalBlock = true
    } else
    if(line[0] === 'else') {
      /*
        Else part of an if.
        uvawys,
          code block
        kek
      */

      evalBlock = !evalBlock
    }
  })
}