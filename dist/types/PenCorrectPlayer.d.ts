import type { Config, PenPointer } from './types';
import MultiPages from './MultiPages';
import type { PageCanvas } from './MultiPages';
type DrawingInfo = {
    pageId: number;
    drawingPoints: PenPointer[];
};
declare class PenCorrectPlayer extends MultiPages {
    /**
     * 当前时间（毫秒）
     */
    _curTime: number;
    /**
     * 播放倍速
     */
    _rate: number;
    /**
     * 正在播放中
     */
    _isplaying: boolean;
    /**
     * requestAnimationFrame动画id
     */
    _myRequestAnimationFrame: number;
    /**
     * 当前正在绘制的所有点（当前指的是每一帧）
     */
    _currentDrawingInfo: DrawingInfo;
    _prevAnimationTimestamp: number;
    _currentAnimationTimestamp: number;
    constructor(pageCanvas: PageCanvas, config?: Config);
    /**
     * 直接展示
     */
    show(): void;
    /**
     * 播放展示
     */
    play(): void;
    /**
     * 帧动画
     * @param timestamp 时间戳
     */
    _doAnimationStep(timestamp: number): void;
    /**
     * 根据时间找到需要绘制出来的点，然后进行绘制
     * @param tempCurrentTime 当前时间
     */
    _findPointsAndDraw(tempCurrentTime: number): void;
    /**
     * 重置数据
     */
    _resetLeftPenDatas(): void;
    /**
     * 重新播放
     */
    replay(): void;
    /**
     * 跳帧
     * @param time 时间，单位毫秒
     */
    seek(time: number): void;
    /**
     * 当页面尺寸发生变化
     */
    update(): void;
    /**
     * 获取轨迹总时长，单位毫秒
     */
    get totalTime(): number;
    /**
     * 获取当前时间，单位毫秒
     */
    get currentTime(): number;
    /**
     * 当前时间设置
     * @param value 时间，单位毫秒
     * todo: 1.更新时间需要做节流;2.对外不需要暴露这个方法，需要改成内部调用，外部调用seek即可
     */
    set currentTime(value: number);
    /**
     * 倍速
     */
    get rate(): number;
    /**
     * 设置倍速
     * @param value 倍速
     */
    set rate(value: number);
    /**
     * 暂停
     */
    pause(): void;
    /**
     * 清理画布
     */
    _clearCanvas(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
export default PenCorrectPlayer;
