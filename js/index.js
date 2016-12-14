#!/usr/bin/env node
"use strict";
const xml2js = require('xml2js');
const bluebird = require('bluebird');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
//fns
const argFns = require('./fns/Arguments');
const packageFns = require('./fns/Package');
//will complete when all packages.config files have been read in this directory.
function inspectDirectory(directory, currentIndex, allDirectories) {
    return (Promise.all(glob.sync(`${directory}/**/packages.config`).map(readConfig)));
}
function readConfig(fileName) {
    return (bluebird.promisify(xml2js.parseString)(fs.readFileSync(fileName, 'utf8')));
}
function output(o) {
    console.log(JSON.stringify(o, null, '\t'));
}
function help() {
    console.log('packagemap <directory> [<packages>]');
    console.log("Both directory and packages may be a comma-delimited list with no spaces.");
}
function parseArgs() {
    return {
        displayHelp: process.argv.length < 3,
        directories: argFns.toArrayArg(process.argv[2] || ''),
        specificPackages: argFns.toArrayArg(process.argv[3] || '')
    };
}
function main(config) {
    var allDirectoryProjects = []; //each directory can have multiple projects; we are allowing for multiple root directories.
    Promise.all(config.directories.map(inspectDirectory))
        .then((responses) => {
        output(packageFns.getPackageVersions((_.flatten(responses)), config.specificPackages));
    });
}
exports.main = main;
;
(function (config) {
    config.displayHelp ? help() : main(config);
})(parseArgs());
