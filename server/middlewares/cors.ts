/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 13:29:39
 * @LastEditTime: 2022-12-09 13:33:28
 * @LastEditors: E-Dreamer
 * @Description: koa-cors 参数
 */
import { Request } from "koa"

const CorsConfig = {
  origin: (request: Request) => '*',
  expose: ['Authorization'],
  maxAge: 5 * 24 * 60 * 60,
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  headers: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}
export default CorsConfig