'use strict'

const fs = require('fs')
const nearley = require('nearley')
const nearleyg = require('nearley/lib/nearley-language-bootstrapped.js')
const nearleyc = require('nearley/lib/compile.js')
const gen = require('nearley/lib/generate.js')

module.exports = function tell(story, opts) {
  let grammar, parser
  let lines = story.split('\n')
  
  console.log('\n')

  process.chdir(__dirname)

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
  } else grammar = opts.grammar

  // destroy the first line
  lines.shift()

  if(opts.dev) {
    // compile grammar.ne
    let file = grammar
    grammar = fs.readFileSync(__dirname+'/'+grammar+'.ne', 'utf8')
    parser = new nearley.Parser(nearleyg.ParserRules, nearleyg.ParserStart)
    grammar = nearleyc(parser.feed(grammar).results[0], {})
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

  // parse story
  story = parser.feed(lines.join('\n')+'\n').results[0]

  if(opts.dev) console.log(JSON.stringify(story, null, 2))
}