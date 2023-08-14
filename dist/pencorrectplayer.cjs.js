"use strict";var e=require("tslib"),t=require("mitt"),i={TIME_UPDATE:"time_update",TIME_ENDED:"time_ended",DRAWING:"drawing",PAGE_DRAWING:"page_drawing"},n=function(){Object.assign(this,t())},r=function(t){function i(e,i,n,r,a){var o=t.call(this)||this;return Object.defineProperty(o,"_pageId",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(o,"_canvas",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(o,"_penDatas",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(o,"_leftPenDatas",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(o,"_prevDrawPoint",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(o,"_strokeWidth",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(o,"_ctx",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),o._pageId=e,o._canvas=i,o._penDatas=r||[],o._leftPenDatas=a||[],o._strokeWidth=n||1,o._ctx=i.getContext("2d"),o}return e.__extends(i,t),Object.defineProperty(i.prototype,"showToCanvas",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e=this,t=this._parseToLines(this._penDatas);0!==t.length&&(this._ctx.beginPath(),this._setLineConfigBeforePath(this._ctx),t.forEach((function(t){var i=t.points,n=i[0],r=i.slice(1);e._ctx.moveTo(n.x,n.y),null==r||r.forEach((function(t){e._ctx.lineTo(t.x,t.y)}))})),this._ctx.stroke())}}),Object.defineProperty(i.prototype,"_parseToLines",{enumerable:!1,configurable:!0,writable:!0,value:function(e){var t,i=[];return e.forEach((function(e){var n={x:e.x,y:e.y};"PEN_DOWN"===e.type?i.push(t={points:[n]}):"PEN_MOVE"!==e.type&&"PEN_UP"!==e.type||(t||i.push(t={points:[n]}),t.points.push(n))})),i}}),Object.defineProperty(i.prototype,"findPointsAndDraw",{enumerable:!1,configurable:!0,writable:!0,value:function(e,t){var i=this,n=this._leftPenDatas.findIndex((function(i,n){return i.ts-e>t})),r=this._leftPenDatas.splice(0,-1===n?this._leftPenDatas.length:n);r.length>0&&this._splitPointsByColor(r).forEach((function(e,t){i._drawPointsToCanvas(e)}));return r}}),Object.defineProperty(i.prototype,"_splitPointsByColor",{enumerable:!1,configurable:!0,writable:!0,value:function(e){var t=[],i=[];return e.forEach((function(n,r){0===r||n.strokeStyle===e[r-1].strokeStyle?i.push(n):(t.push(i),i=[n])})),t.push(i),t}}),Object.defineProperty(i.prototype,"_drawPointsToCanvas",{enumerable:!1,configurable:!0,writable:!0,value:function(e){var t,i=this;this._ctx.strokeStyle=e[0].strokeStyle,this._ctx.beginPath(),this._setLineConfigBeforePath(this._ctx),["PEN_DOWN","PEN_MOVE"].includes(null===(t=this._prevDrawPoint)||void 0===t?void 0:t.type)&&this._ctx.moveTo(this._prevDrawPoint.x,this._prevDrawPoint.y),e.forEach((function(t,n){"PEN_DOWN"===t.type?i._ctx.moveTo(t.x,t.y):i._ctx.lineTo(t.x,t.y),n===e.length-1&&(i._prevDrawPoint=t)})),this._ctx.stroke()}}),Object.defineProperty(i.prototype,"_setLineConfigBeforePath",{enumerable:!1,configurable:!0,writable:!0,value:function(e){e.imageSmoothingEnabled=!0,e.lineJoin="round",e.lineCap="round",e.lineWidth=this._strokeWidth}}),Object.defineProperty(i.prototype,"leftPenDatas",{get:function(){return this._leftPenDatas},set:function(e){this._leftPenDatas=e},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"penDatas",{get:function(){return this._penDatas},set:function(e){this._penDatas=e},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"canvas",{get:function(){return this._canvas},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"destroy",{enumerable:!1,configurable:!0,writable:!0,value:function(){this._canvas=null,this._ctx=null,this._penDatas=[],this._leftPenDatas=[],this._prevDrawPoint=null}}),Object.defineProperty(i.prototype,"clear",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e,t,i;null===(e=this._ctx)||void 0===e||e.clearRect(0,0,null===(t=this._canvas)||void 0===t?void 0:t.width,null===(i=this._canvas)||void 0===i?void 0:i.height)}}),i}(n),a={strokeWidth:1,realPageWidth:210,realPageHeight:297},o=function(t){function n(e,i){var n=t.call(this,e,i)||this;return Object.defineProperty(n,"_curTime",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(n,"_rate",{enumerable:!0,configurable:!0,writable:!0,value:1}),Object.defineProperty(n,"_isplaying",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(n,"_myRequestAnimationFrame",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(n,"_currentDrawingInfo",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(n,"_prevAnimationTimestamp",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(n,"_currentAnimationTimestamp",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),n}return e.__extends(n,t),Object.defineProperty(n.prototype,"show",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e=this;Object.keys(this._pagesInfo).forEach((function(t){e._pagesInfo[t].showToCanvas()}))}}),Object.defineProperty(n.prototype,"play",{enumerable:!1,configurable:!0,writable:!0,value:function(){this._isplaying||(this._isplaying=!0,this._myRequestAnimationFrame=window.requestAnimationFrame(this._doAnimationStep.bind(this)))}}),Object.defineProperty(n.prototype,"_doAnimationStep",{enumerable:!1,configurable:!0,writable:!0,value:function(e){var t=this;this._prevAnimationTimestamp||(this._prevAnimationTimestamp=e),this._currentAnimationTimestamp=e;var n=this._curTime+this._rate*(this._currentAnimationTimestamp-this._prevAnimationTimestamp);n>0&&this._findPointsAndDraw(n),Object.keys(this._pagesInfo).find((function(e){return t._pagesInfo[e].leftPenDatas.length>0}))||n<this.totalTime?this._myRequestAnimationFrame=window.requestAnimationFrame(this._doAnimationStep.bind(this)):(this.emit(i.TIME_ENDED),this._prevAnimationTimestamp=null,this._currentAnimationTimestamp=null,this._isplaying=!1),this.currentTime=n,this._prevAnimationTimestamp=this._currentAnimationTimestamp}}),Object.defineProperty(n.prototype,"_findPointsAndDraw",{enumerable:!1,configurable:!0,writable:!0,value:function(e){var t,n=this,r=[];Object.keys(this._pagesInfo).forEach((function(i){var a=n._pagesInfo[i].findPointsAndDraw(n._firstPointTimestamp,e);a.length>0&&(0===r.length||r[r.length-1].ts<a[a.length-1].ts)&&(r=a,t=i)})),r.length>0&&this.emit(i.DRAWING,{pageId:t,drawingPoints:r})}}),Object.defineProperty(n.prototype,"_resetLeftPenDatas",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e=this;Object.keys(this._pagesInfo).forEach((function(t){var i=e._pagesInfo[t];i.leftPenDatas=Array.from(i.penDatas)}))}}),Object.defineProperty(n.prototype,"replay",{enumerable:!1,configurable:!0,writable:!0,value:function(){this.currentTime=0,this._clearCanvas(),this._resetLeftPenDatas(),this.play()}}),Object.defineProperty(n.prototype,"seek",{enumerable:!1,configurable:!0,writable:!0,value:function(e){this._clearCanvas(),this._resetLeftPenDatas(),this._findPointsAndDraw(e),this.currentTime=e}}),Object.defineProperty(n.prototype,"update",{enumerable:!1,configurable:!0,writable:!0,value:function(){var t=this;Object.keys(this._pagesInfo).forEach((function(i){var n=t._pagesInfo[i],r=n.penDatas.map((function(i){return e.__assign(e.__assign({},i),t._transformPagePointToCanvasPoint(n.canvas.width,n.canvas.height,{x:i.originalX,y:i.originalY}))}));n.penDatas=r,n.leftPenDatas=e.__spreadArray([],r,!0)})),this._findPointsAndDraw(this.currentTime)}}),Object.defineProperty(n.prototype,"totalTime",{get:function(){return this.lastPointTimestamp-this._firstPointTimestamp},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"currentTime",{get:function(){return this._curTime},set:function(e){this._curTime!==e&&(this.emit(i.TIME_UPDATE,e),this._curTime=e)},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"rate",{get:function(){return this._rate},set:function(e){this._rate=e},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"pause",{enumerable:!1,configurable:!0,writable:!0,value:function(){this._myRequestAnimationFrame&&window.cancelAnimationFrame(this._myRequestAnimationFrame),this._prevAnimationTimestamp=null,this._isplaying=!1}}),Object.defineProperty(n.prototype,"_clearCanvas",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e=this;Object.keys(this._pagesInfo).forEach((function(t){e._pagesInfo[t].clear()}))}}),Object.defineProperty(n.prototype,"destroy",{enumerable:!1,configurable:!0,writable:!0,value:function(){this._myRequestAnimationFrame&&window.cancelAnimationFrame(this._myRequestAnimationFrame),this._currentDrawingInfo=null,this._clearCanvas(),t.prototype.destroy.call(this)}}),n}(function(t){function i(i,n){var r=t.call(this)||this;return Object.defineProperty(r,"_pagesInfo",{enumerable:!0,configurable:!0,writable:!0,value:{}}),Object.defineProperty(r,"_config",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(r,"_firstPointTimestamp",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),r._config=e.__assign(e.__assign({},a),n),Object.keys(i).forEach((function(e){r._pagesInfo[e]=r._createPage(Number(e),i[e])})),r}return e.__extends(i,t),Object.defineProperty(i.prototype,"_transformPagePointToCanvasPoint",{enumerable:!1,configurable:!0,writable:!0,value:function(t,i,n){var r=n.x?this._roundNumber(t*n.x/(this._config.realPageWidth/1.524)):n.xP*this._config.realPageWidth,a=n.y?this._roundNumber(i*n.y/(this._config.realPageHeight/1.524)):n.yP*this._config.realPageHeight;return e.__assign(e.__assign({},n),{x:r,y:a,originalX:n.x,originalY:n.y})}}),Object.defineProperty(i.prototype,"_roundNumber",{enumerable:!1,configurable:!0,writable:!0,value:function(e){return Math.round(e*Math.pow(10,15))/Math.pow(10,15)}}),Object.defineProperty(i.prototype,"appendPagePenData",{enumerable:!1,configurable:!0,writable:!0,value:function(t,i,n,r){var a,o,s=this;if(void 0===r&&(r="black"),!((null==i?void 0:i.length)<=0)){var l=this._pagesInfo[t];if(!l){if(!n)throw new Error("canvas参数为空");l=this._pagesInfo[t]=this._createPage(t,n)}var u=null!==(a=null==l?void 0:l.penDatas)&&void 0!==a?a:[],c=null!==(o=null==l?void 0:l.leftPenDatas)&&void 0!==o?o:[],f=i.map((function(t){return e.__assign({strokeStyle:r},s._transformPagePointToCanvasPoint(n.width,n.height,e.__assign(e.__assign({},t),{originalX:t.x,originalY:t.y})))}));u=u.concat(f),c=c.concat(f),l.penDatas=u,l.leftPenDatas=c,this._firstPointTimestamp?u[0].ts<this._firstPointTimestamp&&(this._firstPointTimestamp=u[0].ts):this._firstPointTimestamp=u[0].ts}}}),Object.defineProperty(i.prototype,"_createPage",{enumerable:!1,configurable:!0,writable:!0,value:function(e,t){return new r(e,t,this._config.strokeWidth)}}),Object.defineProperty(i.prototype,"destroy",{enumerable:!1,configurable:!0,writable:!0,value:function(){var e=this;Object.keys(this._pagesInfo).forEach((function(t){e._pagesInfo[t].destroy()})),this._pagesInfo=null,this._config=null,this._firstPointTimestamp=null}}),Object.defineProperty(i.prototype,"firstPointTimestramp",{get:function(){return this._firstPointTimestamp},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"lastPointTimestamp",{get:function(){var e,t=this;return this._pagesInfo?(Object.keys(this._pagesInfo).forEach((function(i){var n=t._pagesInfo[i].penDatas;if(0!==n.length){var r=n[n.length-1];e?r.ts>e&&(e=r.ts):e=r.ts}})),e):0},enumerable:!1,configurable:!0}),i}(n));exports.Events=i,exports.PenCorrectPlayer=o;
