# CSS Houdini -- CSS Paint API

## 什么是CSS Houdini

### CSS Houdini介绍

### 浏览器支持

Apple, Google, Microsoft, Mozila, Opera都是Houdini项目的推动者，不过当前只有Chrome有实现。
目前各浏览器实现程度如图：

![CSS Houdini 兼容性](assets/001/002/002/001-1523858228000.png)

CSS Houdini是包含了**Layout API**, **Paint API**等一系列API的统称， **Layout API**控制元素布局， **Paint API**控制CSS表达式处理参数逻辑。
当前只有 **Paint API** 可以用， Chrome 65+ 已默认开启该接口，65以下的Chrome需要到 `chrome://flags` 开启 `Experimental Web Platform features`。

### 如何检测

JS:

```js
if ('paintWorklet' in CSS) {
    // MAGICS
}
```

css:

```CSS
@supports (background: paint(id)) {
    /* magics */
}
```

<iframe height='265' scrolling='no' title='CSS Paint API Detection' src='https://codepen.io/y1j2x34/embed/xWvwQg/?height=265&theme-id=0&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/y1j2x34/pen/xWvwQg/'>CSS Paint API Detection</a> by y1j2x34 (<a href='https://codepen.io/y1j2x34'>@y1j2x34</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## 使用Paint API

### 环境要求

1. 使用Chrome浏览器， 低于65的要开启实验功能；
1. 必须在支持https的服务上或本地 localhost才能用；

### 简单示例

### 过程说明

### 自定义property

### 自定义参数