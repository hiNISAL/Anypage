const Router = require('koa-router');
const fs = require('fs');
const promisify = require('util').promisify;
const { resolve } = require('path');

const readFile = promisify(fs.readFile);

let userRouter = new Router({
  prefix: '/login'
});

userRouter.post('/', async ctx => {
  const fields = ctx.request.body;

  if (ctx.session.anypage) {
    ctx.body = {msg: '已登陆', status: true, data: {}};    
    return;
  }

  if (fields.key === 'aabbcc') {
    ctx.session.anypage = {
      uname: 'key'
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
