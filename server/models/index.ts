/*
 * @Author: E-Dreamer
 * @Date: 2022-12-14 10:13:02
 * @LastEditTime: 2022-12-14 15:59:30
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import userModel from "./user";
import addressModel from "./address";
import scoreModel from "./score";
//注意 关联不能放置在 声明model 文件中  否则会报错显示不在sequelize.model的子类
userModel.hasOne(addressModel, {
  as: 'address_content',
  foreignKey:'user_id'
})
userModel.hasMany(scoreModel,{
  as:'score_content',
  foreignKey:'user_id'
})
//foreignKey: 在address表中创建 'user_id' 外键
addressModel.belongsTo(userModel, {
  foreignKey: 'user_id'
})

scoreModel.belongsTo(userModel,{
  foreignKey: 'user_id'
})

export {
  userModel,
  addressModel,
  scoreModel
}