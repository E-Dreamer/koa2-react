/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 11:21:34
 * @LastEditTime: 2022-12-14 13:25:37
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
    //数据库全局配置
    define: {
      // 是否为表添加 createdAt 和 updatedAt 字段
      // createdAt 记录表的创建时间
      // updatedAt 记录字段更新时间
      timestamps: false,
      //是否冻结表名,最好设置为true，要不sequelize会自动给表名加上复数s造成查询数据失败。
      //推断表名称等于模型名称,而无需进行任何修改
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // 时区
    timezone: '+08:00'
  })
//测试连接是否正常
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