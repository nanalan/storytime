#! /usr/bin/env node
'use strict'

const fs = require('fs')
const tell = require('./storytime.js')
const opts = require('nomnom')
  .script('tell')
  .options({
    story: {
      position: 0,
      help: 'Path to .story to tell'
    }
  })
  .option('version', {
    abbr: 'v',
    flag: true,
    help: 'print version number and exit',
    callback: function() {
      return 'Storytime v' + require('../package.json').version
    }
  })
  .option('dev', {
    abbr: 'd',
    flag: true,
    help: 'force re-compilation of grammar'
  })
  .option('nojs', {
    flag: true,
    hidden: true
  })
  .option('tree', {
    abbr: 't',
    flag: true,
    help: 'print source tree'
  })
  /*
  .option('grammar', {
    abbr: 'g',
    help: 'file to act as story grammar'
  })
  */
.nom()

let story = fs.readFileSync(opts.story, 'utf8')
tell(story, opts)