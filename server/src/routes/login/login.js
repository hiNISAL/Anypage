const Router = require('koa-router');
const fs = require('fs');
const promisify = require('util').promisify;
const { resolve } = require('path');

const readFile = promisify(fs.readFile);

let userRouter = new Router({
  prefix: '/login'
});

userRouter.post('/', async ctx => {

  let keys = {};
  try {
    keys = JSON.parse(await readFile(resolve(__dirname, '../../db/keys.json'), 'utf-8'));
  } catch(e) {
    console.log(e);
    ctx.body = {msg: '未知错误', status: false, data: {}};
    return;
  }

  const fields = ctx.request.body;

  if (ctx.session.anypage) {
    ctx.body = {msg: '已登陆', status: true, data: {}};    
    return;
  }

  if (keys.keys.some( key => key === fields.key )) {
    ctx.session.anypage = {
      uname: String(Math.random() * 1000)
    }
    ctx.body = {msg: '登陆成功', status: true, data: {}};
    return;
  }
  ctx.body = {msg: '登陆失败', status: false, data: {}};
});

userRouter.post('/check', async ctx => {
  if (ctx.session.anypage) {
    ctx.body = {msg: '已登陆', status: true, data: {}};    
    return;
  }
  ctx.body = {msg: '未登录', status: false, data: {}};    
});

module.exports = userRouter;
