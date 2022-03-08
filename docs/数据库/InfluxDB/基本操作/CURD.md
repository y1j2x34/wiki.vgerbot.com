# CURD

## 插入

语法
```sql
insert <measurement name>[,tag_key1=tag_value1,...] field_key=field_value[,field_key2=field_value2,...] [timestamp]
```

### 示例
1.
```sql
insert census,location=1,scientist=langstroth butterflies=12,honeybees=23 1234567890000000000
```
1. 正确的写法
```sql
insert measurement field_value=12
insert measurement field_value=12 1439587925
insert measurement,tag_key=tag_value field_value=12
insert measurement,tag_key=tag_value field_value=12 1439587925
insert measurement,tag_key=tag_value field_value=12,other_field=14 1439587925
```
1. 错误写法
```sql
insert measurement,value=12
insert measurement value=12,1439587925
insert measurement foo=bar value=12
insert measurement,foo=bar,value=12 1439587925
insert measurement,foo=bar
insert measurement,foo=bar 1439587925
```

时间戳不传时默认为当前服务器本地时间，单位为纳秒.

## 查询

### 基本语法:
1. `select *`
    查询返回所有field和tag的内容
1. `selecy "<field_key>"`
    查询返回指定的field内容
1. `select "<field_key>","<field_key>"`
    查询返回多个field内容
1. `select "<field_key>","<tag_key>"`
    查询返回指定的field和tag内容
1. `select "<field_key>"::field,"<tag_key>"::tag`
    查询返回指定的field,tag内容，`::field`,`::tag`语法是在field, tag重名的情况下使用，

### 在查询语句中使用数学运算
运算符优先级和标准的数学运算符优先级一致，括号拥有最高优先级。
#### 加法运算
1. 查询字段A+5的和
    ```sql
    select "A" + 5 from "add"
    ```
1. 相当于查询 A > 5的行
    ```sql
    select * from "add" WHERE "A" + 5 > 10
    ```
1. 查询 A列和B列的和
    ```sql
    select "A" + "B" from "add"
    ```

1. 查询A列和B列和大于等于10的行
    ```sql
    select * from "add" where "A"+"B" >= 10
    ```
#### 减法运算
1.
    ```sql
    select 1-"A" from "sub"
    ```
1.
    ```sql
    select * from "sub" where 1-"A" <= 3
    ```
1.
    ```sql
    select "A" - "B" from "sub"
    ```
1.
    ```sql
    select * from "sub" where "A" - B <= 1
    ```
#### 乘法和除法与上面用法相同
#### 混合运算

```sql
select 10 / ("A" + "B" + "C") from "mult"
```

#### 与函数混合运算
> 只能在select子句中使用

```sql
select 10 * mean(“value”) from ”cpu“
```
错误的写法, 会报语法错误
```sql
select mean(10 * “value”) from ”cpu“
```

不支持的运算符

- 比较运算符
    `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>`
- 逻辑运算符
    `&`,`|`,`!|`,`NAND`,`XOR`,`NOR`
- 其它
    `%`, `^`

### 函数

- 聚合函数
    - count()
    - distinct()
    - integral() ×
    - mean() 平均值
    - median() 中值
    - mode() 返回出现频率最高的值
    - spread() 最大值与最小值的差
    - stddev() 标准差
    - sum()
- 选择函数
    - bottom() 返回最小的N个值
    - first() 返回时间戳最小（最老）的一个field值
    - last() 返回时间戳最大（最新）的一个field值
    - max() 最大值
    - min() 最小值
    - percentile()
    - sample() 随机选N个field值返回
    - top() 返回最大的N个值
- 转换函数
    - ceiling()
    - cumulative_sum()
    - derivative()
    - difference()
    - elapsed()
    - floor()
    - histogram()
    - moving_average()
    - non_negtive_derivative()
- 预测函数
    - holt_winters()

用法见[官方文档](https://docs.influxdata.com/influxdb/v1.2/query_language/functions/)

### 数据类型转换
语法：
```sql
SELECT_clause <field_key>::<type> FROM_clause
```
支持的类型：float, integer, string, boolean

### 正则表达式
支持该语法的位置：
- select子句中的field keys和tag keys
    ```sql
    select /^bandwidth.*/ from "bandwidth-data"
    ```
- 表名称
    ```sql
    select * from /bandwidth\-data\-\d+/
    ```
- where子句中的 tag值以及字符串类型的field值
    查询匹配项
    ```sql
    select * from "bandwidth-data" where stag =~ /\w+/
    ```
    查询不匹配项
    ```sql
    select * from "bandwidth-data" where stag !~ /\w+/
    ```
- group by 子句中的 tag值
    ```sql
    select * from "bandwidth-data" group by /^tag_.*/
    ```

## 更新
不支持直接更新，可以使用insert 语句设置相同的时间戳和tag值来更新field value

## 删除
不支持使用语句直接删除数据，只能通过数据保留策略清理数据， 参考文档（[数据保留策略.md](?file=003-数据库/003-InfluxDB/002-基本操作/003-数据保留策略 "数据保留策略")）；