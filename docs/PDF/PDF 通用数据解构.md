# 通用数据结构

PDF通用数据结构有： String, Dates, Rectangles, Name Trees, Number Trees。

PDF支持串和文本串。PDF 1.7 开始，串类型被引申定义为了 PDFDocEncoding串， 字节串（byte string）。

## 串类型（String Types）

1. String
    PDF1.6及以前的版本，它可以用于表现任何文本串无法表现的串。PDF1.7开始进一步分为： PDFDocEncoded String, ASCII String 和 Byte String。
1. Text String
    可读的字符，例如文本标注，bookmark的名称、article名称、文档信息等。
1. PDFDocEncoded String
    用于字符或字型单字节表示，使用PDFDocEncoding编码
1. ASCII String
    用一个字节来表现字符的ASCII编码
1. Byte String
    用于描述二进制数据，每个字节8bit，它用于表示编码未知的字符或字型。用于表示像MD5、签名证书、Web Capture identification等。

## Dates 日期

```txt
(D: YYYYMMDDHHmmSSOHH'mm')
```

YYYY： 年
MM：月
DD：日
HH：时
mm：分
SS：秒
O：时区（+，-，Z）+表示比本地时间快，-表示比本地时间慢，Z表示与本地时间相同
HH'：和UT时间差的小时数绝对值
mm'：和UT时间差的分钟数绝对值

## Rectangles

```txt
[lower-left-X,lower-left-Y,uper-right-X,upper-right-Y]
```

## Name Trees

Name Tree提供了类型和与子项和值的映射功能，Name Tree和Dictionary不同点：

1. 字典中关键字不同，字典中的关键字是名称对象，而在Name Tree结构中树串
1. 关键字按顺序排列
1. 与关键字相连接的值可以是任何类型的对象。流对象需要由简介对象引用指定。建议字典、数组、串对象由间接引用指定，其它PDF对象（空值、编号、布尔和名称）直接对象指定；
1. 数据结构可以表示一个“关键字 - 值”配对的任意大的结合，不需要读取完整PDF结构就可以有效的查询，而字典受到它说包含的选项编号执行限制制约。

## Number Trees

类似Name Trees, 不同的是关键字是 Integer 类型，而 Name Trees 是串类型。以数字升序进行排列。