/*
 * @Author: songxiaolin sxldongman@163.com
 * @Date: 2023-05-11 15:09:36
 * @LastEditors: songxiaolin sxldongman@163.com
 * @LastEditTime: 2023-08-17 10:23:02
 * @FilePath: /penCorrectPlayer/src/MultiPages.ts
 * @Description:
 */
import type { Config, PenPointer } from './types'
import Page from './Page'

import EventEmitter from './utils/EventEmitter'

/**
 * 默认配置
 */
const DefaultConfig: Config = {
  strokeWidth: 1,
  // 真实纸张的宽高A4
  realPageWidth: 210,
  realPageHeight: 297,
}

/** 码点宽度 */
const x_point_size = 1.524
/** 码点宽度 */
const y_point_size = 1.524

// type PageInfo = {
//   canvas: HTMLCanvasElement
//   // 笔的数据
//   penDatas?: PenPointer[]
//   // 剩余未绘制的画笔轨迹
//   leftPenDatas?: PenPointer[]
//   // 前一个绘制的点
//   prevDrawPoint?: PenPointer
// }

type PagesInfo = {
  [pageId: number]: Page
}

type PageCanvas = {
  [pageId: number]: HTMLCanvasElement
}

class MultiPages extends EventEmitter {
  /**canvas */
  _pagesInfo: PagesInfo = {}

  /**初始化配置 */
  _config: Config

  /**第一个点的时间戳，也是第一次下笔的时间点 */
  _firstPointTimestamp: number

  constructor(pageCanvas: PageCanvas, config?: any) {
    super()

    this._config = {
      ...DefaultConfig,
      ...config,
    }

    Object.keys(pageCanvas).forEach((pageId: string) => {
      this._pagesInfo[pageId] = this._createPage(
        String(pageId),
        pageCanvas[pageId]
      )
    })
  }

  /**
   * 将腾千里点阵纸上的点转换成canvas上可以直接绘制的点
   * @param canvasWidth canvas宽
   * @param canvasHeight canvas高
   * @param point 点
   * @returns
   */
  _transformPagePointToCanvasPoint(
    canvasWidth: number,
    canvasHeight: number,
    point: any
  ): PenPointer {
    // 根据点阵纸的宽高和canvas的宽高，计算出点在canvas上的坐标，如果存在x优先使用x，如果没有x，则使用xP，y是同样的逻辑
    const x = point.x
      ? this._roundNumber(
          (canvasWidth * point.x) / (this._config.realPageWidth / x_point_size)
        )
      : point.xP * canvasWidth
    const y = point.y
      ? this._roundNumber(
          (canvasHeight * point.y) /
            (this._config.realPageHeight / y_point_size)
        )
      : point.yP * canvasHeight
    return { ...point, x, y, originalPoint: point }
  }

  _roundNumber(num: number): number {
    return Math.round(num * Math.pow(10, 15)) / Math.pow(10, 15)
  }

  /**
   * 继续添加画笔数据，添加数据会自动触发播放（持续添加的数据在时间上需要是持续的）
   * @param pageId 页面id
   * @param datas 画笔数据
   * @param canvas 画布 如果是新画布，则需要添加画布
   */
  appendPagePenData(
    pageId: string,
    datas: PenPointer[],
    canvas: HTMLCanvasElement,
    strokeStyle = 'black'
  ): void {
    if (datas?.length <= 0) return

    let page: Page = this._pagesInfo[pageId]
    if (!page) {
      if (!canvas) throw new Error('canvas参数为空')
      page = this._pagesInfo[pageId] = this._createPage(pageId, canvas)
    }

    let pagePenDatas = page?.penDatas ?? []
    let pageLeftPenDatas = page?.leftPenDatas ?? []

    // 设置上一个点的默认值为上一个绘制的点
    let prevPoint = pagePenDatas[pagePenDatas.length - 1]
    const arr = datas.map((point) => {
      // 如果当前点是move点，且上一个点是up点或者上一个点不存在，则把当前点改成down点
      if (point.type === 'PEN_MOVE') {
        if (!prevPoint || prevPoint.type === 'PEN_UP') {
          point.type = 'PEN_DOWN'
        }
      }

      prevPoint = point
      return {
        strokeStyle,
        ...this._transformPagePointToCanvasPoint(
          canvas.width,
          canvas.height,
          point
        ),
      }
    })

    pagePenDatas = pagePenDatas.concat(arr)
    pageLeftPenDatas = pageLeftPenDatas.concat(arr)

    page.penDatas = pagePenDatas
    page.leftPenDatas = pageLeftPenDatas
    // console.log("draw total num", pagePenDatas)

    // 设置第一个绘制点的时间戳
    if (!this._firstPointTimestamp) {
      this._firstPointTimestamp = pagePenDatas[0].ts
    } else {
      if (pagePenDatas[0].ts < this._firstPointTimestamp) {
        this._firstPointTimestamp = pagePenDatas[0].ts
      }
    }
  }

  /**
   * 创建页面
   * @param pageId 页面id
   * @param canvas canvas
   * @returns 页面实例
   */
  _createPage(pageId: string, canvas: HTMLCanvasElement): Page {
    const page = new Page(pageId, canvas, this._config.strokeWidth)
    return page
  }

  /**
   * 销毁
   */
  destroy(): void {
    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page = this._pagesInfo[pageId]
      page.destroy()
    })
    this._pagesInfo = null
    this._config = null
    this._firstPointTimestamp = null
  }

  get firstPointTimestramp(): number {
    return this._firstPointTimestamp
  }

  get lastPointTimestamp(): number {
    if (!this._pagesInfo) return 0
    let lastTimestamp: number

    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page = this._pagesInfo[pageId]
      const penDatas = page.penDatas
      if (penDatas.length === 0) return

      const lastPoint = penDatas[penDatas.length - 1]
      // 获取最后的时间戳
      if (!lastTimestamp) {
        lastTimestamp = lastPoint.ts
      } else {
        if (lastPoint.ts > lastTimestamp) {
          lastTimestamp = lastPoint.ts
        }
      }
    })
    return lastTimestamp
  }
}

export default MultiPages
export type { PageCanvas }
