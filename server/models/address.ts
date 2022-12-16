/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 14:49:39
 * @LastEditTime: 2022-12-15 15:37:25
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import sequelize from "../config/sequelizeBase";
import Sequelize, { DataTypes } from 'sequelize'
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field:'user_id'
    // 定义user_id 为外键 关联userModel中的id
    // references:{
    //   model:userModel,
    //   key:'id'
    // }
  },
  address: {
    type: DataTypes.STRING
  }
},{
  paranoid:true,
  deletedAt:'status'
})

// addressModel.sync();

export default addressModel