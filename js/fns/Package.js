"use strict";
const _ = require('lodash');
function getPackageVersions(projects) {
    var allPackages = _.flatten(projects.map(project => project.packages.package.map(p => p.$)));
    return getVersionDictionary(getPackageDictionary(allPackages));
}
exports.getPackageVersions = getPackageVersions;
function getVersionDictionary(packageDictionary) {
    var versionDictionary = {};
    Object.keys(packageDictionary).forEach(packageName => versionDictionary[packageName] = packageDictionary[packageName].map(p => p.version));
    return versionDictionary;
}
function getPackageDictionary(allPackages) {
    return _.groupBy(_.uniqBy(allPackages, p => `${p.id}>${p.version}`), 'id');
}
