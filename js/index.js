"use strict";
const events = require("events");
//lib
const xml2js = require("xml2js");
const bluebird = require("bluebird");
const fs = require("fs");
const glob = require("glob");
const _ = require("lodash");
//const
const appEvents = require("./constants/events");
//fns
const packageFns = require("./fns/Package");
//will complete when all packages.config files have been read in this directory.
function inspectDirectory(emitter, directory, currentIndex, allDirectories) {
    var fileNames = glob.sync(`${directory}/**/packages.config`);
    return (Promise.all(fileNames
        .map(_.partial(readConfig, emitter))))
        .then(result => {
        emitter.emit(appEvents.readComplete);
        return result;
    });
}
function readConfig(emitter, fileName, index, allfiles) {
    return (bluebird.promisify(xml2js.parseString)(fs.readFileSync(fileName, 'utf8')))
        .then(results => {
        emitter.emit(appEvents.fileParse, fileName, index, allfiles.length);
        return results;
    });
}
//spits out a promise and an event emitter, so that you can watch its progress
//listening for "formatting-complete" and watching the promise are equivalent.
function main(config) {
    var allDirectoryProjects = []; //each directory can have multiple projects; we are allowing for multiple root directories.
    var emitter = new events.EventEmitter();
    return {
        promise: Promise.all(config.directories.map(_.partial(inspectDirectory, emitter)))
            .then((responses) => packageFns.getPackageVersions((_.flatten(responses)), () => emitter.emit(appEvents.analysisComplete), config.specificPackages)),
        emitter: emitter
    };
}
exports.main = main;
;
