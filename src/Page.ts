/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-05-22 11:35:34
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-05-29 17:01:53
 * @FilePath: /penCorrectPlayer/src/Page.ts
 * @Description: 
 */
import type { PenPointer, Line, Pointer } from './types'
import { Events } from './EventsType';

import EventEmitter from "./utils/EventEmitter"

class Page extends EventEmitter {
  /**页面id */
  _pageId: number;
  /**画布元素 */
  _canvas: HTMLCanvasElement;
  /**所有点 */
  _penDatas: PenPointer[] = [];
  /**剩余的点 */
  _leftPenDatas: PenPointer[] = [];
  /**上一个绘制的点 */
  _prevDrawPoint: PenPointer;
  /**画笔宽度 */
  _strokeWidth: number;

  /**canvas context */
  _ctx: CanvasRenderingContext2D;

  constructor(pageId: number, canvas: HTMLCanvasElement, strokeWidth?: number, penDatas?: PenPointer[], leftPenDatas?: PenPointer[]) {
    super();
    this._pageId = pageId;
    this._canvas = canvas;
    this._penDatas = penDatas || [];
    this._leftPenDatas = leftPenDatas || [];
    this._strokeWidth = strokeWidth || 1;
    
    this._ctx = canvas.getContext("2d");
  }

  /**
   * 直接展示到页面（没有动画过程）
   * @param pageId 页面id
   * @returns 
   */
  showToCanvas():void {
    // const ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");
    // 所有线数据
    const lines: Line[] = this._parseToLines(this._penDatas);
    if(lines.length === 0) return;

    this._ctx.beginPath();
    this._setLineConfigBeforePath(this._ctx);
    lines.forEach((line: Line) => {
      const [firstPoint, ...others] = line.points;
      this._ctx.moveTo(firstPoint.x, firstPoint.y);

      others?.forEach((pointer: Pointer) => {
        this._ctx.lineTo(pointer.x, pointer.y);
      });
    });
    this._ctx.stroke();
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
   * 根据时间找到需要绘制出来的点，然后进行绘制
   * @param tempCurrentTime 当前时间
   */
  findPointsAndDraw(firstPointTimestamp: number, tempCurrentTime: number): PenPointer[] {
    // 需要绘制的点
    const pointIndex: number = this._leftPenDatas.findIndex((point: PenPointer, index:number) => {
      const bol = point.ts - firstPointTimestamp > tempCurrentTime
      return bol;
    })
    let drawPoints  = this._leftPenDatas.splice(0, pointIndex === -1 ? this._leftPenDatas.length : pointIndex)

    if (drawPoints.length > 0) {
      // 设置当前真该绘制的点信息
      // 后期看下这个变量是否可以删除

      // 根据点的颜色，将drawPoints进行切分
      const splitPoints = this._splitPointsByColor(drawPoints)

      splitPoints.forEach((points, index) => {
        // 绘制点到canvas
        this._drawPointsToCanvas(points)
      })
    }
    return drawPoints
  }

  /**
   * 根据点的颜色，将drawPoints进行切分
   * @param drawPoints 需要绘制的点
   * @returns 
   */
  _splitPointsByColor(drawPoints: PenPointer[]): PenPointer[][] {
    const splitPoints: PenPointer[][] = []
    let tempPoints: PenPointer[] = []
    drawPoints.forEach((point, index) => {
      if (index === 0) {
        tempPoints.push(point)
      }
      else {
        if (point.strokeStyle === drawPoints[index - 1].strokeStyle) {
          tempPoints.push(point)
        }
        else {
          splitPoints.push(tempPoints)
          tempPoints = [point]
        }
      }
    })
    splitPoints.push(tempPoints)
    return splitPoints
  }


  /**
   * 绘制点到画布
   * @param drawPoints 需要绘制的点
   */
  _drawPointsToCanvas(drawPoints: PenPointer[]):void {
    // console.log("======pageInfo.canvas", pageInfo.canvas.parentElement.parentElement)
    this._ctx.strokeStyle = drawPoints[0].strokeStyle
    this._ctx.beginPath();
    this._setLineConfigBeforePath(this._ctx)
    
    if (["PEN_DOWN", "PEN_MOVE"].includes(this._prevDrawPoint?.type)) {
      this._ctx.moveTo(this._prevDrawPoint.x, this._prevDrawPoint.y);
      console.log("===draw_num this._prevDrawPoint", this._prevDrawPoint.x, this._prevDrawPoint.y)
    }
    drawPoints.forEach((point, index) => {
      if (point.type === "PEN_DOWN") {
        this._ctx.moveTo(point.x, point.y);
      } else {
        this._ctx.lineTo(point.x, point.y);
      }
      if (index === drawPoints.length - 1) {
        // 重置一下上一个绘制的点
        this._prevDrawPoint = point;
      }
    });
    this._ctx.stroke();
  }

  /**
   * 绘制之前设置画笔的配置
   * @param ctx 
   */
  _setLineConfigBeforePath(ctx:CanvasRenderingContext2D):void {
    ctx.imageSmoothingEnabled = true;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this._strokeWidth;
  }

  set leftPenDatas(datas: PenPointer[]) {
    this._leftPenDatas = datas;
  }

  get leftPenDatas(): PenPointer[] {
    return this._leftPenDatas
  }

  set penDatas(datas: PenPointer[]) {
    this._penDatas = datas;
  }

  get penDatas(): PenPointer[] {
    return this._penDatas
  }

  clear():void {
    this._ctx?.clearRect(0, 0, this._canvas?.width, this._canvas?.height)
  }
}

export default Page;