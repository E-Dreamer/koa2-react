/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 13:29:39
 * @LastEditTime: 2022-12-13 13:15:07
 * @LastEditors: E-Dreamer
 * @Description: koa-cors 参数
 */
import { Options } from '@koa/cors'
const CorsConfig: Options = {
  origin: function (ctx) {
    return '*'
  },
  exposeHeaders: ['Authorization'],
  maxAge: 5 * 24 * 60 * 60,
  allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}
export default CorsConfig