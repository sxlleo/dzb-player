/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-02-21 17:09:53
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-29 16:40:44
 * @FilePath: /penCorrectPlayer/src/index.ts
 * @Description:
 */
import type { Config, PenPointer, Line, LinePointer } from './types'

const DefaultConfig: any = {
  strokeWidth: 0.5,
};

class CorrectStringPlayer {
  _canvas: HTMLCanvasElement
  _config: Config;
  _lines: Line[];
  _jsonData;
  _myRequestAnimationFrame;
  constructor(canvas: HTMLCanvasElement, config?: Config) {
    this._canvas = canvas;
    this._config = {
      ...DefaultConfig,
    };

    this._jsonData = Array.from(config?.penDatas);
    this._lines = this._parseToLines(config?.penDatas);

    const ctx = this._canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    // ctx.scale(4, 4);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this._config.strokeWidth;
  }

  /**
   * 解析成线的数组
   * @param penDatas 画笔数据
   * @returns 
   */
  _parseToLines(penDatas: PenPointer[]): Line[] {
    const lines: Line[] = [];
    penDatas.forEach((dot) => {
      const pointer: LinePointer = { x: dot.x, y: dot.y };
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
  show() {
    const ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");

    ctx.beginPath();
    this._lines.forEach((line: Line) => {
      const [firstPoint, ...others] = line.points;
      ctx.moveTo(firstPoint.x, firstPoint.y);

      others?.forEach((pointer: LinePointer) => {
        ctx.lineTo(pointer.x, pointer.y);
      });
    });
    ctx.stroke();
  }
  /**
   * 播放展示
   */
  play() {
    const ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");
    //
    // let time = 0;
    let start: number | null;
    let arr: PenPointer[] = Array.from(this._jsonData);
    let firstPointTimestramp: number = this._jsonData[0].timelong;
    let prePointer: PenPointer;

    console.log(
      "play time:",
      (this._jsonData[this._jsonData.length - 1].timelong -
        this._jsonData[0].timelong) /
        (1000 * 60)
    );

    // 设置动画执行频率
    // const MIN_MS = 150;
    // console.log(arr);

    function step(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      if (elapsed > 0) {
        // 根据时间找到需要绘制出来的点
        const endIndex = arr.findIndex((point: PenPointer) => {
          return point.timelong - firstPointTimestramp > elapsed;
        });
        const drawPoints: PenPointer[] = arr.splice(0, endIndex);
        // console.log("endIndex", endIndex);
        if (drawPoints.length > 0) {
          // 绘制
          ctx.beginPath();
          if (["PEN_DOWN", "PEN_MOVE"].includes(prePointer?.type)) {
            ctx.moveTo(prePointer.x, prePointer.y);
          }
          drawPoints.forEach((point, index) => {
            if (point.type === "PEN_DOWN") {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
            if (index === drawPoints.length - 1) {
              prePointer = point;
            }
          });
          ctx.stroke();
        } else {
          // console.log("elapsed", elapsed);
          // console.log("arr first", arr[0].timelong - firstPointTimestramp);
        }
      }

      if (arr.length > 0) {
        this._myRequestAnimationFrame = window.requestAnimationFrame(step);
      }
    }

    this._myRequestAnimationFrame = window.requestAnimationFrame(step);
  }

  // todo:delete
  test() {
    const ctx = this._canvas.getContext("2d");
    //demo2
    const arr = Array.from({ length: 1 });
    console.log(arr);
    arr.forEach(() => {
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(20, 10);
      ctx.stroke();
    });

    //demo1
    // ctx.beginPath();
    // ctx.moveTo(10, 10);
    // ctx.lineTo(20, 10);
    // ctx.stroke();

    // ctx.beginPath();
    // // ctx.moveTo(10, 10);

    // ctx.moveTo(20, 10);
    // ctx.lineTo(100, 10);
    // ctx.stroke();

    // ctx.moveTo(20, 10);
    // ctx.lineTo(100, 10);
    // ctx.stroke();

    // ctx.moveTo(20, 10);
    // ctx.lineTo(100, 10);
    // ctx.stroke();

    // ctx.moveTo(20, 10);
    // ctx.lineTo(100, 10);
    // ctx.stroke();
  }

  /**
   * 暂停
   */
  pause() {}
  /**
   * 停止
   */
  stop() {}

  /**
   * 销毁
   */
  destroy() {
    this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame)
  }
}

export default CorrectStringPlayer;
