/*
 * @Author: E-Dreamer
 * @Date: 2022-12-19 14:56:55
 * @LastEditTime: 2022-12-20 11:27:41
 * @LastEditors: E-Dreamer
 * @Description:
 */
import axios from 'axios'
import { useState } from 'react'
import './index.css'
function Ceshi() {
  const [imgArr, setImgArr] = useState([])

  const [percent, setPercent] = useState('')

  const formData = new FormData()
  const fileChange = (e: any) => {
    let file = e.target.files
    console.log('file: ', file)
    if (!file.length) return
    formData.append('file', file[0], file[0].name)
  }
  const send = () => {
    axios
      .post('/api/upload', formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const { data } = res.data
        setImgArr(data)
      })
  }

  const bigFileChange = async (e: any) => {
    const chunkSize = 0.5 * 1024 * 1024
    const target = e.target
    console.log('target:', target)
    if (target.files) {
      const file = target.files[0]
      const { name, size, type } = file
      let start = 0
      let index = 0
      let resultFileDir = '' // 后台返回的路径
      // 检查是否上传过，获取index
      const dataInpect: any = await uploadfilebigInspect(name)
      console.log('dataInpect: ', dataInpect)
      if (dataInpect.code !== 1) {
        alert(`查询错误：${dataInpect.msg}`)
        return false
      }
      index = dataInpect.data.index
      if (index > 0) {
        start = chunkSize * index
      }
      console.log(index, start, size)

      while (start < size) {
        let blob = null
        if (start + chunkSize > size) {
          blob = file.slice(start, size)
        } else {
          blob = file.slice(start, start + chunkSize)
        }
        start += chunkSize
        let blobFile = new File([blob], name)
        let formData = new FormData()
        formData.append('file', blobFile)
        formData.append('index', index + '')

        function uploadfilebig() {
          return new Promise((resolve) => {
            axios.post('/api/uploadfilebig',formData).then(res=>{
              setPercent(Number((start / size) * 100).toFixed(2))
              resolve(res.data)
            })
          })
        }
        const { data }:any = await uploadfilebig()
        console.log('filebig ', data);
        resultFileDir = data
        // console.log(data)
        index += 1
      }

      function uploadfilebigInspect(name: string) {
        return new Promise((resolve, reject) => {
          axios.post('/api/uploadfilebig-inspect', { name, },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((data) => {
              console.log(data.data);
              resolve(data.data)
            })
            .catch((err) => {
              reject(err)
            })
        })
      }

      function uploadfilebigMerge(dir: string, ext: string) {
        return new Promise((resolve) => {
          axios.post('/api/uploadfilebig-merge', { dir, ext },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then((data) => {
              setPercent(Number((start / size) * 100).toFixed(0))
              return resolve(data)
            })
        })
      }
      let extList = name.split('.')
      let ext = extList[extList.length - 1]
      const {data}:any = await uploadfilebigMerge(resultFileDir, ext)
      console.log('文件路径：', data)
    }
  }
  return (
    <>
      <div>
        <div className="box">
          <p>+</p>
          <input
            type="file"
            className="file"
            multiple
            name="avatar"
            onChange={fileChange}
          />
        </div>
      </div>
      <button onClick={send}>上传</button>
      {imgArr.map((i, index) => {
        return <img src={i} key={index} alt="图片" />
      })}
      <h3>大文件上传切片上传</h3>
      <input type="file" name="单文件上传" onChange={bigFileChange} />
      <div>上传进度：{percent}</div>
    </>
  )
}

export default Ceshi
