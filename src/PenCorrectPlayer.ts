/*
 * @Author: songxiaolin sxldongman@163.com
 * @Date: 2023-02-21 17:09:53
 * @LastEditors: songxiaolin sxldongman@163.com
 * @LastEditTime: 2023-08-14 18:49:02
 * @FilePath: /penCorrectPlayer/src/PenCorrectPlayer.ts
 * @Description:
 */
// import { difference } from 'lodash-es'
import type { Config, PenPointer, Line, Pointer } from './types'

import { Events } from './EventsType'

import MultiPages from './MultiPages'
import type Page from './Page'

import type { PageCanvas } from './MultiPages'

type DrawingInfo = {
  pageId: number
  drawingPoints: PenPointer[]
}

class PenCorrectPlayer extends MultiPages {
  /**
   * 当前时间（毫秒）
   */
  _curTime = 0
  /**
   * 播放倍速
   */
  _rate = 1

  /**
   * 正在播放中
   */
  _isplaying = false

  /**
   * requestAnimationFrame动画id
   */
  _myRequestAnimationFrame: number

  /**
   * 当前正在绘制的所有点（当前指的是每一帧）
   */
  _currentDrawingInfo: DrawingInfo

  // 动画上一次的时间戳
  _prevAnimationTimestamp: number

  // 动画当前的时间戳
  _currentAnimationTimestamp: number

  constructor(pageCanvas: PageCanvas, config?: Config) {
    super(pageCanvas, config)
    console.log('pageCanvas', pageCanvas)
  }

  /**
   * 直接展示
   */
  show(): void {
    Object.keys(this._pagesInfo).forEach((pageId) => {
      this._pagesInfo[pageId].showToCanvas()
    })
  }

  /**
   * 播放展示
   */
  play(): void {
    console.log('_firstPointTimestamp', this._firstPointTimestamp)
    if (this._isplaying) return
    this._isplaying = true

    this._myRequestAnimationFrame = window.requestAnimationFrame(
      this._doAnimationStep.bind(this)
    )
    console.log('play')
  }

  /**
   * 帧动画
   * @param timestamp 时间戳
   */
  _doAnimationStep(timestamp: number): void {
    if (!this._prevAnimationTimestamp) {
      this._prevAnimationTimestamp = timestamp
    }
    this._currentAnimationTimestamp = timestamp

    // 改变的时间
    const changTime =
      this._rate *
      (this._currentAnimationTimestamp - this._prevAnimationTimestamp)
    // 设置当前时间
    const tempCurrentTime = this._curTime + changTime

    if (tempCurrentTime > 0) {
      this._findPointsAndDraw(tempCurrentTime)
    }

    // 查询是否有未完成的页面id
    const undonePageId = Object.keys(this._pagesInfo).find((pageId) => {
      const page: Page = this._pagesInfo[pageId]
      return page.leftPenDatas.length > 0
    })
    // 如果有未完成的页面，继续动画
    if (undonePageId || tempCurrentTime < this.totalTime) {
      // 继续animation
      this._myRequestAnimationFrame = window.requestAnimationFrame(
        this._doAnimationStep.bind(this)
      )
    } else {
      // @ts-ignore
      this.emit(Events.TIME_ENDED)
      this._prevAnimationTimestamp = null
      this._currentAnimationTimestamp = null
      console.log('终止')
      // 终止animation
      this._isplaying = false
    }

    // 更新当前时间
    this.currentTime = tempCurrentTime

    // 记录上一次的时间戳
    this._prevAnimationTimestamp = this._currentAnimationTimestamp
  }

  /**
   * 根据时间找到需要绘制出来的点，然后进行绘制
   * @param tempCurrentTime 当前时间
   */
  _findPointsAndDraw(tempCurrentTime: number): void {
    console.log('根据当前时间找点并进行绘制')
    // 正在绘制的点
    let drawingPoints: PenPointer[] = []
    let drawingPageId: string
    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page: Page = this._pagesInfo[pageId]
      const tempDrawingPoints: PenPointer[] = page.findPointsAndDraw(
        this._firstPointTimestamp,
        tempCurrentTime
      )
      // 找到最后一个点时间最大的点集合
      if (tempDrawingPoints.length > 0) {
        if (drawingPoints.length === 0) {
          drawingPoints = tempDrawingPoints
          drawingPageId = pageId
        } else {
          if (
            drawingPoints[drawingPoints.length - 1].ts <
            tempDrawingPoints[tempDrawingPoints.length - 1].ts
          ) {
            drawingPoints = tempDrawingPoints
            drawingPageId = pageId
          }
        }
      }
    })

    if (drawingPoints.length > 0)
      // @ts-ignore
      this.emit(Events.DRAWING, {
        pageId: drawingPageId,
        drawingPoints,
      })
  }

  /**
   * 重置数据
   */
  _resetLeftPenDatas(): void {
    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page: Page = this._pagesInfo[pageId]
      page.leftPenDatas = Array.from(page.penDatas)
    })
  }

  /**
   * 重新播放
   */
  replay(): void {
    console.log('replay')
    this.currentTime = 0
    this._clearCanvas()
    // 重新播放的话，需要重置leftPenData
    this._resetLeftPenDatas()

    this.play()
  }

  /**
   * 跳帧
   * @param time 时间，单位毫秒
   */
  seek(time: number): void {
    console.log('seek')
    this._clearCanvas()
    // 把之前的重新绘制一遍
    this._resetLeftPenDatas()
    this._findPointsAndDraw(time)

    // 更新当前时间
    this.currentTime = time
  }

  /**
   * 当页面尺寸发生变化
   */
  update(): void {
    console.log('update')
    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page: Page = this._pagesInfo[pageId]

      const datas = page.penDatas.map((point) => {
        return {
          ...point,
          ...this._transformPagePointToCanvasPoint(
            page.canvas.width,
            page.canvas.height,
            point.originalPoint
          ),
        }
      })

      page.penDatas = datas
      page.leftPenDatas = [...datas]
    })

    this._findPointsAndDraw(this.currentTime)
  }

  /**
   * 获取轨迹总时长，单位毫秒
   */
  get totalTime(): number {
    return this.lastPointTimestamp - this._firstPointTimestamp
  }

  /**
   * 获取当前时间，单位毫秒
   */
  get currentTime(): number {
    return this._curTime
  }

  /**
   * 当前时间设置
   * @param value 时间，单位毫秒
   * todo: 1.更新时间需要做节流;2.对外不需要暴露这个方法，需要改成内部调用，外部调用seek即可
   */
  set currentTime(value: number) {
    console.log('====currentTime', value)
    if (this._curTime !== value) {
      // @ts-ignore
      this.emit(Events.TIME_UPDATE, value)
      this._curTime = value
    }
  }

  /**
   * 倍速
   */
  get rate(): number {
    return this._rate
  }

  /**
   * 设置倍速
   * @param value 倍速
   */
  set rate(value: number) {
    this._rate = value
  }

  /**
   * 暂停
   */
  pause(): void {
    this._myRequestAnimationFrame &&
      window.cancelAnimationFrame(this._myRequestAnimationFrame)
    this._prevAnimationTimestamp = null
    this._isplaying = false
  }

  /**
   * 清理画布
   */
  _clearCanvas(): void {
    console.log('=====清理canvas')
    Object.keys(this._pagesInfo).forEach((pageId) => {
      const page: Page = this._pagesInfo[pageId]
      page.clear()
    })
  }

  /**
   * 销毁
   */
  destroy(): void {
    console.log('destroy')
    this._myRequestAnimationFrame &&
      window.cancelAnimationFrame(this._myRequestAnimationFrame)

    this._currentDrawingInfo = null
    this._clearCanvas()

    super.destroy()
  }
}

export default PenCorrectPlayer

// export { Events, PageCanvas }
