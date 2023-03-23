## 腾千里笔记复原
#### 类型定义
```javascript
type OptionData = {
  force number
  penModel: number
  timelong: number
  type: 'PEN_DOWN' | 'PEN_MOVE'| 'PEN_UP'
  width: number
  x: number
  y: number
}
type JsonDataType = OptionData[]

```
#### 直接展示画笔轨迹
```javascript
const canvas = document.getElementById("canvas");
const player = new Player(canvas, {
  jsonData,
});
player.show();
```

#### 播放展示画笔轨迹
```javascript
const canvas = document.getElementById("canvas");
const player = new Player(canvas, {
  jsonData,
});
player.play();
```

