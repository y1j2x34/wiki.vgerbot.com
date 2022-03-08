# PDF文件物理结构

PDF文档基本物理结构：

- Header
- Body
- Cross-reference table
- Trailer

## 文件头 Header

文件头指明了该文件遵从的PDF规范版本号，在PDF文件第一行出现。

```text
%PDF-1.7
```

注意： 1.4版本以后，PDF文件的规范版本不一定会在这里声明，也可能在 Catalog Version词条声明，两个同事出现，取高版本号。

## 文件体 Body

又称为对象集合，PDF的所有内容的对象， 包括 文本、图像、音乐、视频、字体、超链接、加密信息、文档结构信息等都在这里面定义。

### 定义对象

```txt
2 0 obj
...
endobj
```

分成四个部分：

1. `2` 是对象序号
1. `0` 是生成号，按照PDF规范，等于修改次数，即每次修改这个号码都会累加，实际很少用到
1. obj和endobj为对象的定义范围
1. 省略号符合为PDF规范的任意对象（8种）

引用对象用 `R` 关键字，上面的对象引用为 `2 0 R`;

## 交叉引用表 Cross-reference table

用于对象随机存取的的一个间接对象地址索引表。（实际以偏移+索引的方式存储对象）

### 普通文件交叉引用表

```txt
xref                % 交叉引用表开始
0 5                 % 0表示交叉引用表描述的对象编号从0开始，5表示对象个数
0000000000 65535 f  % 起始地址和最大产生号，f表示释放
0000000017 00000 n  % 对象号为1的偏移地址，产生号0，n表示在使用中
0000000081 00000 n  % 对象号为2的偏移地址，产生号0，n表示在使用中
0000000331 00000 n
0000000409 00000 n
```

### 增量更新的交叉引用表

```txt
xref
0 1
0000000000 65535 f
3 1                 % 对象编号从3开始，共1个对象
0000000000 00000 n
23 2
0000000000 00002 n  % 对象号为23的偏移地址，00002表示被删除过又重新使用， n表示在使用中
0000000000 00000 n
30 1
0000000000 00000 n
```

## 文件尾 Trailer

文件尾声明了交叉引用表的地址，指明了文件体的根对象（Catalog），可以通过文件尾信息找到PDF文件中各个对象体的具体位置，从而达到随机访问。另外还保存了文件加密等安全信息。

```text
trailer % 文件尾标识
<<
    /Info 1 0 R % 文件信息字典
    /Root 2 0 R % 文件根对象引用
    /Size 20    % 文件中共有20个对象
>>
startxref
2559            % 交叉引用表偏移地址
%%EOF           % 文件结束
```

## 增量更新

- PDF文件数据的变化反应在文件末尾，保持源文件内容不变，从而达到少量更新可以快速保存的优势。
- 文件更新时，新增的交叉引用表部分只包含被修改、替换或删除的对象，被删除的对象在源文件中保留，对应的交叉引用表项标记为已删除。旧的文件尾不会被删除，替换，新增的文件尾包含一个 Prev 字典项，引用之前的交叉引用部分的位置，新增的文件尾追加到文件后面。更新次数越多，文件尾数量也越多，每个文件尾都有自己的结束标识（%%EOF）.

## 对象流 Object streams

PDF1.5开始新增object stream, 包含一系列的PDF对象，类似文件体

优点：压缩PDF文件对象，从而减少PDF文件大小。

大部分对象都可以包含在对象流中，除了以下情况：

1. 流对象 Stream Objects
1. 对象的产生号非0
1. 文档的加密字典
1. 对象的 Length 条目出现在对象流字典中

解码后的 Object Stream 例子：

```text
15 0 obj
<<
    /Type /ObjStm   % Object Stream类型值
    / Length 1856
    /N 3            % 对象流中对象数
    /First          % 第一个对象的偏移值
>>
stream
11 0 12 547 13 665  % 11,12,13是对象号，0,547,665是偏移值
<<
    /Type /Font
    /Subtype /TrueType
    ...other keys...
    /FontDescriptor 12 R
>>
```

## 交叉引用流 Cross-Reference streams

PDF1.5开始新增Cross-Reference Streams，包含一个类似 trailer 字典和一个数据流存储交叉引用表的数据

交叉引用流信息更紧凑，能够访问存储在 Object Stream 中被压缩的对象，方便增加新的交叉引信息。

```text
12 0 obj
<<
    /Type /XRef     % Cross-Reference Stream
    /Size 12        % 类似 trailer 中的Size,表示对象个数
    /Root 2 0 R
    /W [1 2 1]      % 交叉引用流中数据分布由 1字节、2字节、1字节表示
>>
stream
...                 % 包含交叉引用信息的流数据
endstream
endobj
...more objects...
startxref
2559
%%EOF
```

### /W 数据含义

|类型（下标）|数值|含义|
|:--:|:--:|:--:|
|0|1|The type of this entry. which must be 0. Type 0 entries define the linked list of free objects(corresponding to f entries in cross-reference table)|
|0|2|The object number of the next free object|
|0|3|The generation number to use if object number is used again|
|1|1|The type of this entry,which must be 1.Type 1 entries define objects that are in use but are not compressed(corresponding to n entries in cross-reference table)|
|1|2|The byte offset object the object, starting from the beginning of the file.|
|1|3|The generation number of the object, Default value: 0|
|2|1|The type of this entry, which must be 2. Type 2 entries define compressed objects|
|2|2|The object number of the object stream in which this object is stored.(The generation number of the object stream is implicity 0)|
|2|3|The index of this object within the object stream.|