'use strict'

const fs = require('fs')
const nearley = require('nearley')
const nearleyg = require('nearley/lib/nearley-language-bootstrapped.js')
const nearleyc = require('nearley/lib/compile.js')
const gen = require('nearley/lib/generate.js')
const interp = require('./interp.js')
const uniq = require('uniq')

module.exports = function tell(story, opts) {
  let grammar, parser
  let lines = story.split('\n')

  process.chdir(__dirname)

  // temporary
  opts.grammar = 'grammars/classic'

  if(!opts.grammar) {
    // determine the grammar
    switch(lines[0]) {
      case 'once upon a time,':
        grammar = 'classic'
      break;

      case 'in a galaxy far, far away...':
        grammar = 'obi-wan'
      break;
    }
    grammar = 'grammars/' + grammar

    // destroy first level of indentation
    lines = lines.map(line => line.substr(2))

    // destroy the first line
    lines.shift()
  } else grammar = opts.grammar

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

  // parse story
  let trees = uniq(parser.feed(source).results, require('deep-equal')) // hm...

  if(trees.length > 1) {
    console.dir(trees, {depth:null})
    console.warn('^^^ ambiguous grammar ('+trees.length+') ^^^')
  } else if(trees.length === 0) throw 'nothing parsed'
  else if(opts.tree) console.log(JSON.stringify(trees[0], null, 2))

  // interpret it!
  interp(trees[0], source)
}