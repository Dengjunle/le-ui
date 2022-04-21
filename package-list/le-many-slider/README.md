# le-many-slider

## 安装
```
npm install le-many-slider
```

### 使用

```javascript
<template>
    <LeManySlider v-model="list" :color-list="['red','green']" />
</template>

<script>
import LeManySlider from "le-many-slider"
import "le-many-slider/LeManySlider.css"
export default {
   components:{LeManySlider},
   data() {
     return {
         list:[]
     }
   }
}
```

### 属性
| 参数       | 说明               | 类型    | 默认值          |
| ---------- | ------------------ | ------- | --------------- |
| v-model    | 绑定值             | array   | [item,item]     |
| color-list | 滑块颜色列表       | array   | ['red','green'] |
| show-stops | 是否开启间断点模式 | boolean | false           |
| stop-num   | 间断点数量         | number  | 0               |

#### item对象内容

| 属性        | 说明               | 类型   |
| ----------- | ------------------ | ------ |
| id          | 唯一标识           | string |
| value       | 滑块条宽度百分比   | number |
| diffPrivate | 滑块百分比位置     | number |
| color       | 滑块及滑块条的颜色 | string |