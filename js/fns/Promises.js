"use strict";
exports.flatten = (promises) => promises.reduce((allPromises, p) => allPromises.concat([p]), []);
