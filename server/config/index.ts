
/*
 * @Author: E-Dreamer
 * @Date: 2022-12-08 16:07:37
 * @LastEditTime: 2022-12-14 16:27:07
 * @LastEditors: E-Dreamer
 * @Description: 项目基本配置
 */
import path from "path";
const config = {
  //端口
  port: 3123,
  // jwt的secret`
  jwtSecret: "myJwtSecret",
  // jwt 白名单
  jwtWhiteList: [
    /^\/login/,
    /^\/code/,
    /^\/register/,
    /^\/swagger-html/,
    /^\/swagger-json/,
    /^\/users/,
    /^\/deleteUser/,
    /^\/ceshiQuery/,
    /^\/ceshi/,
    /^\/upload/
  ],
  // 日志保存的位置
  LogPath: path.resolve(__dirname, '../log/koa.log')
}

export const { port, jwtSecret, jwtWhiteList, LogPath } = config;

