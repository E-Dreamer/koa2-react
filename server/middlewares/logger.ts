import { Context, Next } from 'koa';
/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 13:54:48
 * @LastEditTime: 2022-12-09 16:28:05
 * @LastEditors: E-Dreamer
 * @Description: log4js node日志
 */
import log4js from 'log4js'
import fs from 'fs'
import path from 'path'
import { LogPath } from '../config/index'

//判断是否存在log文件夹 没有就创建
const logsDir = path.parse(LogPath).dir;
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

log4js.configure({
  appenders: {
    console: { type: 'console' },
    dateFile: {
      type: 'dateFile',
      filename: LogPath,
      pattern: '-yyyy-MM-dd',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'dateFile'],
      level: 'error',
    },
  },
})

export const logger = log4js.getLogger('[Default]')

// logger中间件
export const loggerMiddleware = async (ctx: Context, next: Next) => {
  // 请求开始时间
  const start = +new Date()
  await next()
  // 结束时间
  const ms = +new Date() - start
  // 打印出请求相关参数
  const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
  const logText = `${ctx.method} ${ctx.status} ${ctx.url
    } 请求参数： ${JSON.stringify(ctx.request.body)}  响应参数： ${JSON.stringify(
      ctx.body
    )} - ${remoteAddress} - ${ms}ms`
  logger.info(logText)
}
