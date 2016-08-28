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
var inspectDirectory = (directory, currentIndex, allDirectories) => (Promise.all(glob.sync(`${directory}/**/packages.config`).map(readConfig))); //will complete when all packages.config files have been read in this directory.
var readConfig = (fileName) => (bluebird.promisify(xml2js.parseString)(fs.readFileSync(fileName, 'utf8')));
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
function main(rootDirectories) {
    var allDirectoryProjects = []; //each directory can have multiple projects; we are allowing for multiple root directories.
    Promise.all(rootDirectories.map(inspectDirectory))
        .then((responses) => {
        output(packageFns.getPackageVersions((_.flatten(responses))));
    });
}
exports.main = main;
;
(function (config) {
    config.displayHelp ? help() : main(config.directories);
})(parseArgs());
