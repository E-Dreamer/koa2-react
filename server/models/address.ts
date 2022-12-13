/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 14:49:39
 * @LastEditTime: 2022-12-13 09:47:46
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
addressModel.hasOne(userModel, {
  foreignKey: 'user_id'
})
export default addressModel