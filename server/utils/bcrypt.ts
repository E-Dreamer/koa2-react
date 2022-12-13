/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 13:03:51
 * @LastEditTime: 2022-12-12 13:05:16
 * @LastEditors: E-Dreamer
 * @Description: 登录密码加密和校验
 */
import bcrypt from 'bcryptjs'

const encrypt = (password: string):string => {
  let salt = bcrypt.genSaltSync(5)
  let hash = bcrypt.hashSync(password, salt)
  return hash
}

const decrypt = (password:string, hash:string) => {
  return bcrypt.compareSync(password, hash)
}

export {
  encrypt,
  decrypt
}