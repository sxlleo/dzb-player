/**
 * 画笔轨迹点数据
 */
type PenPointer = {
    strokeStyle?: string;
    force?: number;
    penModel?: number;
    ts: number;
    type: 'PEN_DOWN' | 'PEN_MOVE' | 'PEN_UP';
    x: number;
    y: number;
    originalPoint?: any;
};
/**
 * 配置文件
 */
type Config = {
    strokeWidth?: number;
    /**
     * 真实纸张宽度，单位是mm
     */
    realPageWidth: number;
    /**
     * 真实纸张高度，单位是mm
     */
    realPageHeight: number;
};
/**
 * 线点数据
 */
type Pointer = {
    x: number;
    y: number;
    strokeStyle?: string;
};
/**
 * 线数据
 */
type Line = {
    points: Pointer[];
};
export type { Config, PenPointer, Line, Pointer };
