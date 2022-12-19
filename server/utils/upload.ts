/*
 * @Author: E-Dreamer
 * @Date: 2022-12-16 10:50:39
 * @LastEditTime: 2022-12-19 14:56:00
 * @LastEditors: E-Dreamer
 * @Description: 封装upload控制器
 */
import { Msg, dateFormart, randomStr, isJSON } from './index';
import fs from 'fs'
import path from 'path'
import { uploadPath } from '../config';

interface myFile {
  filepath: string,
  originalFilename: string,
  mimetype: string,
  newFilename: string
}

const maxFileSize = 100 * 1024 * 1024;
export default class UploadController {
  //上传多文件
  static uploadfiles(ctx: any) {
    // 获取上传文件
    const files = ctx.request.files?.file
    const originUrl = ctx.origin;
    if (!files) {
      ctx.status = 500;
      ctx.body = Msg.error('上传文件不能为空')
      return
    }
    let filePathArr: string[] = []
    if (!Array.isArray(files)) {
      if (!validateFileType(files)) {
        return ctx.body = Msg.error('非法文件类型')
      }
      if (files.size > maxFileSize) {
        return ctx.body = Msg.error(`文件类型超过${maxFileSize / Math.pow(2, 20)}M`)
      }
      const filePath = saveFileThis(files)
      filePathArr.push(originUrl + filePath)
    } else {
      let errArr = []
      for (let file of files) {
        if (!validateFileType(file)) {
          errArr.push('非法文件类型')
          continue
        }
        if (file.size > maxFileSize) {
          errArr.push(`文件大小超过${maxFileSize / Math.pow(2, 20)}M`)
          continue;
        }
      }
      if (errArr.length > 0) {
        return ctx.body = Msg.error(JSON.stringify(errArr))
      }
      for (let file of files) {
        const filePath = saveFileThis(file)
        filePathArr.push(originUrl + filePath)
      }
    }

    ctx.status = 200;
    ctx.body = Msg.success('上传成功', filePathArr)
  }

  static deletefiles(ctx: any) {
    const queryPath = ctx.request.body.path || ''
    if (!queryPath) {
      return ctx.body = Msg.error('路径不能为空')
    }
    const pathArr = isJSON(queryPath) ? JSON.parse(queryPath) : []
    if (!Array.isArray(pathArr) || pathArr.length === 0) {
      ctx.body = Msg.error('路径不正确')
      return;
    }
    let dataArr = []
    for (let val of pathArr) {
      if (!/^\/uploads\//.test(val)) {
        dataArr.push('路径不正确')
        continue;
      }
      const pathTarget = path.join(__dirname, '../', 'uploads', val)
      if (fs.existsSync(pathTarget)) {
        // 如果是目录就返回true 否则就是false
        if (fs.statSync(pathTarget).isDirectory()) {
          dataArr.push('文件路径有误')
          continue;
        } else {
          //删除文件操作。
          fs.unlinkSync(pathTarget)
          dataArr.push('删除成功')
          continue;
        }
      } else {
        dataArr.push('文件不存在')
        continue;
      }
    }
    ctx.body = Msg.success('删除成功', dataArr)
  }

  // 分片上传大文件
  static uploadfilebig(ctx: any) {
    const file = ctx.request.files?.file;//获取上传文件
    const index = ctx.request.body.index // 上传文件的 序号
    if (!file) {
      ctx.status = 500;
      ctx.body = Msg.error('上传文件不能为空')
      return
    }
    if (!index) {
      ctx.status = 500;
      ctx.body = Msg.error('文件序号不能为空')
      return
    }
    if (Array.isArray(file)) {
      ctx.status = 500
      ctx.body = Msg.error('仅支持单文件上传')
    }
    const render = fs.createReadStream(file.filepath);

    //  const nameMd5 = md5(files.originalFilename); // md5加密后的文件名

    const lastDir = path.join(__dirname, `../uploads/bigfile/${file.originalFilename}`)
    // const lastDir = path.join(__dirname, '../..', `static/upload/bigfile/${nameMd5}`);
    checkDirExist(lastDir)
    const filepath = `uploads/bigfile/${file.originalFilename}/` + index;
    // const filePath = `/upload/bigfile/${md5(String(files.originalFilename))}/` + index;
    const write = fs.createWriteStream(path.join(__dirname, `../${filepath}`))
    render.pipe(write)
    render.once('end',()=>{
      delFile(file.filepath)
    })  
    ctx.body = Msg.success('上传成功', file.originalFilename)
  }

  static uploadfilebigMerge(ctx: any) {
    const fileDir = ctx.request.body['dir'] || '';
    if (fileDir === '' || fileDir === undefined) {
      ctx.body = Msg.error('文件名不能为空')
      return
    }
    const fileExt = ctx.request.body['ext'] || 'mp4';
    const namePath = path.join(__dirname, `../uploads/bigfile/${fileDir}`);
    const fileList = fs.readdirSync(namePath)
    const soureFileList = fileList.sort().map(r => {
      return path.join(__dirname, `../uploads/bigfile/${fileDir}/${r}`)
    })
    const filePath = `/uploads/bigfile/${fileDir}.${fileExt}`; // 接口返回的路径
    const tartget = path.join(__dirname, '..', `${filePath}`)
    const fileWriteStream = fs.createWriteStream(tartget);
    let index = 0;
    function createStreamFileFn() {
      if (index >= soureFileList.length) {
        return fileWriteStream.end(() => {
          console.log('Stream 合并完成！')
          // 创建完成后删除原来的 切片文件
          delFile(namePath)
        })
      }
      let fileReadStream = fs.createReadStream(soureFileList[index]);
      fileReadStream.on('error', () => {
        fileWriteStream.close()
      })
      fileReadStream.pipe(fileWriteStream, { end: false });
      fileReadStream.on('end', () => {
        index += 1;
        createStreamFileFn()
      })
    }
    createStreamFileFn();
    ctx.status = 200;
    ctx.body = Msg.success('上传成功', filePath)
  }

  static async uploadfilebigInspect(ctx: any) {
    const name = ctx.request.body.name || '';
    if (name === '' || name === undefined) {
      ctx.body = Msg.error('文件名不能为空')
      return;
    }
    // const nameMd5 = md5(name); // md5加密后的文件名
    // const lastDir = path.join(__dirname, '../..', `static/upload/bigfile/${nameMd5}`);
    const lastDir = path.join(__dirname, `../uploads/bigfile/${name}`);
    //路径是否存在
    if (!fs.existsSync(lastDir)) {
      ctx.body = Msg.success('文件目录为空', { index: 0 })
      return
    }
    if (fs.statSync(lastDir).isDirectory()) {
      let fileList = await fs.readdirSync(lastDir)
      ctx.body = Msg.success('查询成功', { index: fileList.length })
    }
    Msg.success('查询失败', { index: 0 })
    return;
  }
}


/**
 * @description: 抽离公共方法 校验单文件类型
 * @param {myFile} file
 * @return {*}
 */
function validateFileType(file: myFile) {
  const fileType = file.mimetype;
  const typeSet = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
    'video/mp4', 'video/webm', 'video/x-msvideo', 'audio/mpeg', 'audio/ogg',
    'text/markdown', 'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint',
    'application/pdf', 'application/zip', 'application/x-zip-compressed',
  ])
  if (!typeSet.has(fileType)) {
    return false;
  }
  return true;
}

/**
 * @description: 抽离公共方法 存储单文件
 * @param {string} path file path 文件路径
 * @param {string} name file name 文件名
 * @return {*}
 */

export function saveFileThis(file: myFile): string {
  //创建可读流 highWaterMark 默认的文件大小为66k
  const render = fs.createReadStream(file.filepath);
  //获取扩展名
  const ext = path.extname(file.originalFilename)
  //最终要保存到的文件夹目录
  const yyyyMMdd = dateFormart('yyyyMMdd') //年月日

  const lastDir = path.join(uploadPath, `${yyyyMMdd}`)
  // 检查文件夹是否存在如果不存在则新建文件夹
  checkDirExist(lastDir)
  const filePath = `/${yyyyMMdd}/` + randomStr() + ext;
  // const filePath = `/${yyyyMMdd}/` + file.originalFilename
  //创建可写流
  const upStream = fs.createWriteStream(path.join(uploadPath, filePath))
  //可读流通过管道写入可写流
  render.pipe(upStream)

  render.once('end', () => {
    //写入完之后删除临时读取的文件
    delFile(file.filepath)
  })

  return filePath
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
  if (!fs.existsSync(file)) {
    //追加内容 不存在文件会自动创建文件
    fs.appendFileSync(file, '', 'utf8')
  }
}

/**
 * @description: 判断文件、文件夹是否存在及删除的方法
 * @param {string} path 必传参数可以是文件夹可以是文件
 * @param {string} reservePath 保存path目录 path值与reservePath值一样就保存
 * @return {*}
 */
export function delFile(path: string, reservePath: string = '') {
  // 检测路径是否存在
  if (fs.existsSync(path)) {
    //如果是目录
    if (fs.statSync(path).isDirectory()) {
      //指定目录下所有文件名称的数组对象
      let files = fs.readdirSync(path);
      files.forEach((file, index) => {
        let currentPath = path + '/' + file;
        if (fs.statSync(currentPath).isDirectory()) {
          delFile(currentPath, reservePath)
        } else {
          fs.unlinkSync(currentPath)
        }
      })
      if (path != reservePath) {
        try {
          let fileList = fs.readdirSync(path)
          if (fileList.length > 0) {
            setTimeout(() => {
              fs.rmdirSync(path)
            }, 100)
          } else {
            fs.rmdirSync(path)
          }
        } catch (err) {
          console.log('删除文件夹报错：', err)
        }
      }
    } else {
      fs.unlinkSync(path);
    }
  }
}
