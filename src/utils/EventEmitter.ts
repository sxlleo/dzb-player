/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-05-08 18:16:11
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
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
