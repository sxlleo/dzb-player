'use strict';

var tslib = require('tslib');

var DefaultConfig = {
    strokeWidth: 0.5,
};
var CorrectStringPlayer = /** @class */ (function () {
    function CorrectStringPlayer(canvas, config) {
        Object.defineProperty(this, "_canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_lines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_jsonData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_myRequestAnimationFrame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._canvas = canvas;
        this._config = tslib.__assign({}, DefaultConfig);
        this._jsonData = Array.from(config === null || config === void 0 ? void 0 : config.penDatas);
        this._lines = this._parseToLines(config === null || config === void 0 ? void 0 : config.penDatas);
        var ctx = this._canvas.getContext("2d");
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
    Object.defineProperty(CorrectStringPlayer.prototype, "_parseToLines", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (penDatas) {
            var lines = [];
            penDatas.forEach(function (dot) {
                var pointer = { x: dot.x, y: dot.y };
                if (dot.type === "PEN_DOWN") {
                    var line = {
                        points: [pointer],
                    };
                    lines.push(line);
                }
                else if (dot.type === "PEN_MOVE" || dot.type === "PEN_UP") {
                    lines[lines.length - 1].points.push(pointer);
                }
            });
            return lines;
        }
    });
    /**
     * 直接展示
     */
    Object.defineProperty(CorrectStringPlayer.prototype, "show", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var ctx = this._canvas.getContext("2d");
            ctx.beginPath();
            this._lines.forEach(function (line) {
                var _a = line.points, firstPoint = _a[0], others = _a.slice(1);
                ctx.moveTo(firstPoint.x, firstPoint.y);
                others === null || others === void 0 ? void 0 : others.forEach(function (pointer) {
                    ctx.lineTo(pointer.x, pointer.y);
                });
            });
            ctx.stroke();
        }
    });
    /**
     * 播放展示
     */
    Object.defineProperty(CorrectStringPlayer.prototype, "play", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var self = this;
            var ctx = this._canvas.getContext("2d");
            //
            // let time = 0;
            var start;
            var arr = Array.from(this._jsonData);
            var firstPointTimestramp = this._jsonData[0].timelong;
            var prePointer;
            console.log("play time:", (this._jsonData[this._jsonData.length - 1].timelong -
                this._jsonData[0].timelong) /
                (1000 * 60));
            // 设置动画执行频率
            // const MIN_MS = 150;
            // console.log(arr);
            function step(timestamp) {
                if (start === undefined) {
                    start = timestamp;
                }
                var elapsed = timestamp - start;
                if (elapsed > 0) {
                    // 根据时间找到需要绘制出来的点
                    var endIndex = arr.findIndex(function (point) {
                        return point.timelong - firstPointTimestramp > elapsed;
                    });
                    var drawPoints_1 = arr.splice(0, endIndex);
                    // console.log("endIndex", endIndex);
                    if (drawPoints_1.length > 0) {
                        // 绘制
                        ctx.beginPath();
                        if (["PEN_DOWN", "PEN_MOVE"].includes(prePointer === null || prePointer === void 0 ? void 0 : prePointer.type)) {
                            ctx.moveTo(prePointer.x, prePointer.y);
                        }
                        drawPoints_1.forEach(function (point, index) {
                            if (point.type === "PEN_DOWN") {
                                ctx.moveTo(point.x, point.y);
                            }
                            else {
                                ctx.lineTo(point.x, point.y);
                            }
                            if (index === drawPoints_1.length - 1) {
                                prePointer = point;
                            }
                        });
                        ctx.stroke();
                    }
                }
                if (arr.length > 0) {
                    self._myRequestAnimationFrame = window.requestAnimationFrame(step);
                }
            }
            this._myRequestAnimationFrame = window.requestAnimationFrame(step);
        }
    });
    // todo:delete
    Object.defineProperty(CorrectStringPlayer.prototype, "test", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var ctx = this._canvas.getContext("2d");
            //demo2
            var arr = Array.from({ length: 1 });
            console.log(arr);
            arr.forEach(function () {
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
    });
    /**
     * 暂停
     */
    Object.defineProperty(CorrectStringPlayer.prototype, "pause", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { }
    });
    /**
     * 停止
     */
    Object.defineProperty(CorrectStringPlayer.prototype, "stop", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { }
    });
    /**
     * 销毁
     */
    Object.defineProperty(CorrectStringPlayer.prototype, "destroy", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame);
        }
    });
    return CorrectStringPlayer;
}());

module.exports = CorrectStringPlayer;
