# Java NIO vs. IO

## 主要区别

| IO  | NIO  |
|:---:|:---:|
|  Stream oriented |  Buffer oriented |
| Blocking IO | Non blocking IO |
| | Selectors |

### 面向流和面向缓冲

Java IO 面向流意味着每次从流中读一个或多个字节，直至读取所有字节，数据没有缓存，而且不能直接前后移动数据指针，需要自己先将数据缓存到缓冲列表中才能做到。

Java NIO 的面向缓冲就略有不同。首先，读取出来的数据会被写入一个用于后续处理的缓存，用户可以前后移动缓冲数据指针，这样为操作提供了更多的灵活性。但是，操作缓冲区时需要检测是否包含了所有数据，而且写入数据时要确保未被处理过的数据不被覆盖。

### 阻塞与非阻塞IO

Java IO 的各种流都是阻塞的，调用所有读写方法都会阻塞线程直至数据被读取或者完全写入。

Java NIO 的非阻塞模型会开启一个线程从通道中读取数据，但是它只能得到目前的可用数据，如果没有数据可用时，就