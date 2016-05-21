#! /usr/bin/env node
'use strict'

const fs = require('fs')
const nanalang = require('./nanalang.js')
const opts = require('nomnom')
  .script('nanalang')
  .options({
    loli: {
      position: 0,
      help: 'Path to .loli file'
    }
  })
  .option('version', {
    abbr: 'v',
    flag: true,
    help: 'Print version number & exit',
    callback: function() {
      return 'Nanalang v' + require('../package.json').version
    }
  })
  .option('dev', {
    abbr: 'd',
    flag: true,
    help: 'Force re-compilation of grammar'
  })
  .option('nojs', {
    flag: true,
    hidden: true
  })
  .option('tree', {
    abbr: 't',
    flag: true,
    help: 'Print source tree (helpful for debugging)'
  })
  /*
  .option('grammar', {
    abbr: 'g',
    help: 'file to act as story grammar'
  })
  */
.nom()

let loli = fs.readFileSync(opts.loli, 'utf8')
nanalang(loli, opts)