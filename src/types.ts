/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-29 16:01:08
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-05-06 17:26:44
 * @FilePath: /penCorrectPlayer/src/types.ts
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
/**
 * 画笔轨迹点数据
 */
type PenPointer = {
  force?: number
  penModel?: number
  ts: number
  type: 'PEN_DOWN' | 'PEN_MOVE'| 'PEN_UP'
  x: number
  y: number
}

/**
 * 配置文件
 */
type Config = {
  // 线的宽度
  strokeWidth?: number
  // 画笔数据
  penDatas: PenPointer[]
  /**
   * 真实纸张宽度，单位是mm
   */
  realPageWidth: number
  /**
   * 真实纸张高度，单位是mm
   */
  realPageHeight: number
}

/**
 * 线点数据
 */
type LinePointer = {
  x: number
  y: number
}
/**
 * 线数据
 */
type Line = {
  points: LinePointer[]
}

export type { Config, PenPointer, Line, LinePointer };