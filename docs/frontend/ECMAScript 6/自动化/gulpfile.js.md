## gulpfile.js


### 安装

```bash
npm i -D gulp gulp-sourcemaps gulp-rollup rollup-plugin-includepaths gulp-babel gulp-rename gulp-util gulp-hash-filename gulp-clean
```

### 内容

```js
const [
    gulp,
    sourcemaps,
    rollup,
    rollupIncludePaths,
    babel,
    rename,
    util,
    hash,
    clean
] = [
    "gulp",
    "gulp-sourcemaps",
    "gulp-rollup",
    "rollup-plugin-includepaths",
    "gulp-babel",
    "gulp-rename",
    "gulp-util",
    "gulp-hash-filename",
    "gulp-clean"
].map(require);

const includePathOptions = {
    paths: ["src"]
};
gulp.task("clean-dist", () =>
    gulp.src("dist/**/*.*", {read: false})
    .pipe(clean({
        force: true
    }))
    .on("error", util.log)
);
gulp.task("default", ["clean-dist"], () =>
    gulp.src(["src/**/*.js","!src/**/*.spec.js"])

    .pipe(sourcemaps.init())
    .pipe(rollup({
        entry: "src/app.js",
        sourceMap: true,
        plugins: [
            rollupIncludePaths(includePathOptions)
        ],
        format: "es"
    }))
    .pipe(babel({
        presets: [
            ["es2015", {"modules": false}]
        ],
        babelrc: false
    }))
    .on("error", util.log)
    .pipe(rename("app.full.js"))
    .pipe(hash({
        format: "{name}.{hash:8}{ext}"
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
);
```
### 效果
合并脚本，在dist目录下生成 `app.full.{hash:8}.js` 和 `app.full.{hash:8}.js.map` 两个文件
