var removeTrailingSlash = (s: string) => s.replace(/(.*)[\/|\\]$/, '$1');
var nonEmptyString = s => Boolean(s);
var trim = s => s.trim();

export var toArrayArg = (s: string) => 
    s.split(',')
    .filter(nonEmptyString)
    .map(trim)
    .map(removeTrailingSlash);