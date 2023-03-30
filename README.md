<!--
 * @Author: songxiaolin songxiaolin@aixuexi.com
 * @Date: 2023-03-23 11:13:09
 * @LastEditors: songxiaolin songxiaolin@aixuexi.com
 * @LastEditTime: 2023-03-30 18:38:52
 * @FilePath: /penCorrectPlayer/README.md
 * @Description: 
 * Copyright (c) 2023 by ${git_name} email: ${git_email}, All Rights Reserved.
-->
## 腾千里笔记复原
解析腾千里数据，并根据数据进行笔记复原

## 使用安装
```
npm install @aixuexi/penCorrectPlayer
```

#### 直接展示画笔轨迹
```javascript
import Player from "@aixuexi/penCorrectPlayer"
const penDatas: PenPointer[] = []
const canvas = document.getElementById("canvas");
const player = new Player(canvas, {
  penDatas,
});
player.show();
```

#### 播放展示画笔轨迹
```javascript
import Player from "@aixuexi/penCorrectPlayer"
const penDatas: PenPointer[] = []
const canvas = document.getElementById("canvas");
const player = new Player(canvas, {
  penDatas,
});
player.play();
```