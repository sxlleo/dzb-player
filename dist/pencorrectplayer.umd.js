/*eslint-disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.pencorrectplayer = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /*
   * @Author: songxiaolin songxiaolin@aixuexi.com
   * @Date: 2023-02-21 17:09:53
   * @LastEditors: songxiaolin songxiaolin@aixuexi.com
   * @LastEditTime: 2023-03-23 12:02:42
   * @FilePath: /penCorrectPlayer/src/index.js
   * @Description:
   */
  var DefaultConfig = {
    strokeWidth: 0.5
  };
  var CorrectStringPlayer = /*#__PURE__*/function () {
    function CorrectStringPlayer(canvas) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, CorrectStringPlayer);
      _defineProperty(this, "_config", void 0);
      _defineProperty(this, "_lines", void 0);
      _defineProperty(this, "_timer", void 0);
      _defineProperty(this, "_jsonData", void 0);
      this._canvas = canvas;
      this._config = _objectSpread2({}, DefaultConfig);
      this._jsonData = Array.from(config.jsonData);
      this._lines = this._parseToLines(config.jsonData);
      var ctx = this._canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.scale(4, 4);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = this._config.strokeWidth;
    }

    /**
     * 解析成线的数组
     */
    _createClass(CorrectStringPlayer, [{
      key: "_parseToLines",
      value: function _parseToLines(data) {
        var lines = [];
        data.forEach(function (dot) {
          var pointer = {
            x: dot.x,
            y: dot.y
          };
          if (dot.type === "PEN_DOWN") {
            var line = {
              points: [pointer]
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
    }, {
      key: "show",
      value: function show() {
        var ctx = this._canvas.getContext("2d");
        ctx.beginPath();
        this._lines.forEach(function (line) {
          var _line$points = _toArray(line.points),
            firstPoint = _line$points[0],
            others = _line$points.slice(1);
          ctx.moveTo(firstPoint.x, firstPoint.y);
          others === null || others === void 0 ? void 0 : others.forEach(function (pointer) {
            ctx.lineTo(pointer.x, pointer.y);
          });
        });
        ctx.stroke();
      }
      /**
       * 播放展示
       */
    }, {
      key: "play",
      value: function play() {
        var ctx = this._canvas.getContext("2d");
        //
        // let time = 0;
        var start;
        var arr = Array.from(this._jsonData);
        var firstPointTimestramp = this._jsonData[0].timelong;
        var prePointer;
        console.log("play time:", (this._jsonData[this._jsonData.length - 1].timelong - this._jsonData[0].timelong) / (1000 * 60));

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
            var drawPoints = arr.splice(0, endIndex);
            // console.log("endIndex", endIndex);
            if (drawPoints.length > 0) {
              var _prePointer;
              // 绘制
              ctx.beginPath();
              if (["PEN_DOWN", "PEN_MOVE"].includes((_prePointer = prePointer) === null || _prePointer === void 0 ? void 0 : _prePointer.type)) {
                ctx.moveTo(prePointer.x, prePointer.y);
              }
              drawPoints.forEach(function (point, index) {
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
            }
          }
          if (arr.length > 0) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      }

      // todo:delete
    }, {
      key: "test",
      value: function test() {
        var ctx = this._canvas.getContext("2d");
        //demo2
        var arr = Array.from({
          length: 1
        });
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

      /**
       * 暂停
       */
    }, {
      key: "pause",
      value: function pause() {}
      /**
       * 停止
       */
    }, {
      key: "stop",
      value: function stop() {}
    }]);
    return CorrectStringPlayer;
  }();

  return CorrectStringPlayer;

}));
