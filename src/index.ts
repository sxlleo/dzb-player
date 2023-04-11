/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-02-21 17:09:53
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-04-11 18:37:21
 * @FilePath: /penCorrectPlayer/src/index.ts
 * @Description:
 */
import type { Config, PenPointer, Line, LinePointer } from './types'

const DefaultConfig: any = {
  strokeWidth: 0.5,
};

class CorrectStringPlayer {
  /**
   * canvas节点
   */
  _canvas: HTMLCanvasElement
  /**
   * 配置
   */
  _config: Config;
  /**
   * 线的数据
   */
  _lines: Line[];
  /**
   * 笔的数据
   */
  _penData: PenPointer[];
  /**
   * 轨迹总时长（毫秒）
   */
  _totalTime: number
  /**
   * 当前时间
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
  constructor(canvas: HTMLCanvasElement, config?: Config) {
    this._canvas = canvas;
    this._config = {
      ...DefaultConfig,
    };

    this._penData = Array.from(config?.penDatas);
    this._lines = this._parseToLines(config?.penDatas);

    const ctx = this._canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;

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
    this._isplaying = true

    const ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");
    let arr: PenPointer[] = Array.from(this._penData);
    let firstPointTimestramp: number = this._penData[0].timelong;
    let prePointer: PenPointer;

    console.log(
      "play time:",
      (this._penData[this._penData.length - 1].timelong -
        this._penData[0].timelong) /
        (1000 * 60)
    );


    // 动画上一次的时间戳
    let preTimestamp: number;
    // 动画当前的时间戳
    let currentTimestamp: number;
    function step(timestamp: number) {
      if (preTimestamp === undefined) {
        preTimestamp = timestamp;
      }
      currentTimestamp = timestamp;
      // 改变的时间
      const changTime = this._rate * (currentTimestamp - preTimestamp);
      // console.log("@@@@@", currentTimestamp,preTimestamp, changTime, self._curTime)

      // 设置当前时间
      this._curTime += changTime;


      if (this._curTime > 0) {
        // 根据时间找到需要绘制出来的点
        const endIndex = arr.findIndex((point: PenPointer) => {
          return point.timelong - firstPointTimestramp > this._curTime;
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
        this._myRequestAnimationFrame = window.requestAnimationFrame(step.bind(this));
      }
      else {
        this._isplaying = false
      }

      preTimestamp = currentTimestamp;
    }

    this._myRequestAnimationFrame = window.requestAnimationFrame(step.bind(this));
  }

  _reset():void {
    this._curTime = 0
    this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame)
  }

  /**
   * 获取轨迹总时长，单位毫秒
   */
  get totalTime():number {
    const firstTimestamp = this._penData[0]?.timelong ?? 0
    const lastTimestamp = this._penData[this._penData.length - 1]?.timelong ?? 0
    return lastTimestamp - firstTimestamp;
  }

  /**
   * 获取当前时间
   */
  get currentTime(): number {
    return this._curTime
  }

  set currentTime(value: number) {
    this._curTime = value
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
  pause() {
    this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame)
    this._isplaying = false
  }
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
