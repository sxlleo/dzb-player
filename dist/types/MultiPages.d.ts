import type { Config, PenPointer } from './types';
import Page from './Page';
import EventEmitter from './utils/EventEmitter';
type PagesInfo = {
    [pageId: number]: Page;
};
type PageCanvas = {
    [pageId: number]: HTMLCanvasElement;
};
declare class MultiPages extends EventEmitter {
    /**canvas */
    _pagesInfo: PagesInfo;
    /**初始化配置 */
    _config: Config;
    /**第一个点的时间戳，也是第一次下笔的时间点 */
    _firstPointTimestamp: number;
    constructor(pageCanvas: PageCanvas, config?: any);
    /**
     * 将腾千里点阵纸上的点转换成canvas上可以直接绘制的点
     * @param canvasWidth canvas宽
     * @param canvasHeight canvas高
     * @param point 点
     * @returns
     */
    _transformPagePointToCanvasPoint(canvasWidth: number, canvasHeight: number, point: any): PenPointer;
    _roundNumber(num: number): number;
    /**
     * 继续添加画笔数据，添加数据会自动触发播放（持续添加的数据在时间上需要是持续的）
     * @param pageId 页面id
     * @param datas 画笔数据
     * @param canvas 画布 如果是新画布，则需要添加画布
     */
    appendPagePenData(pageId: string, datas: PenPointer[], canvas: HTMLCanvasElement, strokeStyle?: string): void;
    /**
     * 创建页面
     * @param pageId 页面id
     * @param canvas canvas
     * @returns 页面实例
     */
    _createPage(pageId: string, canvas: HTMLCanvasElement): Page;
    /**
     * 销毁
     */
    destroy(): void;
    get firstPointTimestramp(): number;
    get lastPointTimestamp(): number;
}
export default MultiPages;
export type { PageCanvas };
