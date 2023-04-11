'use strict';

var tslib = require('tslib');

var DefaultConfig = {
    strokeWidth: 0.5,
};
var CorrectStringPlayer = /** @class */ (function () {
    function CorrectStringPlayer(canvas, config) {
        /**
         * canvas节点
         */
        Object.defineProperty(this, "_canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 配置
         */
        Object.defineProperty(this, "_config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 线的数据
         */
        Object.defineProperty(this, "_lines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 笔的数据
         */
        Object.defineProperty(this, "_penData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 轨迹总时长（毫秒）
         */
        Object.defineProperty(this, "_totalTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * 当前时间
         */
        Object.defineProperty(this, "_curTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * 播放倍速
         */
        Object.defineProperty(this, "_rate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        /**
         * 正在播放中
         */
        Object.defineProperty(this, "_isplaying", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * requestAnimationFrame动画id
         */
        Object.defineProperty(this, "_myRequestAnimationFrame", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._canvas = canvas;
        this._config = tslib.__assign({}, DefaultConfig);
        this._penData = Array.from(config === null || config === void 0 ? void 0 : config.penDatas);
        this._lines = this._parseToLines(config === null || config === void 0 ? void 0 : config.penDatas);
        var ctx = this._canvas.getContext("2d");
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
            this._isplaying = true;
            var ctx = this._canvas.getContext("2d");
            var arr = Array.from(this._penData);
            var firstPointTimestramp = this._penData[0].timelong;
            var prePointer;
            console.log("play time:", (this._penData[this._penData.length - 1].timelong -
                this._penData[0].timelong) /
                (1000 * 60));
            // 动画上一次的时间戳
            var preTimestamp;
            // 动画当前的时间戳
            var currentTimestamp;
            function step(timestamp) {
                var _this = this;
                if (preTimestamp === undefined) {
                    preTimestamp = timestamp;
                }
                currentTimestamp = timestamp;
                // 改变的时间
                var changTime = this._rate * (currentTimestamp - preTimestamp);
                // console.log("@@@@@", currentTimestamp,preTimestamp, changTime, self._curTime)
                // 设置当前时间
                this._curTime += changTime;
                if (this._curTime > 0) {
                    // 根据时间找到需要绘制出来的点
                    var endIndex = arr.findIndex(function (point) {
                        return point.timelong - firstPointTimestramp > _this._curTime;
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
                    this._myRequestAnimationFrame = window.requestAnimationFrame(step.bind(this));
                }
                else {
                    this._isplaying = false;
                }
                preTimestamp = currentTimestamp;
            }
            this._myRequestAnimationFrame = window.requestAnimationFrame(step.bind(this));
        }
    });
    Object.defineProperty(CorrectStringPlayer.prototype, "_reset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this._curTime = 0;
            this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame);
        }
    });
    Object.defineProperty(CorrectStringPlayer.prototype, "totalTime", {
        /**
         * 获取轨迹总时长，单位毫秒
         */
        get: function () {
            var _a, _b, _c, _d;
            var firstTimestamp = (_b = (_a = this._penData[0]) === null || _a === void 0 ? void 0 : _a.timelong) !== null && _b !== void 0 ? _b : 0;
            var lastTimestamp = (_d = (_c = this._penData[this._penData.length - 1]) === null || _c === void 0 ? void 0 : _c.timelong) !== null && _d !== void 0 ? _d : 0;
            return lastTimestamp - firstTimestamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CorrectStringPlayer.prototype, "currentTime", {
        /**
         * 获取当前时间
         */
        get: function () {
            return this._curTime;
        },
        set: function (value) {
            this._curTime = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CorrectStringPlayer.prototype, "rate", {
        /**
         * 倍速
         */
        get: function () {
            return this._rate;
        },
        /**
         * 设置倍速
         * @param value 倍速
         */
        set: function (value) {
            this._rate = value;
        },
        enumerable: false,
        configurable: true
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
        value: function () {
            this._myRequestAnimationFrame && window.cancelAnimationFrame(this._myRequestAnimationFrame);
            this._isplaying = false;
        }
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
