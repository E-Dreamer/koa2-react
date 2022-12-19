/*
 * @Author: E-Dreamer
 * @Date: 2022-12-08 14:48:57
 * @LastEditTime: 2022-12-19 13:24:46
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import Koa, { DefaultState, DefaultContext } from 'koa'
import { jwtSecret, jwtWhiteList, port, uploadPath } from './config/index'
import KoaCors from '@koa/cors'
import KoaBody from 'koa-body'
import corsConfig from './middlewares/cors'
import router from './router/index'
import jwt from 'koa-jwt'
import './config/sequelizeBase'
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
app.use(koaStatic(uploadPath))
//解决跨域
app.use(KoaCors(corsConfig))
app.use(KoaBody({
  // 支持文件格式
  multipart: true,
  formidable: {
    // 上传目录
    uploadDir: uploadPath,
    // 保留文件扩展名
    keepExtensions: true,
    //上传最大限制
    // maxFieldsSize:
    onFileBegin(name, file) {
      console.log('name', name);
      console.log('file', file.toJSON());
    }
  },
  onError(err, ctx) {
    ctx.body = { code: -1, msg: err || '上传失败' }
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