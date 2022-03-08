# 1k Rose原理

[http://js1k.com/2012-love/demo/1100](http://js1k.com/2012-love/demo/1100)

### 蒙特卡罗方法简介

蒙特卡罗方法是一个强大的工具，它可以用来解决多种函数优化和采样问题，可以用它做出各种吊炸天的效果，例如在这个玫瑰的例子中，他对减小代码体积起到了很重要的作用。

想了解更多关于蒙特卡罗方法的内容，可以阅读这篇Wiki：[Monte carlo method](http://en.wikipedia.org/wiki/Monte_carlo_method)

### `Explicit surfaces` 和采样/绘图

使用多精度定义surfaces来定义玫瑰的形状，总共用了 31个surfaces: 24片花瓣, 4个花萼（花瓣周围的薄叶）， 2片叶子以及一根玫瑰棒

这些explicit surfaces是如何画出来的？我们先看下面2d的例子：

首先定义一个 explicit surface 函数：

```js
/**
* a和b的值大小介于 0和1之间
*/
function surface(a, b){
    return {
        x: a * 50,
        y: b * 50
    };
}
```

下面是绘图的代码：

```js
var canvas = document.body.appendChild(
    document.createElement("canvas")
),
a, b, position;
// 每0.1个采样间隔画一个点, 这个间隔越小，画出来的点会越密集
for(a = 0; a < 1; a += 0.1 ){
    for(b = 0; b : 1 ; b += 0.1 ) {
        position = surface(a, b);
        context.fillRect(position.x, position.y, 1, 1);
    }
}
```

效果：

![](../../assets/013/1k%20Rose%20原理.md-1501990605000.png)

我们尝试更小的采样间隔：

![](../../assets/013/1k%20Rose%20原理.md-1501990721000.png)

采样间隔越小，临近点之间的距离也越近，直到距离小于一个像素时，surface会被填满，之后采样间隔再小， 看起来的效果变化地就不明显了

现在我们重写`surface`方法来绘制一个圆，方法有很多种，我们选用这个公式：

$$(x - x_0) ^ 2 + (y - y_0) ^ 2 < radius ^ 2$$

设(x0, y0)为圆的中点：

```js
function surface(a, b){
    var x = a * 100,
        y = b * 100,
        radius = 50,
        x0 = 50,
        y0 = 50;
    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;
    if(isInsideOfCircle){
        return {
            x: x,
            y: y
        };
    }else {
        // 不在圆内的点不绘制
        return null;
    }
}
```

上面的绘制方法改为：

```js
if(position = surface(a, b)){
    context.fillRect(position.x, position.y, 1, 1);
}
```

![](../../assets/013/1k%20Rose%20原理.md-1501991295000.png)

也可以用这个surface函数达到相同的效果：

```js
function surface(a, b) {
    // 利用极坐标系的方法
    var angle = a * Math.PI * 2,
        radius = 50,
        x0 = 50,
        y0 = 50;

    return {
        x: Math.cos(angle) * radius * b + x0,
        y: Math.sin(angle) * radius * b + y0
    };
}
```

现在我们给圆变下形，使之看起来更像花瓣:

```js
function surface(a, b){
    var x = a * 100,
        y = b * 100,
        radius = 50,
        x0 = 50,
        y0 = 50;
    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;
    if(isInsideOfCircle){
        return {
            x: x,
            y: y * (1 + b) / 2 // 变形
        };
    }else {
        // 不在圆内的点不绘制
        return null;
    }
}
```

结果：

![](../../assets/013/1k%20Rose%20原理.md-1501991470000.png)

现在看起来更像玫瑰花瓣了，我猜你肯定玩了一会儿变形方法，实际上你可以使用任何数学函数， 加、减、乘、除、sin、cos、pow。。。只要调整下surface函数，就可以绘制出任意形状。

接着我们来加点颜色：

```js
function surface(a, b) {
    var x = a * 100,
        y = b * 100,
        radius = 50,
        x0 = 50,
        y0 = 50;
    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;
    if (isInsideOfCircle) {
        return {
            x: x,
            y: y * (1 + b) / 2,
            r: 100 + Math.floor((1 - b) * 155), // this will add a gradient
            g: 50,
            b: 50
        };
    } else {
        return null;
    }
}

for (a = 0; a < 1; a += .01) {
    for (b = 0; b < 1; b += .001) {
        if (point = surface(a, b)) {
            context.fillStyle = "rgb(" + point.r + "," + point.g + "," + point.b + ")";
            context.fillRect(point.x, point.y, 1, 1);
        }
    }
}
```

效果：

![](../../assets/013/1k%20Rose%20原理.md-1501991722000.png)

嗯，可以看到带有颜色的花瓣了！

