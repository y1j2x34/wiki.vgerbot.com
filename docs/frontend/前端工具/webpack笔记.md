<!-- # webpack 笔记

## webpack安装和命令行

### 安装

    ```shell
    npm i webpack -g
    ```

### 命令行

#### 编译脚本

```shell
webpack src.js bundle.js
```

#### 使用loader

##### 如何在js中加载css

1. 安装css-loader, style-loader
    ```shell
    npm i -D css-loader style-loader
    ```
1. 在js中引入

    ```shell
    require("style-loader!css-loader!style/xxx.css")
    ```
    css-loader 用于引入css, style-loader用于将包含到js中的css插入html中，最终呈现效果

##### 在命令行中声明loader

    ```shell
    webpack src.js bundle.js --module-bind 'css=style-loader!css-loader'
    ```

#### 其它命令行参数

1. --watch
    监听文件变化，执行构建
1. --progress
    显示打包过程
1. --display-modules
    显示所引用的模块,包括loader处理
1. --display-reasons
    显示打包的模块理由（被谁依赖了）

## webpack配置文件

### entry配置

1. 字符串 - 指定一个入口文件
1. 数组 - 指定多个没有依赖关系的入口文件打包成一个
1. 对象 - key： chunk value; value:和1,2两项规则一样， 多页面的使用场景会用到，
     通过配置可以根据key生成对应的打包文件， 如果output的filename写死，最终生成的打包文件会发生覆盖，filename应使用占位符：
    `name` key
    `hash`  命令行输出内容的第一行的hash
    `chunkhash` 每个chunk的hash

### webpack 模板

```shell
<%=htmlWebpackPlugin.options.title %>
``` -->