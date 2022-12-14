/*
 * @Author: E-Dreamer
 * @Date: 2022-12-13 16:00:19
 * @LastEditTime: 2022-12-13 16:25:52
 * @LastEditors: E-Dreamer
 * @Description: 自动根据mysql数据库 生成model  但是需要安装mysql和sequelize-auto
 */
import mysqlConf from './mysqlBase'
import SequelizeAuto, { AutoOptions } from 'sequelize-auto'

const options: AutoOptions = {
  singularize: true,
  useDefine:true,
  host: mysqlConf.mysqlIp,
  dialect: 'mysql',
  port: mysqlConf.mysqlPort,
  directory: './server/modelsAuto'
}

const auto = new SequelizeAuto(mysqlConf.mysqlName, mysqlConf.mysqlUserName, mysqlConf.mysqlPassword as string, options)

auto.run().then(res => {
  console.log('运行成功');
}).catch(err => {
  throw err;
})