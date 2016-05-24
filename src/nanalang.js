'use strict'

const fs = require('fs')
const nearley = require('nearley')
const nearleyg = require('nearley/lib/nearley-language-bootstrapped.js')
const nearleyc = require('nearley/lib/compile.js')
const gen = require('nearley/lib/generate.js')
const interp = require('./interp.js')
const chalk = require('chalk')

module.exports = function lick(lolly, opts) {
  let grammar, parser
  let lines = lolly.split('\n')

  process.chdir(__dirname)

  opts.grammar = 'grammar/nanalang'
  grammar = opts.grammar

  if(opts.dev) {
    // compile grammar.ne
    // clone of https://github.com/Hardmath123/nearley/blob/master/bin/nearleyc.js
    let file = grammar
    grammar = fs.readFileSync(__dirname+'/'+grammar+'.ne', 'utf8')
    parser = new nearley.Parser(nearleyg.ParserRules, nearleyg.ParserStart)
    grammar = nearleyc(parser.feed(grammar).results[0], {nojs: opts.nojs})
    fs.writeFileSync(__dirname+'/'+file+'.js', gen(grammar, 'grammar'))
    grammar = require(__dirname+'/'+file+'.js')
  } else {
    try {
      // read grammar.js
      grammar = require('./'+grammar+'.js')
    } catch(e) {
      throw 'Could not read '+grammar+'.ne (try --dev)'
    }
  }

  // generate parser
  parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)

  // join up the lines again
  let source = '\n'+lines.join('\n')+'\n'

  try {
    // parse lolly
    var trees = parser.feed(source).results
  } catch(e) {
    let ln = require('get-line-from-pos')(source, e.offset) - 1

    console.error(
      chalk.red('Syntax error')
      + ' on ' +
      chalk.white('line ' + ln)
    )

    if(opts.dev) console.log(e.message)

    process.exit(1)
  }

  if(trees.length > 1 && opts.dev) {
    for(let tree in trees)
      console.log(JSON.stringify(trees[tree], null, 0), '\n')
    console.warn(chalk.yellow.italic('^^^^^^^^^^^^^^^^^^^^^^\nAmbiguous grammar ('+trees.length+').\n'))
  } else if(trees.length === 0) {
    console.warn(chalk.yellow.italic('Nothing parsed.'))
    process.exit(1)
  } else if(opts.tree) console.log(JSON.stringify(trees[0], null, 2))

  // interpret it!
  interp(trees[0], source)
}