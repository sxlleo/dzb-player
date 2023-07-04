/*
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-04-11 16:27:45
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-07-04 15:55:09
 * @FilePath: /penCorrectPlayer/demo/index.js
 * @Description: 
 */
import data from "./biji4.js"

const canvas = document.getElementsByTagName("canvas")[0];

let player;
// let penData = getPenData()

function getPenData() {
  const textAreaEle = document.getElementById('pen-datas')
  return formatContent(textAreaEle.value)
}

/**
 * 初始化时间轴逻辑
 */
function initializeTimer() {
  let curTimeEle = document.getElementById('current-time'), totalTimeEle = document.getElementById('total-time'), progressEle = document.getElementById('progress')
  setInterval(() => {
    const currentTime = parseInt(player.currentTime / 1000), totalTime = parseInt(player.totalTime / 1000)
    curTimeEle.innerText = `${currentTime}s`
    totalTimeEle.innerText = `${totalTime}s`
    console.log(`当前时间：${currentTime}`, `总时间：${totalTime}`)
    progressEle.setAttribute('value', currentTime)
    progressEle.setAttribute('max', totalTime)
  }, 1000)
  
  // 如果想中途开始播放，则需要先设置当前时间，再进行播放
  // player.currentTime = 10 * 1000
  // player.play()
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
    console.log("播放")
  })
}

/**
 * 销毁
 */
function initializeDestroy() {
  let btn = document.getElementById('destroy');
  btn.addEventListener('click', function() {
    // 直接设置播放器倍率
    player.destroy()
    console.log("销毁")
  })
}

/**
 * 持续添加数据
 */
function initializeAppendData() {
  let btn = document.getElementById('append');
  btn.addEventListener('click', function() {
    // 直接设置播放器倍率
    player.appendPagePenData(1, getPenData(), canvas)
  })
}

function initializeShow() {
  let btn = document.getElementById('show');
  btn.addEventListener('click', function() {
    player.appendPagePenData(1, getPenData(), canvas)
    // 直接设置播放器倍率
    player.show()
  })
}

function initializePenDatas() {
  const textAreaEle = document.getElementById('pen-datas')
  textAreaEle.value = data
}

function initializeShowCanvas() {
  const button = document.getElementById('showCanvas')
  button.addEventListener('click', function() {
    // canvas.parentElement.style.display = 'block'
    const rect = canvas.parentElement.getBoundingClientRect()
    console.log("canvas.parentElement", rect)
  })
}

// 格式化内容
function formatContent(content) {
  if (content.length <= 0) return []

  const str = content.replaceAll('}', '},')
  let arr = []

  // try {
  //   arr = JSON.parse(`[${str.slice(0, str.length - 2)}]`)
  // } catch (err) {
  //   throw new Error(`【AliSourceHandlerError】${err.message}`)
  // }
  console.log("str", str[0])
  console.log("str1", str[str.length - 1])
  arr = JSON.parse(`[${str.slice(0, str.length - 1)}]`)

  return arr
}

function init() {
  initializePenDatas();

  const { PenCorrectPlayer } = window.PenPlayer
  player = new PenCorrectPlayer({
    12313: canvas
  })
  // player.appendPagePenData(12313, getPenData(), canvas)
  initializeTimer()
  initializeRate()
  initializePause()
  initializeDestroy()
  initializeAppendData()
  initializeShow()
  initializeShowCanvas()
}
init()