/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 13:41:05
 * @LastEditTime: 2022-12-19 13:39:23
 * @LastEditors: E-Dreamer
 * @Description: 
 */
/**
 * @description: 返回给前端的消息封装
 * @return {*}
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

/**
 * @description: 时间转换成日期格式
 * @param {string} fmt yyyy-mm-dd
 * @param {any} date
 * @return {*}
 */
export function dateFormart(fmt: string, date: any = new Date()) {
  let o: { [key: string]: string } = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    const ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (o[k] as string) : (o[k].toString().padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

/**
 * @description: 生成随机字符串给文件命名
 * @param {number} length 生成字符串的长度
 * @return {*}
 */
export function randomStr(length: number = 16): string {
  const seeder = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  let str = ''
  for (let i = 0; i < length; i++) {
    str += seeder.charAt(Math.floor(Math.random() * seeder.length))
  }
  str += String(new Date().getTime()) // 获取时间戳
  return str
}
/**
 * @description: 判断是否为json
 * @param {string} str
 * @return {*}
 */
export function isJSON(str: string) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
}

