const Router = require('koa-router');
const fs = require('fs');
const { resolve } = require('path');
const promisify = require('util').promisify;
const Static = require('koa-static-server');

const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');

const { deleteFolder, unziper, streamSync } = require('../../utils/utils');

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);

const dbPath = resolve(__dirname, '../../db/sites.json');

let adminRouter = new Router({
  prefix: '/admin'
});

const rollBack = async (filePath, newFileName) => {
  await unlink(filePath);
  setTimeout(() => {
    deleteFolder(resolve(__dirname, `../../temp/${ newFileName }`));
  });
}

const getResData = (data, msg = '', status = false) => ({ data, msg, status });

const isLoged = async (ctx, next) => {
  if (!ctx.session.anypage) {
    ctx.body = { status: false, msg: '未登陆' };
    return;
  }
  await next();
};

adminRouter.post('/create/site', isLoged, async ctx => {
  // 缓存目录
  const tmpdir = resolve(__dirname, '../../temp');
  // 获取文件信息
  const file = ctx.request.body.files.site;
  // 获取其他字段
  const fields = ctx.request.body.fields;
  fields.useConfig = fields.useConfig === 'true';

  // 获取文件名
  const fileName = file.name;
  // 新的文件名
  const newFileName = `${ +new Date() }${ Math.random().toString(36).substring(2) }`;
  // 要被保存的文件路径
  const filePath = resolve(tmpdir, newFileName + '.zip');

  try {
    // 将文件保存到缓存目录
    await streamSync(file.path, filePath);
  } catch (e) {
    console.log(e);
  }

  // 解压目录
  const unzipDir = resolve(__dirname, `../../temp/${ newFileName }`)
  try {
    // 创建解压目录
    await mkdir(unzipDir);
  } catch (e) {
    ctx.body = getResData({}, '创建目录失败');
    return;
  }

  try {
    // 解压
    await decompress(filePath, unzipDir);
  } catch (e) {
    await rollBack(filePath, newFileName);
    ctx.body = getResData({}, '解压失败');
    return;
  }

  try {
    const res = await readdir(resolve(__dirname, `../../temp/${ newFileName }`))
    if (res.length === 0) {
      await rollBack(filePath, newFileName);
      ctx.body = getResData({}, '解压失败');
      return;
    }
  } catch (e) {
    console.log(e);
  }

  let siteConfig = {};
  try {
    console.log(fields)
    if (fields.useConfig) {
      siteConfig = JSON.parse(await readFile(`${unzipDir}/site.json`, 'utf-8'));
      await unlink(`${unzipDir}/site.json`);
    } else {
      siteConfig = {
        title: fields.title,
        cover: fields.cover,
        desc: fields.desc,
        route: fields.route,
        useConfig: fields.useConfig
      }
    }
    siteConfig.fileName = fileName;
    siteConfig.folderName = newFileName;

    if (siteConfig.title === '') siteConfig.title = newFileName;
    if (siteConfig.route === '') siteConfig.route = newFileName;
    if (siteConfig.cover === '') siteConfig.cover = '/publicresource/cover/loading.gif';

    // fs.writeFile(resolve(__dirname, `${unzipDir}/site.json`), JSON.stringify(siteConfig));
  } catch (e) {
    await rollBack(filePath, newFileName);    
    ctx.body = getResData({}, '配置文件不存在');
    console.log(e);
    return;
  }

  let db = {};
  try {
    db = JSON.parse(await readFile(dbPath, 'utf-8'));
  } catch (e) {
    await rollBack(filePath, newFileName);    
    ctx.body = getResData({}, '读取数据库失败');
    return;
  }

  if (db.sites.some(site => site.route === siteConfig.route)) {
    await rollBack(filePath, newFileName);    
    ctx.body = getResData({}, `路由 ${ siteConfig.route } 已被占用`);
    return;
  }

  db.sites.push(siteConfig);

  try {
    fs.writeFile(dbPath, JSON.stringify(db));
  } catch (e) {
    await rollBack(filePath, newFileName);    
    ctx.body = getResData({}, '保存站点信息失败');
  }

  // 移动文件夹
  const newPath = resolve(__dirname, `../../sites/${ newFileName }`);
  try {
    await rename(unzipDir, newPath);
    await unlink(filePath);
  } catch (e) {
    await rollBack(filePath, newFileName);
    ctx.body = getResData({}, '站点移动失败');
    console.log(e);
  }

  ctx.app.use(Static({
    rootDir: resolve(__dirname, newPath),
    rootPath: siteConfig.route
  }));

  ctx.body = getResData({ route: siteConfig.route }, '添加站点成功', true);
});

adminRouter.post('/delete/site', isLoged, async ctx => {
  const fields = ctx.request.body;

  let db = {};
  try {
    db = JSON.parse(await readFile(dbPath, 'utf-8'));
  } catch (e) {
    ctx.body = getResData({}, '删除失败');
    return;
  }

  let index = db.sites.findIndex(site => site.folderName === fields.id);

  if (index === -1) {
    ctx.body = getResData({}, '该站点不存在');
    return;
  } else {
    db.sites.splice(index, 1);
  }

  try {
    fs.writeFile(dbPath, JSON.stringify(db));
  } catch (e) {
    ctx.body = getResData({}, '删除失败');
  }

  deleteFolder(resolve(__dirname, `../../sites/${ fields.id }`))

  ctx.body = getResData({}, '删除成功', true);
});

module.exports = adminRouter;
