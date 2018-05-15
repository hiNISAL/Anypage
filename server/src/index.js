const Koa = require('koa');
const Body = require('koa-body');
const Route = require('koa-router');
const { resolve } = require('path')
const Session = require('koa-session');

const statics = require('./modules/statics');

const routerAdmin = require('./routes/admin/admin');
const routerCommon = require('./routes/common/common');
const routerLogin = require('./routes/login/login');

const sessionConfig = require('./config/session');

const app = new Koa();
const router = new Route();

app.keys = ['key of anypage'];

app.use(Session(sessionConfig, app));
app.use(Body({ multipart: true }));

statics(app);

app.use(async (ctx, next) => {
  if (ctx.request.path === '/') {
    this.status = 301;
    ctx.response.redirect('/controller');
    return;
  }
  await next();
});

app
  .use(routerLogin.routes())
  .use(routerLogin.allowedMethods())
  .use(routerAdmin.routes())
  .use(routerAdmin.allowedMethods())
  .use(routerCommon.routes())
  .use(routerCommon.allowedMethods());

module.exports = app;
