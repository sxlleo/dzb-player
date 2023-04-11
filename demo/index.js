/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-04-11 16:27:45
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-04-11 18:43:22
 * @FilePath: /penCorrectPlayer/demo/index.js
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
 */
import data from "./biji.js"

const canvas = document.getElementsByTagName("canvas")[0];
console.log("first", canvas)
const context = canvas.getContext('2d')
context.scale(4,4)


var player = new PenPlayer(canvas, {
  penDatas: data,
})
// player.rate = 10

/**
 * 初始化时间轴逻辑
 */
function initializeTimer() {
  let curTimeEle = document.getElementById('current-time'), totalTimeEle = document.getElementById('total-time'), progressEle = document.getElementById('progress')
  setInterval(() => {
    const currentTime = parseInt(player.currentTime / 1000), totalTime = parseInt(player.totalTime / 1000)
    curTimeEle.innerText = `${currentTime}s`
    totalTimeEle.innerText = `${totalTime}s`
    console.log(currentTime, totalTime)
    progressEle.setAttribute('value', currentTime)
    progressEle.setAttribute('max', totalTime)
  }, 1000)
  
  // 如果想中途开始播放，则需要先设置当前时间，再进行播放
  player.currentTime = 10 * 1000
  player.play()
}

/**
 * 初始化倍速逻辑
 */
function initializeRate() {
  let rateInput = document.getElementById('rate-input'), sureBtnEle = document.getElementById('sure-btn')
  sureBtnEle.addEventListener('click', function() {
    // 直接设置播放器倍率
    player.rate = rateInput.value
  })
}

/**
 * 播放器播放暂停控制
 */
function initializePause() {
  let pauseBtn = document.getElementById('pause'), playBtn = document.getElementById('play')
  pauseBtn.addEventListener('click', function() {
    // 直接设置播放器倍率
    player.pause()
  })
  playBtn.addEventListener('click', function() {
    // 直接设置播放器倍率
    player.play()
  })
}

function init() {
  initializeTimer()
  initializeRate()
  initializePause()
}
init()