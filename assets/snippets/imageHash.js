// jshint esversion: 6

class Pixel {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    gray() {
        let gray = this.grayValue();
        return new Pixel(gray, gray, gray);
    }
    grayValue() {
        return (this.r + this.b + this.g) / 3;
    }
    static random() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return new Pixel(r, g, b);
    }
}

class Image {
    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Pixel[][]} pixels 
     */
    constructor(width, height, pixels = Image.randomPixels(width, height)) {
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }
    pixel(x, y) {
        return this.pixels[x][y];
    }
    /**
     * 缩小
     * @param {Number} width 
     * @param {Number} height 
     */
    shrink(width, height) {
        // 此处省略两百行代码
        return new Image(width, height);
    }
    /**
     * 转为灰度图
     */
    gray() {
        const pixels = this.pixels.map(
            rowPixels => rowPixels.map(
                pixel => pixel.gray()
            )
        );
        return new Image(this.width, this.height, pixels);
    }
    /**
     * 灰度平均值
     */
    grayAvgValue() {
        let totalGray = this.pixels
            .reduce((a, b) => a.concat(b))
            .reduce((preview, pixel) => preview + pixel.grayValue(),0);
        return Math.floor(totalGray / (this.width * this.height));
    }
    binaryValues(threshold) {
        return this.pixels.map(
            rowPixels => rowPixels.map(
                pixel => pixel.grayValue() > threshold ? 1: 0
            )
        );
    }
    static randomPixels(width, height) {
        let pixels = [];
        for (let w = 0; w < width; w++) {
            const rowPixels = [];
            for (let h = 0; h < height; h++) {
                rowPixels.push(Pixel.random());
            }
            pixels.push(rowPixels);
        }
        return pixels;
    }
}

function hash(pixelBinaryValues) {
    return pixelBinaryValues //
        .reduce((a, b) => a.concat(b)) //
        .reduce((l, r) => (l * 2) + r);
}

function imageHash(image) {
    // 缩小至8*8
    let shrinkedImage = image.shrink(8, 8);
    // 计算灰度图
    let grayImage = shrinkedImage.gray();
    // 计算灰度平均值
    let grayAvgValue = grayImage.grayAvgValue();
    // 二值化
    let pixelBinaryValues = grayImage.binaryValues(grayAvgValue);
    // 组合成整数
    let hashValue = hash(pixelBinaryValues);
    return hashValue;
}

function hanming(a, b) {
    // let [h, d] = [0, a ^ b];
    // while (d > 0) {
    //     h += d & 1;
    //     d >>= 1;
    // }
    // return h;
    let dif = a ^ b;
    let binaryStr = dif.toString(2);
    if(dif < 0){
        binaryStr = binaryStr.slice(1);
    }
    return binaryStr.replace(/0/g, "").length;
    // return binaryStr.split("").map(x => parseInt(x)).reduce((a, b) => a + b);
}

let image1 = new Image(1024, 1024);
let image2 = new Image(1024, 1024);

let imageHash1 = imageHash(image1);
let imageHash2 = imageHash(image2);

let hdistance = hanming(imageHash1, imageHash2);
console.info(hdistance);