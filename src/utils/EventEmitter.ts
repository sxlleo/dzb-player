/*
 * @Author: songxiaolin sxldongman@163.com
 * @Date: 2023-05-08 18:16:11
 * @LastEditors: songxiaolin sxldongman@163.com
 * @LastEditTime: 2023-05-08 18:16:49
 * @FilePath: /penCorrectPlayer/src/utils/EventEmitter.ts
 * @Description: 
 */

import mitt from 'mitt'
class EventEmitter {
  constructor() {
    Object.assign(this, mitt())
  }
}

export default EventEmitter
