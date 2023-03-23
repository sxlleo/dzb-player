/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-02-21 17:09:53
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-23 12:02:42
 * @FilePath: /penCorrectPlayer/src/index.js
 * @Description:
 */
const DefaultConfig = {
  strokeWidth: 0.5,
};
class CorrectStringPlayer {
  _config;
  _lines;
  _timer;
  _jsonData;
  constructor(canvas, config = {}) {
    this._canvas = canvas;
    this._config = {
      ...DefaultConfig,
    };

    this._jsonData = Array.from(config.jsonData);
    this._lines = this._parseToLines(config.jsonData);

    const ctx = this._canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.scale(4, 4);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this._config.strokeWidth;
  }

  /**
   * 解析成线的数组
   */
  _parseToLines(data) {
    const lines = [];
    data.forEach((dot) => {
      const pointer = { x: dot.x, y: dot.y };
      if (dot.type === "PEN_DOWN") {
        const line = {
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
    const ctx = this._canvas.getContext("2d");

    ctx.beginPath();
    this._lines.forEach((line) => {
      const [firstPoint, ...others] = line.points;
      ctx.moveTo(firstPoint.x, firstPoint.y);

      others?.forEach((pointer) => {
        ctx.lineTo(pointer.x, pointer.y);
      });
    });
    ctx.stroke();
  }
  /**
   * 播放展示
   */
  play() {
    const ctx = this._canvas.getContext("2d");
    //
    // let time = 0;
    let start;
    let arr = Array.from(this._jsonData);
    let firstPointTimestramp = this._jsonData[0].timelong;
    let prePointer;

    console.log(
      "play time:",
      (this._jsonData[this._jsonData.length - 1].timelong -
        this._jsonData[0].timelong) /
        (1000 * 60)
    );

    // 设置动画执行频率
    // const MIN_MS = 150;
    // console.log(arr);

    function step(timestamp) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      if (elapsed > 0) {
        // 根据时间找到需要绘制出来的点
        const endIndex = arr.findIndex((point) => {
          return point.timelong - firstPointTimestramp > elapsed;
        });
        const drawPoints = arr.splice(0, endIndex);
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
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
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
}

export default CorrectStringPlayer;
