/*
 * @Author: E-Dreamer
 * @Date: 2022-12-26 10:31:44
 * @LastEditTime: 2022-12-26 10:33:54
 * @LastEditors: E-Dreamer
 * @Description: 
 */
import React, { Suspense } from "react"

const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return <Suspense fallback={<div>正在加载....</div>}>
    <Comp />
  </Suspense>
}

export default lazyLoad;