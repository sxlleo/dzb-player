import type { PenPointer, Line } from './types';
import EventEmitter from './utils/EventEmitter';
declare class Page extends EventEmitter {
    /**页面id */
    _pageId: string;
    /**画布元素 */
    _canvas: HTMLCanvasElement;
    /**所有点 */
    _penDatas: PenPointer[];
    /**剩余的点 */
    _leftPenDatas: PenPointer[];
    /**上一个绘制的点 */
    _prevDrawPoint: PenPointer;
    /**画笔宽度 */
    _strokeWidth: number;
    /**canvas context */
    _ctx: CanvasRenderingContext2D;
    constructor(pageId: string, canvas: HTMLCanvasElement, strokeWidth?: number, penDatas?: PenPointer[], leftPenDatas?: PenPointer[]);
    /**
     * 直接展示到页面（没有动画过程）
     * @param pageId 页面id
     * @returns
     */
    showToCanvas(): void;
    /**
     * 解析成线的数组
     * @param penDatas 画笔数据
     * @returns
     */
    _parseToLines(penDatas: PenPointer[]): Line[];
    /**
     * 根据时间找到需要绘制出来的点，然后进行绘制
     * @param tempCurrentTime 当前时间
     */
    findPointsAndDraw(firstPointTimestamp: number, tempCurrentTime: number): PenPointer[];
    /**
     * 根据点的颜色，将drawPoints进行切分
     * @param drawPoints 需要绘制的点
     * @returns
     */
    _splitPointsByColor(drawPoints: PenPointer[]): PenPointer[][];
    /**
     * 绘制点到画布
     * @param drawPoints 需要绘制的点
     */
    _drawPointsToCanvas(drawPoints: PenPointer[]): void;
    /**
     * 绘制之前设置画笔的配置
     * @param ctx
     */
    _setLineConfigBeforePath(ctx: CanvasRenderingContext2D): void;
    set leftPenDatas(datas: PenPointer[]);
    get leftPenDatas(): PenPointer[];
    set penDatas(datas: PenPointer[]);
    get penDatas(): PenPointer[];
    get canvas(): HTMLCanvasElement;
    destroy(): void;
    clear(): void;
}
export default Page;
