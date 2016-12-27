#!/usr/bin/env node

import { AppConfiguration } from './models/AppConfiguration'
import * as argFns from './fns/Arguments';
import { VersionDependencyGraph } from './models/ProjectPackages'
import * as appEvents from './constants/events';
import { main } from './index'

function help() {
  console.log('nuget-package-map <directory> [<thesePackagesOnly>] [--diag]');
  console.log("Both <directory> and <thesePackagesOnly> may be a comma-delimited list with no spaces.")
}

function parseArgs(): AppConfiguration {
  return {
    displayHelp: process.argv.length < 3,
    directories: argFns.toArrayArg(process.argv[2] || ''),
    specificPackages: process.argv[3] !== '--diag' ? argFns.toArrayArg(process.argv[3] || ''): null,
    diagnostic: process.argv.indexOf('--diag') > -1
  }
}

function output(o: VersionDependencyGraph) {
  console.log(JSON.stringify(o, null, '\t'));
}

(function(config: AppConfiguration) {
  if(config.displayHelp)
    help();
  else {
      if(config.diagnostic)
        console.info(`[${new Date()}] Searching the directory tree...`)

      const results = main(config);

      if(config.diagnostic) {
        results.emitter.on(appEvents.fileParse, (fileName:string, index:number, count: number) => console.info(`[${new Date()}] (${index+1}/${count}) Parsed ${fileName}`))
        results.emitter.on(appEvents.readComplete, () => console.info(`[${new Date()}] Analyzing packages...`))
        results.emitter.on(appEvents.analysisComplete, () => console.info(`[${new Date()}] Preparing output...`))
        results.emitter.on(appEvents.formatComplete, () => `[${new Date()}] Done!`)
      }

      results.promise.then(output);
  }
})(parseArgs())