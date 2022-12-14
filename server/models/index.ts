/*
 * @Author: E-Dreamer
 * @Date: 2022-12-14 10:13:02
 * @LastEditTime: 2022-12-14 13:48:30
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import userModel from "./user";
import addressModel from "./address";
//注意 关联不能放置在 声明model 文件中  否则会报错显示不在sequelize.model的子类
userModel.hasOne(addressModel)
//foreignKey: 在address表中创建 'user_id' 外键
addressModel.belongsTo(userModel, {
  as: 'address_content',
  foreignKey: 'user_id'
})

export {
  userModel,
  addressModel
}