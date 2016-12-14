import * as _ from 'lodash'
import * as models from '../models/projectPackages'

//if specificPackages were specified, then ensure that the packages we're looking at appear in there.  Not case sensitive.
const isWithinSpecificPackages = (specificPackages: string[], p: models.Package) => 
    specificPackages && specificPackages.length 
        ? specificPackages.map(s => s.toLowerCase()).indexOf(p.id.toLowerCase()) > -1  //case-insensitive match based on the package id. 
        : true;//if no specific packages were specified, then it just lets it pass.

export function getPackageVersions(projects: models.Project[], specificPackages?: string[]) {
    const packages = projects.map(project => (project.packages.package || []).map(p => p.$));

    var allPackages = _.flatten(packages)
                        .filter(_.partial(isWithinSpecificPackages, specificPackages))//filter out to just specific packages if we specified some.
    return getVersionDictionary(groupPackagesById(allPackages))  //group the packages into an id -> version dictionary.
}

//creates a { [packageId]: packageVersion[] } dictionary, where referencing a specific package id will return a list of version id strings.
function getVersionDictionary(packageDictionary: _.Dictionary<models.Package[]>) {
    var versionDictionary: { [packageName: string]: string[] } = {};

    Object.keys(packageDictionary).forEach(packageName => 
        versionDictionary[packageName] = packageDictionary[packageName].map(p => p.version));

    return versionDictionary;
}

//groups packages up by their id
function groupPackagesById(allPackages: models.Package[]) {
    return _.groupBy(_.uniqBy(allPackages, p => `${p.id}>${p.version}`), 'id')
}
