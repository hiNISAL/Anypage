const Router = require('koa-router');
const fs = require('fs');
const promisify = require('util').promisify;
const { resolve } = require('path');

const readFile = promisify(fs.readFile);

let commonRouter = new Router({
  prefix: '/common'
});

commonRouter.post('/sites', async cxt => {
  let db = {};
  try {
    db = JSON.parse(await readFile(resolve(__dirname, '../../db/sites.json'), 'utf-8'));
    console.log(db);
  } catch (e) {
    ctx.body = { data: {}, msg: '加载失败', status: false };
    console.log(e);
  }

  cxt.response.body = { data: db, msg: '加载成功', status: true };
});

module.exports = commonRouter;
