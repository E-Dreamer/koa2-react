/*
 * @Author: E-Dreamer
 * @Date: 2022-12-09 13:50:52
 * @LastEditTime: 2022-12-12 10:23:21
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import { jwtSecret } from "../../config"
import jsonwebtoken from 'jsonwebtoken'
export interface UserParams {
  username: string,
  name?: string,
  avatar?: string,
  email?: string,
  phone?: number,
  accessToken?: string
}
export default class JwtAuth {
  /**
    * 获取用户token
    * @static
    * @param {UserParams} userData
    * @param {*} [options]
    * @return {*}  {string}
    * @memberof JwtAuth
    */
  static signUserToken(userData: UserParams, options?: any): string {
    try {
      return jsonwebtoken.sign(userData, jwtSecret, options)
    } catch (err) {
      console.log(err);
      return ''
    }
  }
  /**
   * 验证用户token值
   * @static
   * @param {string} token
   * @return {*}  {Object}
   * @memberof JwtAuth
   */
  static verifyUserToken(token: string): string | jsonwebtoken.JwtPayload {
    try {
      // const authorization = token && token.split(' ')[1]
      const authorization = token.replace("Bearer ", "")
      return jsonwebtoken.verify(authorization, jwtSecret)
    } catch (err) {
      console.log(err);
      throw ({ code: 401, message: 'no authorization' })
    }
  }
}