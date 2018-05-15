# Any Page

> Any Page可以统一管理静态站点 上传一个站点的压缩包即可发布为一个线上站点

## 使用

1. 下载整个server目录
2. `npm i` 安装依赖
3. 在server目录下打开终端 执行`node app.js`
4. 在浏览器中访问

## 默认key

> 如果不慎把所有key删除 可以手动去 `/src/db/keys.json` 中加入

- `admin`

## 已被占用路由

> 以下路由已被占用

- `/admin`
- `/common`
- `/login`
- `/controller`

## 已知bug

- 当删掉一个站点后再添加一个与被删站点同样路由的一个新站点 重启服务才能正常访问新站点 因为前一个站点已经注册了相应路由的中间件 没有去除
