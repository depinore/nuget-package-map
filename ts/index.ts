#!/usr/bin/env node

//lib
import * as xml2js from 'xml2js';
import * as bluebird from 'bluebird';
import * as fs from 'fs';
import * as glob from 'glob';
import * as _ from 'lodash';

//models
import { Project } from "./models/ProjectPackages";
import { AppConfiguration } from './models/AppConfiguration';

//fns
import * as argFns from './fns/Arguments';
import * as packageFns from './fns/Package';

//will complete when all packages.config files have been read in this directory.
function inspectDirectory(directory: string, currentIndex: number, allDirectories: string[]) {
  return (Promise.all(glob.sync(`${directory}/**/packages.config`).map(readConfig)))
}

function readConfig(fileName: string) {
 return <PromiseLike<Project>>(bluebird.promisify<Project, string>(xml2js.parseString)(fs.readFileSync(fileName, 'utf8')))
}

function output(o: Object) {
  console.log(JSON.stringify(o, null, '\t'));
}
function help() {
  console.log('packagemap <directory> [<packages>]');
  console.log("Both directory and packages may be a comma-delimited list with no spaces.")
}

function parseArgs(): AppConfiguration {
  return {
    displayHelp: process.argv.length < 3,
    directories: argFns.toArrayArg(process.argv[2] || ''),
    specificPackages: argFns.toArrayArg(process.argv[3] || '')
  }
}

export function main(config: AppConfiguration) {
  var allDirectoryProjects: Project[] = [];//each directory can have multiple projects; we are allowing for multiple root directories.

  Promise.all(config.directories.map(inspectDirectory))
    .then((responses: any) => {
      output(packageFns.getPackageVersions(<Project[]>(_.flatten(responses)), config.specificPackages));
    })
};

(function(config: AppConfiguration) {
  config.displayHelp ? help() : main(config)
})(parseArgs())
