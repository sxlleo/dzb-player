/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-02-21 17:09:53
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-05-22 18:04:34
 * @FilePath: /penCorrectPlayer/src/CorrectStringPlayer.ts
 * @Description:
 */
// import { difference } from 'lodash-es'
import type { Config, PenPointer, Line, Pointer } from './types'

import { Events } from './EventsType';

import MultiPages from './MultiPages';
import type Page from './Page'

import type { PageCanvas } from './MultiPages'

type DrawingInfo = {
  pageId: number
  drawingPoints: PenPointer[]
}

class CorrectStringPlayer extends MultiPages {
  /**
   * 当前时间（毫秒）
   */
  _curTime: number = 0
  /**
   * 播放倍速
   */
  _rate: number = 1;

  /**
   * 正在播放中
   */
  _isplaying: boolean = false;

  /**
   * requestAnimationFrame动画id
   */
  _myRequestAnimationFrame: number;

  /**
   * 当前正在绘制的所有点（当前指的是每一帧）
   */
  _currentDrawingInfo: DrawingInfo
  
  // 动画上一次的时间戳
  _prevAnimationTimestamp: number;
  
  // 动画当前的时间戳
  _currentAnimationTimestamp: number;
  
  constructor(pageCanvas: PageCanvas, config?: Config) {
    super(pageCanvas, config)
    console.log("pageCanvas", pageCanvas)
  }

  /**
   * 解析成线的数组
   * @param penDatas 画笔数据
   * @returns 
   */
  _parseToLines(penDatas: PenPointer[]): Line[] {
    const lines: Line[] = [];
    penDatas.forEach((dot) => {
      const pointer: Pointer = { x: dot.x, y: dot.y };
      if (dot.type === "PEN_DOWN") {
        const line: Line = {
          points: [pointer],
        };
        lines.push(line);
      } else if (dot.type === "PEN_MOVE" || dot.type === "PEN_UP") {
        lines[lines.length - 1].points.push(pointer);
      }
    });

    return lines;
  }

  /**
   * 直接展示
   */
  show(): void {
    Object.keys(this._pagesInfo).forEach(pageId => {
      this._pagesInfo[pageId].showToCanvas();
    })
  }

  /**
   * 播放展示
   */
  play(): void {
    if(this._isplaying) return;
    this._isplaying = true

    this._myRequestAnimationFrame = window.requestAnimationFrame(this._doAnimationStep.bind(this));
    console.log("play");
  }

  /**
   * 帧动画
   * @param timestamp 时间戳
   */
  _doAnimationStep(timestamp: number) {
    if (!this._prevAnimationTimestamp) {
      this._prevAnimationTimestamp = timestamp;
    }
    this._currentAnimationTimestamp = timestamp;

    // 改变的时间
    const changTime = this._rate * (this._currentAnimationTimestamp - this._prevAnimationTimestamp);
    // 设置当前时间
    const tempCurrentTime = this._curTime + changTime;

    if (tempCurrentTime > 0) {
      this._findPointsAndDraw(tempCurrentTime);
    }

    // 查询是否有未完成的页面id
    const undonePageId = Object.keys(this._pagesInfo).find(pageId => {
      const page: Page = this._pagesInfo[pageId]
      return page.leftPenDatas.length > 0
    })
    // 如果有未完成的页面，继续动画
    if (undonePageId || tempCurrentTime < this.totalTime) {
      // 继续animation
      this._myRequestAnimationFrame = window.requestAnimationFrame(this._doAnimationStep.bind(this));
    }
    else {
      // @ts-ignore
      this.emit(Events.TIME_ENDED)
      this._prevAnimationTimestamp = null;
      this._currentAnimationTimestamp = null;
      console.log("终止")
      // 终止animation
      this._isplaying = false
    }

    // 更新当前时间
    this.currentTime = tempCurrentTime;

    // 记录上一次的时间戳
    this._prevAnimationTimestamp = this._currentAnimationTimestamp;
  }


  /**
   * 根据时间找到需要绘制出来的点，然后进行绘制
   * @param tempCurrentTime 当前时间
   */
  _findPointsAndDraw(tempCurrentTime: number):void {
    console.log("findPointsAndDraw", this._pagesInfo)
    Object.keys(this._pagesInfo).forEach(pageId => {
      const page: Page = this._pagesInfo[pageId]
      page.findPointsAndDraw(this._firstPointTimestamp, tempCurrentTime)

      // // 需要绘制的点
      // const pointIndex: number = page.leftPenDatas.findIndex((point: PenPointer, index:number) => {
      //   const bol = point.ts - this._firstPointTimestamp > tempCurrentTime
      //   // if(bol) {
      //   //   console.log('===找到', index, point.ts, this._firstPointTimestamp, tempCurrentTime)
      //   // }
      //   return bol;
      // })
  
      // let drawPoints = page.leftPenDatas.splice(0, pointIndex === -1 ? page.leftPenDatas.length : pointIndex + 1);

      // if (drawPoints.length > 0) {
      //   // console.log("===draw_num",pageId, drawPoints.length)
      //   // 设置当前真该绘制的点信息
      //   // 后期看下这个变量是否可以删除
      //   const currentDrawingInfo = { 
      //     pageId: Number(pageId),
      //     drawingPoints: drawPoints
      //   }
      //   // @ts-ignore
      //   this.emit(Events.DRAWING, currentDrawingInfo)

      //   // 根据点的颜色，将drawPoints进行切分
      //   const splitPoints = this._splitPointsByColor(drawPoints)

      //   splitPoints.forEach((points, index) => {
      //     // console.log("===draw_num1",pageId, points.length)
      //     // 绘制点到canvas
      //     this._drawPointsToCanvas(Number(pageId), points)
      //   })
      // }
    })
  }

  /**
   * 根据点的颜色，将drawPoints进行切分
   * @param drawPoints 需要绘制的点
   * @returns 
   */
  // _splitPointsByColor(drawPoints: PenPointer[]): PenPointer[][] {
  //   const splitPoints: PenPointer[][] = []
  //   let tempPoints: PenPointer[] = []
  //   drawPoints.forEach((point, index) => {
  //     if (index === 0) {
  //       tempPoints.push(point)
  //     }
  //     else {
  //       if (point.strokeStyle === drawPoints[index - 1].strokeStyle) {
  //         tempPoints.push(point)
  //       }
  //       else {
  //         splitPoints.push(tempPoints)
  //         tempPoints = [point]
  //       }
  //     }
  //   })
  //   splitPoints.push(tempPoints)
  //   return splitPoints
  // }

  /**
   * 绘制点到画布
   * @param pageId 页面id
   * @param drawPoints 需要绘制的点
   */
  // _drawPointsToCanvas(pageId: number, drawPoints: PenPointer[]):void {
  //   // 当前页面信息
  //   const pageInfo:any = this._pagesInfo[pageId]
  //   // 上一个绘制的点
  //   const prePointer = pageInfo.prevDrawPoint

  //   const ctx:CanvasRenderingContext2D = pageInfo.canvas.getContext('2d');
  //   // console.log("======pageInfo.canvas", pageInfo.canvas.parentElement.parentElement)
  //   ctx.strokeStyle = drawPoints[0].strokeStyle
  //   ctx.beginPath();
  //   this._setLineConfigBeforePath(ctx)
    
  //   if (["PEN_DOWN", "PEN_MOVE"].includes(prePointer?.type)) {
  //     ctx.moveTo(prePointer.x, prePointer.y);
  //     console.log("===draw_num prePointer", prePointer.x, prePointer.y)
  //   }
  //   drawPoints.forEach((point, index) => {
  //     if (point.type === "PEN_DOWN") {
  //       ctx.moveTo(point.x, point.y);
  //       // console.log("===PEN_DOWN")
  //     } else {
  //       ctx.lineTo(point.x, point.y);
  //     }
  //     if (index === drawPoints.length - 1) {
  //       // 重置一下上一个绘制的点
  //       pageInfo.prevDrawPoint = point;
  //     }
  //   });
  //   ctx.stroke();
  // }

  /**
   * 重置数据
   */
  _resetLeftPenDatas():void {
    Object.keys(this._pagesInfo).forEach(pageId => {
      const page: Page = this._pagesInfo[pageId]
      page.leftPenDatas = Array.from(page.penDatas)
    })
  }

  /**
   * 重新播放
   */
  replay(): void {
    this.currentTime = 0;
    this._clearCanvas();
    // 重新播放的话，需要重置leftPenData
    this._resetLeftPenDatas();

    this.play()
  }

  /**
   * 跳帧
   * @param time 时间，单位毫秒
   */
  seek(time: number):void {
    this._clearCanvas();
    this._resetLeftPenDatas();
    this._findPointsAndDraw(time);

    // 更新当前时间
    this.currentTime = time
  }

  /**
   * 获取轨迹总时长，单位毫秒
   */
  get totalTime(): number {
    return this.lastPointTimestamp - this._firstPointTimestamp;
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
   * todo: 更新时间需要做节流
   */
  set currentTime(value: number) {
    console.log("====currentTime", value)
    if(this._curTime !== value ) {
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
    this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame)
    this._prevAnimationTimestamp = null
    this._isplaying = false
  }

  /**
   * 清理画布
   */
  _clearCanvas():void {
    console.log("=====清理canvas")
    Object.keys(this._pagesInfo).forEach(pageId => { 
      const page: Page = this._pagesInfo[pageId]
      page.clear()
    })
  }

  /**
   * 销毁
   */
  destroy() {
    this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame)
    this._clearCanvas()
  }
}

export default CorrectStringPlayer;

// export { Events, PageCanvas }
