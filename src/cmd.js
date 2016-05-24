#! /usr/bin/env node
'use strict'

const fs = require('fs')
const lick = require('./nanalang.js')
const opts = require('nomnom')
  .script('lick')
  .options({
    'file': {
      position: 0,
      help: 'Path to .lolly file to interpret'
    }
  })
  .option('version', {
    abbr: 'v',
    flag: true,
    help: 'Print version number & exit',
    callback: function() {
      return 'nanalang v' + require('../package.json').version
    }
  })
  // force re-compilation of grammar
  .option('dev', {
    abbr: 'd',
    flag: true,
    hidden: true
  })
  // force nearley --nojs compilation
  .option('nojs', {
    flag: true,
    hidden: true
  })
  // print nearley returned tree before interp
  .option('tree', {
    abbr: 't',
    flag: true,
    hidden: true
  })
.nom()

try {
  var lolly = fs.readFileSync(opts['file'], 'utf8')
} catch(e) {
  console.error('Failed to read', opts['file'])
  process.exit(1)
}

lick(lolly, opts)