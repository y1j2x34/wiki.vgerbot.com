if(typeof AWPageMounts=='undefined'){AWPageMounts={}};AWPageMounts['m013']=[{"name":"01-1k Rose 原理.md","path":"013-js1k/01-1k Rose 原理.md","content":"# 1k Rose原理\r\n\r\n[http://js1k.com/2012-love/demo/1100](http://js1k.com/2012-love/demo/1100)\r\n\r\n### 蒙特卡罗方法简介\r\n\r\n蒙特卡罗方法是一个强大的工具，它可以用来解决多种函数优化和采样问题，可以用它做出各种吊炸天的效果，例如在这个玫瑰的例子中，他对减小代码体积起到了很重要的作用。\r\n\r\n想了解更多关于蒙特卡罗方法的内容，可以阅读这篇Wiki：[Monte carlo method](http://en.wikipedia.org/wiki/Monte_carlo_method)\r\n\r\n### `Explicit surfaces` 和采样/绘图\r\n\r\n使用多精度定义surfaces来定义玫瑰的形状，总共用了 31个surfaces: 24片花瓣, 4个花萼（花瓣周围的薄叶）， 2片叶子以及一根玫瑰棒\r\n\r\n这些explicit surfaces是如何画出来的？我们先看下面2d的例子：\r\n\r\n首先定义一个 explicit surface 函数：\r\n\r\n```js\r\n/**\r\n* a和b的值大小介于 0和1之间\r\n*/\r\nfunction surface(a, b){\r\n    return {\r\n        x: a * 50,\r\n        y: b * 50\r\n    };\r\n}\r\n```\r\n\r\n下面是绘图的代码：\r\n\r\n```js\r\nvar canvas = document.body.appendChild(\r\n    document.createElement(\"canvas\")\r\n),\r\na, b, position;\r\n// 每0.1个采样间隔画一个点, 这个间隔越小，画出来的点会越密集\r\nfor(a = 0; a < 1; a += 0.1 ){\r\n    for(b = 0; b : 1 ; b += 0.1 ) {\r\n        position = surface(a, b);\r\n        context.fillRect(position.x, position.y, 1, 1);\r\n    }\r\n}\r\n```\r\n\r\n效果：\r\n![](assets/013/1k Rose 原理.md-1501990605000.png)\r\n\r\n我们尝试更小的采样间隔：\r\n\r\n![](assets/013/1k Rose 原理.md-1501990721000.png)\r\n\r\n采样间隔越小，临近点之间的距离也越近，直到距离小于一个像素时，surface会被填满，之后采样间隔再小， 看起来的效果变化地就不明显了\r\n\r\n现在我们重写`surface`方法来绘制一个圆，方法有很多种，我们选用这个公式：\r\n\r\n$(x - x_0) ^ 2 + (y - y_0) ^ 2 < radius ^ 2$\r\n\r\n设(x0, y0)为圆的中点：\r\n\r\n```js\r\nfunction surface(a, b){\r\n    var x = a * 100,\r\n        y = b * 100,\r\n        radius = 50,\r\n        x0 = 50,\r\n        y0 = 50;\r\n    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;\r\n    if(isInsideOfCircle){\r\n        return {\r\n            x: x,\r\n            y: y\r\n        };\r\n    }else {\r\n        // 不在圆内的点不绘制\r\n        return null;\r\n    }\r\n}\r\n```\r\n\r\n上面的绘制方法改为：\r\n\r\n```js\r\nif(position = surface(a, b)){\r\n    context.fillRect(position.x, position.y, 1, 1);\r\n}\r\n```\r\n\r\n![](assets/013/1k Rose 原理.md-1501991295000.png)\r\n\r\n也可以用这个surface函数达到相同的效果：\r\n\r\n```js\r\nfunction surface(a, b) {\r\n    // 利用极坐标系的方法\r\n    var angle = a * Math.PI * 2,\r\n        radius = 50,\r\n        x0 = 50,\r\n        y0 = 50;\r\n\r\n    return {\r\n        x: Math.cos(angle) * radius * b + x0,\r\n        y: Math.sin(angle) * radius * b + y0\r\n    };\r\n}\r\n```\r\n\r\n现在我们给圆变下形，使之看起来更像花瓣:\r\n\r\n```js\r\nfunction surface(a, b){\r\n    var x = a * 100,\r\n        y = b * 100,\r\n        radius = 50,\r\n        x0 = 50,\r\n        y0 = 50;\r\n    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;\r\n    if(isInsideOfCircle){\r\n        return {\r\n            x: x,\r\n            y: y * (1 + b) / 2 // 变形\r\n        };\r\n    }else {\r\n        // 不在圆内的点不绘制\r\n        return null;\r\n    }\r\n}\r\n```\r\n\r\n结果：\r\n\r\n![](assets/013/1k Rose 原理.md-1501991470000.png)\r\n\r\n现在看起来更像玫瑰花瓣了，我猜你肯定玩了一会儿变形方法，实际上你可以使用任何数学函数， 加、减、乘、除、sin、cos、pow。。。只要调整下surface函数，就可以绘制出任意形状。\r\n\r\n接着我们来加点颜色：\r\n\r\n```js\r\nfunction surface(a, b) {\r\n    var x = a * 100,\r\n        y = b * 100,\r\n        radius = 50,\r\n        x0 = 50,\r\n        y0 = 50;\r\n    var isInsideOfCircle = Math.pow(x - x0, 2) + Math.pow(y - y0, 2) < radius * radius;\r\n    if (isInsideOfCircle) {\r\n        return {\r\n            x: x,\r\n            y: y * (1 + b) / 2,\r\n            r: 100 + Math.floor((1 - b) * 155), // this will add a gradient\r\n            g: 50,\r\n            b: 50\r\n        };\r\n    } else {\r\n        return null;\r\n    }\r\n}\r\n\r\nfor (a = 0; a < 1; a += .01) {\r\n    for (b = 0; b < 1; b += .001) {\r\n        if (point = surface(a, b)) {\r\n            context.fillStyle = \"rgb(\" + point.r + \",\" + point.g + \",\" + point.b + \")\";\r\n            context.fillRect(point.x, point.y, 1, 1);\r\n        }\r\n    }\r\n}\r\n```\r\n\r\n效果：\r\n\r\n![](assets/013/1k Rose 原理.md-1501991722000.png)\r\n\r\n嗯，可以看到带有颜色的花瓣了！\r\n\r\n","timestamp":1524798865268}]