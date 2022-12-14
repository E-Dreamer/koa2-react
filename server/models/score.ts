/*
 * @Author: E-Dreamer
 * @Date: 2022-12-14 15:57:34
 * @LastEditTime: 2022-12-14 15:59:03
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import sequelize from "../config/sequelizeBase";
import { DataTypes } from 'sequelize'
const scoreModel = sequelize.define('score', {
  c_id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  s_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  s_score: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "c_id" },
      ]
    },
  ]
})


export default scoreModel