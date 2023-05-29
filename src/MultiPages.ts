/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-05-11 15:09:36
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-05-29 18:15:03
 * @FilePath: /penCorrectPlayer/src/MultiPages.ts
 * @Description: 
 */
import type { Config, PenPointer, Line, Pointer } from './types'
import Page from './Page'

import EventEmitter from "./utils/EventEmitter"
import { Events } from './EventsType';

/**
 * 默认配置
 */
const DefaultConfig: Config = {
  strokeWidth: 1,
  // 真实纸张的宽高A4
  realPageWidth: 210,
  realPageHeight: 297
};

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
  _config: Config;

  /**第一个点的时间戳，也是第一次下笔的时间点 */
  _firstPointTimestamp: number

  constructor(pageCanvas: PageCanvas, config?: any){
    super()

    this._config = {
      ...DefaultConfig,
      ...config
    };

    Object.keys(pageCanvas).forEach(pageId => {
      this._pagesInfo[pageId] = this._createPage(Number(pageId), pageCanvas[pageId])
    })
  }

  /**
   * 将腾千里点阵纸上的点转换成canvas上可以直接绘制的点
   * @param canvasWidth canvas宽
   * @param canvasHeight canvas高
   * @param point 点
   * @returns 
   */
  _transformPagePointToCanvasPoint(canvasWidth:number, canvasHeight, point: PenPointer): PenPointer {
    let x = this._roundNumber(canvasWidth * point.x / (this._config.realPageWidth / x_point_size));
    let y = this._roundNumber(canvasHeight * point.y / (this._config.realPageHeight / y_point_size));
    return {...point, x, y}
  }

  _roundNumber(num: number) {
    return Math.round(num * Math.pow(10, 15)) / Math.pow(10, 15)
  }

  /**
   * 继续添加画笔数据，添加数据会自动触发播放（持续添加的数据在时间上需要是持续的）
   * @param pageId 页面id
   * @param datas 画笔数据
   * @param canvas 画布 如果是新画布，则需要添加画布
   */
  appendPagePenData(pageId: number, datas: PenPointer[], canvas: HTMLCanvasElement, strokeStyle: string = 'black'):void {
    if(datas?.length <= 0) return;

    let page: Page = this._pagesInfo[pageId]
    if(!page) {
      if(!canvas) throw new Error('canvas参数为空')
      page = this._pagesInfo[pageId] = this._createPage(pageId, canvas)

    }
    
    let pagePenDatas = page?.penDatas ?? []
    let pageLeftPenDatas = page?.leftPenDatas ?? []


    const arr = datas.map(point => {
      return {
        strokeStyle,
        ...this._transformPagePointToCanvasPoint(canvas.width, canvas.height, point)
      };
    })

    pagePenDatas = pagePenDatas.concat(arr)
    pageLeftPenDatas = pageLeftPenDatas.concat(arr)
    
    
    page.penDatas = pagePenDatas
    page.leftPenDatas = pageLeftPenDatas
    // console.log("draw total num", pagePenDatas)

    // 设置第一个绘制点的时间戳
    if(!this._firstPointTimestamp) {
      this._firstPointTimestamp = pagePenDatas[0].ts
    }
    else {
      if(pagePenDatas[0].ts < this._firstPointTimestamp) {
        this._firstPointTimestamp = pagePenDatas[0].ts
      }
    }
  }

  _createPage(pageId: number, canvas: HTMLCanvasElement): Page {
    const page = new Page(pageId, canvas, this._config.strokeWidth);
    // // @ts-ignore
    // page.on(Events.PAGE_DRAWING, (drawingPoints: PenPointer[]) => {
    //   // @ts-ignore
    //   this.emit(Events.DRAWING, {
    //     pageId,
    //     drawingPoints: drawingPoints
    //   });
    // });
    return page;
  }

  get firstPointTimestramp(): number {
    return this._firstPointTimestamp
  }

  get lastPointTimestamp(): number {
    let lastTimestamp: number;

    Object.keys(this._pagesInfo).forEach(pageId => {
      const page = this._pagesInfo[pageId];
      const penDatas = page.penDatas;
      if(penDatas.length === 0) return;

      const lastPoint = penDatas[penDatas.length - 1]
      // 获取最后的时间戳
      if(!lastTimestamp) {
        lastTimestamp = lastPoint.ts
      }
      else{
        if(lastPoint.ts > lastTimestamp) {
          lastTimestamp = lastPoint.ts
        }
      }
    })
    return lastTimestamp
  }
}

export default MultiPages
export type { PageCanvas }