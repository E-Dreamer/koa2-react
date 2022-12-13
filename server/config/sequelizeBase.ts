/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 11:21:34
 * @LastEditTime: 2022-12-12 15:42:47
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { Sequelize } from 'sequelize'
import mysqlConf from './mysqlBase'

const sequelize = new Sequelize(
  mysqlConf.mysqlName,
  mysqlConf.mysqlUserName,
  mysqlConf.mysqlPassword,
  {
    host: mysqlConf.mysqlIp,
    port: mysqlConf.mysqlPort,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
const concent = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
concent()
export default sequelize