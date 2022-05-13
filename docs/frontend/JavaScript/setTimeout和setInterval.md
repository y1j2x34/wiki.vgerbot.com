# 理解`setTimeout`和`setInterval`

## `setTimeout()`

### 语法 

> ```js 
> var timeoutID = setTimeout(function[, delay, param1, param2, ...]);
> var timeoutID = setTimeout(function[, delay])
> var timeoutID = setTimeout(code[, delay])
> ```

### 参数

- *function*
    `function`是你想要`delay`毫秒后执行的函数
- *code*
    这是一个替代语法， 可以使用字符串代替`function`， 在`delay`毫秒之后执行字符串
- *delay* （可选）
    延迟的厚爱描述， 如果省略该参数，delay取默认值0.实际延迟时间可能比delay长。
- *params1, ..., paramN* （可选）
    附加参数


### 返回值

`timeoutID`是一个正整数， 表示定时器的编号。这个值可以传递给`clearTimeout()`来取消该定时器。

`setTimeout()`和`clearInterval()`公用一个编号池，所以技术上是可以互换的， 但为了避免混淆，所以平常不要混用这两个函数。


### 关于`this`的问题

`setTimeout()`的回调函数里面的`this`不管在严格模式还是非严格模式下，都是指向window（或全局）对象， 并不是`undefined`。

> **备注1：** 需要注意的是， IE9以及更早的IE浏览器不支持传递额外参数的功能，所以最好
> 用其它兼容方案
> ```js
> var variable = 0;
> setTimeout(function(){
>   console.info(variable);
> });
>
> setTimeout((function(variable){
>  console.info(variable)
> })(0))
>
>```

> **备注2：** IE8-浏览器不允许定时器中传递事件对象`event`, 如果要使用事件对象中的某些属性， 可以将其保存在变量中传递出去。
>
> ```js
> div.onclick = function(e){
>     e = e || event;
>     var type = e.type;
>     setTimeout(function(){
>         console.log(type); // click
>         console.log(e.type); // IE8 下报错
>     });
> }
> ```

## `setInterval()`

`setInterval`用法与`setTimeout`完全一致，区别于仅仅在于`setInterval`指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。

>
> HTML5标准规定，`setTimeout`的最短时间间隔是`4ms`,`setInterval`的最短间隔时间是`10ms`
>

## 运行机制

解释下面的代码是先输出`0`而不是`1`的原因。

```js
setTimeout(function(){
    console.log(1)
});
console.log(0);
```

`delay`设为0并不是立即执行的意思，只是把函数放入代码队列。所以先输出`0`，再输出`1`


再看一个例子

```js
btn.onclick = function(){
    setTimeout(funciton(){
        console.log(1)
    }, 250);
};
```

如果`onclick`事件执行了`300ms`，则定时器至少要在定时器设置之后`300ms`后才会被执行。队列中的所有代码都要等到javascript进程空闲之后才能执行，而不管如何添加到队列。

### `setInterval()`的问题

定时器代码可能在代码再次被添加到队列之前还没有执行完，结果导致定时器代码连续运行好几次，而之间没有任何停顿。JS引擎的解决办法是： 仅当没有该定时器的任何其它代码示例时， 才将定时器代码添加到队列中， 确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

但也导致了两个问题：

- 某些间隔被跳过
- 多个定时器的代码执行之间的间隔可能比预期小

假设， 某个`onclick`事件处理程序使用`setInterval()`设置了`200ms`间隔的定时器。如果事件处理程序花了`300ms`多一点时间完成，同时定时器代码也花了`300ms`的时间，就会出现跳过某间隔的情况：
![](assets/001/008/001-1523375565000.png)

可使用链式`setTimeout()`避免以上问题：

```js
setTimeout(function fn(){
    setTimeout(fn, interval);
}, interval);
```
