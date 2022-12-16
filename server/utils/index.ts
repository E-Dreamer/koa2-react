/*
 * @Author: E-Dreamer
 * @Date: 2022-12-12 13:41:05
 * @LastEditTime: 2022-12-15 16:58:14
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import fs from 'fs'
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
 * @description: 检查文件夹是否存在 不存在就创建
 * @param {string} dir 路径
 * @return {*}
 */
export function checkDirExist(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
/**
 * @description: 检查文件是否存在 不存在就创建
 * @param {string} file 文件路径
 * @return {*}
 */
export function checkFileAccess(file: string): void {
  try {
    fs.accessSync(file)
  } catch (err) {
    //追加内容 不存在文件会自动创建文件
    fs.appendFileSync(file, '', 'utf8')
  }
}

/**
 * @description: 上传函数
 * @param {string} path file path 文件路径
 * @param {string} name file name 文件名
 * @return {*}
 */
export function upload(dir: string, filepath: string, name: string) {
  checkDirExist(dir)
  // checkFileAccess(filepath);
  //创建可读流 highWaterMark 默认的文件大小为66k
  const render = fs.createReadStream(filepath, { highWaterMark: 1024 * 1024 });
  //创建可写流
  const upStream = fs.createWriteStream(`/uploads/${name}`)
  //可读流通过管道写入可写流
  render.pipe(upStream)
}