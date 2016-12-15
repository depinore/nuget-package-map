#!/usr/bin/env node
"use strict";
const argFns = require("./fns/Arguments");
const appEvents = require("./constants/events");
const index_1 = require("./index");
function help() {
    console.log('nuget-package-map <directory> [<thesePackagesOnly>] [--diag]');
    console.log("Both <directory> and <thesePackagesOnly> may be a comma-delimited list with no spaces.");
}
function parseArgs() {
    return {
        displayHelp: process.argv.length < 3,
        directories: argFns.toArrayArg(process.argv[2] || ''),
        specificPackages: argFns.toArrayArg(process.argv[3] || ''),
        diagnostic: process.argv.indexOf('--diag') > -1
    };
}
function output(o) {
    console.log(JSON.stringify(o, null, '\t'));
}
(function (config) {
    if (config.displayHelp)
        help();
    else {
        if (config.diagnostic)
            console.info(`[${new Date()}] Searching the directory tree...`);
        const results = index_1.main(config);
        if (config.diagnostic) {
            results.emitter.on(appEvents.fileParse, (fileName, index, count) => console.info(`[${new Date()}] (${index + 1}/${count}) Parsed ${fileName}`));
            results.emitter.on(appEvents.readComplete, () => console.info(`[${new Date()}] Analyzing packages...`));
            results.emitter.on(appEvents.analysisComplete, () => console.info(`[${new Date()}] Preparing output...`));
            results.emitter.on(appEvents.formatComplete, () => `[${new Date()}] Done!`);
        }
        results.promise.then(output);
    }
})(parseArgs());
