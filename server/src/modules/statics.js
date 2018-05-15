const Static = require('koa-static-server');
const { resolve } = require('path');

const sites = require('../db/sites.json');

let resource = [
  [resolve(__dirname, '../public/'), '/controller']
];

sites.sites.forEach(site => resource.push([resolve(__dirname, `../sites/${ site.folderName }`), site.route]))

module.exports = app => {
  for (let [i, v] of resource.entries()) {
    app.use(Static({
      rootDir: v[0],
      rootPath: v[1]
    }));
  }
};
