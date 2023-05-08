## 腾千里笔记复原
解析腾千里数据，并根据数据进行笔记复原

## 使用安装
```
npm install @aixuexi/penCorrectPlayer
```

## 包内预览调试demo
```javascript
npm run preview
```

## 相关场景的使用case
#### 初始化
```javascript
import type { PenPointer } from '@aixuexi/penCorrectPlayer/dist/types/types'
import Player from "@aixuexi/penCorrectPlayer"

const penDatas: PenPointer[] = []
const canvas = document.getElementById("canvas");
const player = new Player(canvas, {
  penDatas,
});
```
#### 直接展示画笔轨迹
```javascript
player.show();
```

#### 播放展示画笔轨迹
```javascript
player.play();
```
#### 暂停展示画笔轨迹
```javascript
player.pause();
```
#### 基于某个开始时间进行播放
```javascript
// 如果想基于某个开始时间进行播放，则需要先设置当前时间，再进行播放
player.currentTime = 10 * 1000
player.play()
```

#### 设置播放倍速
```javascript
player.rate = 10
```
#### 设置/获取开始时间
```javascript
player.currentTime = 10
```
#### 获取总时间
```javascript
player.totalTime
```

#### 支持持续添加画笔轨迹数据进行播放（持续添加的数据里面，时间必须是连续的）
```javascript
player.appendPenData(penDatas)
```