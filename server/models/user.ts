/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 15:27:27
 * @LastEditTime: 2022-12-13 09:51:34
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import sequelize from "../config/sequelizeBase";
import Sequelize from "sequelize";
import addressModel from "./address";
const userModel = sequelize.define('user', {
  id: {
    //数据类型 查看文档 https://www.sequelize.cn/core-concepts/model-basics#%E4%BD%BF%E7%94%A8-sequelizedefine
    type: Sequelize.INTEGER,
    //主键
    primaryKey: true,
    //不允许为null
    allowNull: false,
    //自增
    autoIncrement: true
    //对应的列名
    // field:''
  },
  username: {
    type:Sequelize.STRING,    
    validate:{
      is:/^\w_/g
    }
  },
  password: Sequelize.STRING
}, {
  paranoid: true,
  timestamps:true,
  deletedAt:'status',
  freezeTableName: true,
})
userModel.belongsTo(addressModel)
export default userModel

