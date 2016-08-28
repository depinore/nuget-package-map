import * as _ from 'lodash'
import * as models from '../models/projectPackages'

export function getPackageVersions(projects: models.Project[]) {
    var allPackages = _.flatten(projects.map(project => project.packages.package.map(p => p.$)))
    return getVersionDictionary(getPackageDictionary(allPackages))
}
function getVersionDictionary(packageDictionary: _.Dictionary<models.Package[]>) {
    var versionDictionary: { [packageName: string]: string[] } = {};

    Object.keys(packageDictionary).forEach(packageName => 
        versionDictionary[packageName] = packageDictionary[packageName].map(p => p.version));

    return versionDictionary;
}
function getPackageDictionary(allPackages: models.Package[]) {
    return _.groupBy(_.uniqBy(allPackages, p => `${p.id}>${p.version}`), 'id')
}