export interface Project {
    //the structure of a Project generated by xml2js makes very little sense...but XML to JSON conversion is difficult so hey.
    packages: {
        package: {
            '$': Package
        }[]
    }
}
export interface Package {
    id: string;
    version: string;
    targetFramework: string;
}
export interface VersionDependencyGraph {
    [packageName: string]: string[]
}