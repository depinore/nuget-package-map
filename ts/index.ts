import * as events from 'events';

//lib
import * as xml2js from 'xml2js';
import * as bluebird from 'bluebird';
import * as fs from 'fs';
import * as glob from 'glob';
import * as _ from 'lodash';

//models
import { Project, VersionDependencyGraph } from "./models/ProjectPackages";
import { AppConfiguration } from './models/AppConfiguration';

//const
import * as appEvents from './constants/events';

//fns
import * as packageFns from './fns/Package';

//will complete when all packages.config files have been read in this directory.
function inspectDirectory(emitter: NodeJS.EventEmitter, directory: string, currentIndex: number, allDirectories: string[]) {
  var fileNames = glob.sync(`${directory}/**/packages.config`);
  
  return (Promise.all(fileNames
                        .map(_.partial(readConfig, emitter))))
                        .then(result => {
                            emitter.emit(appEvents.readComplete);
                            return result;
                        })
}

function readConfig(emitter: NodeJS.EventEmitter, fileName: string, index: number, allfiles: string[]) {
  return <PromiseLike<Project>>(bluebird.promisify<Project, string>(xml2js.parseString)(fs.readFileSync(fileName, 'utf8')))
        .then(results => {
          emitter.emit(appEvents.fileParse, fileName, index, allfiles.length)
          return results;
        })
}

//spits out a promise and an event emitter, so that you can watch its progress
//listening for "formatting-complete" and watching the promise are equivalent.
export function main(config: AppConfiguration): { promise: PromiseLike<VersionDependencyGraph>, emitter: NodeJS.EventEmitter } {
  var allDirectoryProjects: Project[] = [];//each directory can have multiple projects; we are allowing for multiple root directories.
  var emitter = new events.EventEmitter();

  return {
    promise: Promise.all(config.directories.map(_.partial(inspectDirectory, emitter)))
                .then((responses: any) => 
                            packageFns.getPackageVersions(<Project[]>(_.flatten(responses)), 
                            () => emitter.emit(appEvents.analysisComplete), 
                            config.specificPackages)),
    emitter: emitter
  }
};
