const Static = require('koa-static-server');
const { resolve } = require('path');

let resource = [
  ['/public', '/publicresource']
]

module.exports = app => {
  for (let [i, v] of resource.entries()) {
    app.use(Static({
      rootDir: resolve(__dirname, `../${ v[0] }`),
      rootPath: v[1]
    }));
  }
};
