"use strict";
var removeTrailingSlash = (s) => s.replace(/(.*)[\/|\\]$/, '$1');
var nonEmptyString = s => Boolean(s);
var trim = s => s.trim();
exports.toArrayArg = (s) => s.split(',')
    .filter(nonEmptyString)
    .map(trim)
    .map(removeTrailingSlash);
