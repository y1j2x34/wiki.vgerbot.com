> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/weixin_44704538/article/details/108222022)

### STW(stop the world) 是什么

1、stop the world 指的是 GC 事件发生过程中，会产生应用程序的停顿。停顿产生时整个应用程序线程都会被暂停，没有任何响应, 有点像卡死的感觉，这个停顿称为 STW。Java 中一种全局暂停现象，全局停顿，所有 Java 代码停止，[native](https://so.csdn.net/so/search?q=native&spm=1001.2101.3001.7020) 代码可以执行，但不能与 JVM 交互；这些现象多半是由于 gc 引起。

（1）可达性分析算法中[枚举](https://so.csdn.net/so/search?q=%E6%9E%9A%E4%B8%BE&spm=1001.2101.3001.7020)根节点 (GC Roots) 会导致所有 Java 执行线程停顿。  
① 分析工作必须在一个能确保一 致性的[快照](https://so.csdn.net/so/search?q=%E5%BF%AB%E7%85%A7&spm=1001.2101.3001.7020)中进行

② 一致性指整个分析期间整个执行系统看起来像被冻结在某个时间点上

③ 如果出现分析过程中对象引用关系还在不断变化，则分析结果的准确性无法保证

（2）被 STW 中断的应用程序线程会在完成 GC 之后恢复，频繁中断会让用户感觉像是网速不快造成电影卡带一样， 所以我们需要减少 STW 的发生。

2、STW 事件和采用哪款 GC 无关，所有的 GC 都有这个事件。

3、哪怕是 G1 也不能完全避免 stop-the-world 情况发生，只能说垃圾回收器越来越优秀，回收效率越来越高，尽可能地缩短了暂停时间。

4、STW 是 [JVM](https://so.csdn.net/so/search?q=JVM&spm=1001.2101.3001.7020) 在后台自动发起和自动完成的。在用户不可见的情况下，把用户正常的工作线程全部停掉。开发中不要用 System.gc() ; 会导致 stop-the-world 的发生。

### 为什么需要 STW(stop the world)

垃圾回收是根据可达性分析算法，搜索 GC Root 根的引用链，将不在引用链上的对象当做垃圾回收，设想我们执行某个方法的时候，此时产生了很多局部变量，刚好老年代满了需要进行 Full gc，如果不停止线程，垃圾回收正在根据这些局部变量也就是 GC Root 根搜索引用链，此时这个方法结束了，那么这些局部变量就都会被销毁，这些引用链的 GC Root 根都销毁了，这些引用当然也成了垃圾对象，这样就会导致在垃圾回收的过程中还会不断的产生新的垃圾。

但是 Stop-The-World 的结果是比较严重的，如果用户正在浏览你的网站，应用程序突然 Stop-The-World，所有线程被挂起，那么用户就会感觉你的网站卡住了，尽管 gc 时间是比较快的，但是如果并发量比较大，用户感知是比较明显的，会影响用户体验。

### JVM 调优案例

像京东、淘宝、唯品会这些比较大的电商平台，都属于亿级流量电商，什么是亿级流量电商呢，就是用户在网站上每日的点击是上亿的。这些电商网站后台现在基本都是使用微服务架构搭建的，我们这里就交易系统来分析一下。

![](https://img-blog.csdnimg.cn/20200825152420985.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDcwNDUzOA==,size_16,color_FFFFFF,t_70#pic_center)

对象在内存中的组成，有对象头，实例数据以及对齐填充，其中主要的大小时实例数据占用的，一个对象有很多字段，一个字段占几个字节，一个对象撑死几百个字段，我们这里假设一个订单对象大小 1KB，就是 1024 个字节，这已经算比较大的，一般对象不会超过这么大，

那么接着上面的推算，每秒就会有 300KB 的订单对象生成，但是我们这里只是估算，下单过程中不仅仅会产生订单对象 ，还会涉及库存，优惠券，积分等其他相关对象，既然是估算，我们肯定要放大一下才可靠。

假设我们这里放大 20 倍，那么每秒就会有 300KB*20 也就是 6M 的对象产生。但是订单系统也不只提供下单操作，可能还有订单查询，订单退款等操作，我们再把这业务放大十倍，那么每秒就会产生 60M 的对象放入伊甸园区，而且这些对象有一个特点，当我的订单对象一旦生成完毕之后，在堆中生成的对象都会变为垃圾对象，都应该被回收掉。

在工作中项目上线时，都会对这个项目进行一些 jvm 参数的设置，但是大多数都是随便凭感觉，比如根据机器大小给堆设置个两三 G 的内存。

我们这里假设机器是 4 核 8G，那么一般可能会给我们虚拟机分配个四五 G 的内存，就会给堆分配个 3G 的内存，那么方法区分配 256M，单个栈内存分配 1M。

![](https://img-blog.csdnimg.cn/20200825152439651.png#pic_center)

那么这么分配有什么问题呢？如果是一个并发量不大的系统，基本上也不会有什么问题，因为本身也没有多少对象在堆里生成。但是如果是我们上面说的亿级流量系统，就不能简简单单这么设置了，我们来分析一下：

![](https://img-blog.csdnimg.cn/20200825152453322.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDcwNDUzOA==,size_16,color_FFFFFF,t_70#pic_center)

根据之前我们讲的 jvm 内存分配，我们可以得知各个区域的所占内存，每秒有 60M 对象产生进去 Eden 区，那么 13 秒就会占满 Eden 区域，发生 minor gc，这些订单对象其中 90% 其实已经是垃圾对象了，为什么说 90%，因为在 gc 的那一刻，这些对象肯定还有一部分的业务操作还没有完成，所以他们不会被回收，我们这里假设每次 minor gc 都有 60M 对象还不会被回收。

​ 那么这 60M 对象会从 Eden 区移到 S0 区域，我们之前的文章有说过对象进入老年代有很多条件，比如较大的对象，这里的 60M 虽然小于 100M，同样会直接被移入老年代，为什么呢？因为还有一个条件是对象动态年龄判断，就是如果你移动的这批对象超过了 Surviror 区的 50%，同样会把这批对象移入老年代。

​ 那么按现在这种参数设置，每 13 秒就会有 60M 的对象被移入老年代，那么大概五六分钟老年代的 2G 就会被占满，那么老年代一满就要发生 full gc，但是 full gc 使我们最不愿意看到的结果。对于这么大的一个系统，每过五六分钟就发生一次 full gc，就会让系统卡顿一次，用户体验很差，这是很大的问题。

> jvm 调优是为了调优 gc，主要就是两个点，**一个是减少 Full gc 的次数，一个是缩短一次 Full gc 的时间**

先来分析一下：我们这个系统其实没有很多会长久存在的对象，也就是老不死的对象，我们放在老年代的那些 60M 的对象，在一两秒后其实都会变为垃圾对象，在下一次 full gc 时都会被回收掉，那么我们这种业务场景，完全没必要给老年代设置 2G 的内存，根本用不到。

我们完全可以把年轻代设置的大一些，我们现在来对 jvm 参数进行一些更改。

![](https://img-blog.csdnimg.cn/20200825152512244.png#pic_center)

年轻代如果不设置，堆中各个区域默认占比是 2：1(8：1：1)， 现在我们设置了之后，那么堆中各区域占比就会发生变化

![](https://img-blog.csdnimg.cn/20200825152546696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDcwNDUzOA==,size_16,color_FFFFFF,t_70#pic_center)

当我们进行参数修改之后，你再来按上面的分析来分析这个过程，你会发现一个奇迹效果。

此时需要 25 秒把伊甸园区放满，放满 minor gc 后有 60M 对象不被回收，要移到 S0 区，这时 60M<200M/2，是可以移入 S0 区域的，下一次伊甸园区再放满做 minor gc 的时候，这时这 60M 对象所对应的订单已经生成了，已经变成了垃圾对象，是可以直接被回收的，所以没有什么对象是需要被移入老年代的。

那么这么一设置的话，这个系统是不是正常情况下基本不会再发生 full gc 了呢？就算发生，也是很久才会一次了。

> **1. 分析核心主线业务**
> 
> **2. 估算涉及对象大小**
> 
> **3. 画出对象内存模型**
> 
> **4. 对应 JVM 参数调优**