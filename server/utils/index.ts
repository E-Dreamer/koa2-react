/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 13:41:05
 * @LastEditTime: 2022-12-12 13:53:53
 * @LastEditors: E-Dreamer
 * @Description: 
 */
export class Msg {
  /* code 1 为成功 -1为失败 */
  static success(msg: string, data?: object | string | number) {
    return {
      code: 1,
      msg: msg || '成功',
      data
    }
  }
  static error(msg: string) {
    return {
      code: -1,
      msg: msg || '失败'
    }
  }
}