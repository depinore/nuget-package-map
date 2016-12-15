#!/usr/bin/env node

import { AppConfiguration } from './models/AppConfiguration'
import * as argFns from './fns/Arguments';
import { main } from './index'

function help() {
  console.log('nuget-package-map <directory> [<thesePackagesOnly>]');
  console.log("Both <directory> and <thesePackagesOnly> may be a comma-delimited list with no spaces.")
}

function parseArgs(): AppConfiguration {
  return {
    displayHelp: process.argv.length < 3,
    directories: argFns.toArrayArg(process.argv[2] || ''),
    specificPackages: argFns.toArrayArg(process.argv[3] || '')
  }
}



(function(config: AppConfiguration) {
  config.displayHelp ? help() : main(config)
})(parseArgs())