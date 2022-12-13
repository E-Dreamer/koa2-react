/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 14:49:39
 * @LastEditTime: 2022-12-13 13:08:03
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import sequelize from "../config/sequelizeBase";
import Sequelize, { DataTypes } from 'sequelize'
import userModel from "./user";
const addressModel = sequelize.define('address', {
  id: {
    type: Sequelize.INTEGER,
    //主键
    primaryKey: true,
    //不允许为null
    allowNull: false,
    //自增
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING
  }
})
// addressModel.belongsTo(userModel) // 在address表中创建 'user_id' 外键
export default addressModel