/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 10:36:10
 * @LastEditTime: 2022-12-09 16:08:40
 * @LastEditors: E-Dreamer
 * @Description: mysql基本配置
 */

type NodeEnv = {
  /**
   *数据库名
   * @type {string}
   */
  mysqlName: string
  /**
   *数据库用户名
   * @type {string}
   */
  mysqlUserName: string
  /**
   *数据库用户密码
   * @type {string}
   */
  mysqlPassword?: string
  /**
   *mysql部署的机器IP
   * @type {string}
   */
  mysqlIp?: string
  /**   
  *mysql部署的机器端口
  */
  mysqlPort?: number
}

//测试环境连接池
const development: NodeEnv = {
  mysqlName: 'ceshi',
  mysqlUserName: 'root',
  mysqlPassword: '',
  mysqlPort: 3306,
  mysqlIp: '127.0.0.1'
}
//正式环境连接池
const production: NodeEnv = {
  mysqlName: 'ceshi',
  mysqlUserName: 'root',
  mysqlPassword: '',
  mysqlPort: 3306,
  mysqlIp: '127.0.0.1'
}
const mysql: NodeEnv = {
  development,
  production
}[process.env.NODE_ENV || 'development']!

export default mysql