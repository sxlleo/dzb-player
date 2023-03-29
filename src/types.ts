/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-29 16:01:08
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-29 16:49:03
 * @FilePath: /penCorrectPlayer/src/types.ts
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
type PenPointer = {
  force: number
  penModel: number
  timelong: number
  type: 'PEN_DOWN' | 'PEN_MOVE'| 'PEN_UP'
  width: number
  x: number
  y: number
}

type Config = {
  // 线的宽度
  strokeWidth: number
  // 画笔数据
  penDatas: PenPointer[]
}

type LinePointer = {
  x: number
  y: number
}
type Line = {
  points: LinePointer[]
}

export type { Config, PenPointer, Line, LinePointer };