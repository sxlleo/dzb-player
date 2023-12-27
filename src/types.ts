/*
 * @Author: songxiaolin sxldongman@163.com
 * @Date: 2023-03-29 16:01:08
 * @LastEditors: songxiaolin sxldongman@163.com
 * @LastEditTime: 2023-08-14 18:50:26
 * @FilePath: /penCorrectPlayer/src/types.ts
 * @Description:
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
/**
 * 画笔轨迹点数据
 */
type PenPointer = {
  strokeStyle?: string
  force?: number
  penModel?: number
  ts: number
  type: 'PEN_DOWN' | 'PEN_MOVE' | 'PEN_UP'
  x: number
  y: number
  // 点的原始坐标
  originalPoint?: any
}

/**
 * 配置文件
 */
type Config = {
  // 线的宽度
  strokeWidth?: number
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
type Pointer = {
  x: number
  y: number
  strokeStyle?: string
}
/**
 * 线数据
 */
type Line = {
  points: Pointer[]
}

export type { Config, PenPointer, Line, Pointer }
