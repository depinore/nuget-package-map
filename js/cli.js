#!/usr/bin/env node
"use strict";
const argFns = require("./fns/Arguments");
const index_1 = require("./index");
function help() {
    console.log('nuget-package-map <directory> [<thesePackagesOnly>]');
    console.log("Both <directory> and <thesePackagesOnly> may be a comma-delimited list with no spaces.");
}
function parseArgs() {
    return {
        displayHelp: process.argv.length < 3,
        directories: argFns.toArrayArg(process.argv[2] || ''),
        specificPackages: argFns.toArrayArg(process.argv[3] || '')
    };
}
(function (config) {
    config.displayHelp ? help() : index_1.main(config);
})(parseArgs());
