# requestAnimationFrame

## 语法

> ```js
> window.requestAnimationFrame(callback)
> ```

### 参数

`callback`： 一个指定函数的参数，该函数在下次重新绘制动画时调用，这个回调函数只有一个传参，`DOMHighResTimeStamp`, 指示`requestAnimationFrame()`开始触发回调函数的当前时间（`performance.now()`返回的时间）

### 返回值

一个`long`整数，请求ID，是回调列表中唯一的标识，非0值，用来取消回调函数：
`window.cancelAnimationFrame()`

### 范例

```js
var start = null;
function step(timestamp){
    if(!start) {
        start = timestamp;
    }
    var progress = timestamp - start;
    element.style.left = Math.min(progress / 10, 200) + 'px';

    if(progress < 2000) {
        requestAnimationFrame(step);
    }
}
requestAnimationFrame(step);
```


## 分析

大多数显示器刷新频率是`60Hz`, 多数浏览器会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会提升，因此最平滑动画的最佳循环间隔是`1000ms/60`, 约为`16.6ms`。 `setTimeout`和`setInterval`的问题是，他们都不够精确，是运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间，如果队列中已有其它任务， 则动画代码就要等前面的任务完成了才能执行。

`requestAnimationFrame`采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销，也不会因为间隔时间太长，使动画卡顿不流畅，让网页动画效果能有一个统一的刷新机制。

### 特点

- `requestAnimationFrame`会把每一帧的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率；
- 在隐藏或不可见的元素中，`requestAnimationFrame`不会进行重绘或回流，减少CPU、GPU的开销；
- `requestAnimationFrame`是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下，动画会自动暂停，节省CPU开销；

### 兼容

1. IE9-不兼容， 可用setTimeout来兼容；
1. 若使用带前缀的版本，回调参数将是`DOMTimeStamp`而不是`DOMHighResTimeStamp`类，前者只精确到毫秒，后者精确到10微妙。此外，起始时间计算还不同，`DOMHighResTimeStamp`的起始时间与`performance.now()`相同，而 DOMTimeStamp 的起始时间与 Date.now() 相同；
1. Chrome中正确取消回调的方法是 `window.cancelAnimationFrame()`， 旧版本 `window.webkitCancelAnimationFrame()`和`window.webkitCancelRequestAnimationFrame()` 已被启用， 但仍支持。
1. Firefox 42中，已删除前缀版本的支持。