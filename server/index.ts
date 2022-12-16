/*
 * @Author: E-Dreamer
 * @Date: 2022-12-08 14:48:57
 * @LastEditTime: 2022-12-15 16:28:43
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import Koa, { DefaultState, DefaultContext } from 'koa'
import { jwtSecret, jwtWhiteList, port } from './config/index'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import corsConfig from './middlewares/cors'
import router from './router/index'
import jwt from 'koa-jwt'
import './config/sequelizeBase'
import path from 'path'
import Session from 'koa-session'
import koaStatic from 'koa-static'
import { errorHandler, responseHandler } from './middlewares/response'
import { loggerMiddleware } from './middlewares/logger'
const app: Koa<DefaultState, DefaultContext> = new Koa()

const CONFIG = {
  key: 'sessionId',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false,
  // store: sessionStore,
}
app.use(Session(CONFIG, app))
app.use(koaStatic(path.join(__dirname, './uploads')))
//解决跨域
app.use(KoaCors(corsConfig))
app.use(KoaBody({
  // 支持文件格式
  multipart: true,
  formidable: {
    // 上传目录
    uploadDir: path.join(__dirname, './uploads'),
    // 保留文件扩展名
    keepExtensions: true,
    //上传最大限制
    // maxFieldsSize:
    onFileBegin(name, file) {
      console.log('name', name);
      console.log('file', file.toJSON());
    }
  },
  onError(err) {
    console.log('error', err);
  }
}))
// 对于任何请求，app将调用该异步函数处理请求：
//error handle
app.use(errorHandler)

//log中间件
app.use(loggerMiddleware)

//jwt放在路由前面
app.use(jwt({
  secret: jwtSecret
}).unless({
  path: jwtWhiteList
}))
//路由
app.use(router.routes()).use(router.allowedMethods())

app.use(responseHandler)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
