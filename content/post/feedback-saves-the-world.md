+++
title = "Feedback Saves the World"
date = "2018-01-13"
slug = "2018/01/13/feedback-saves-the-world"
Categories = ["ThoughtWorks", "Feedback", "TDD", "JavaScript"]
+++

### 心流

你可能有过这样的体验：在玩一个很有趣的游戏时，时间会飞快的流逝，等你终于通关之后才发现已经是凌晨，而你的午饭和晚饭还都没吃。虽然可能饿着肚子，但是你内心却有一种很兴奋，很神清气爽的感觉。而当你在做一些不得不完成的工作/作业时（比如写年终总结报告），时间又会过得很慢，你的心情也常常变得焦虑或者暴躁。

通常来说，人的心情总是会在各种情绪中起伏不定，不过毋庸置疑，我们都希望永远或者至少是尽可能多的保持第一个场景中的状态。

![](/images/2018/01/playing-game-resized.png)


这种精神高度集中，通过自己的努力不断完成挑战，并常常会有忘记时间流逝，甚至忘记自身存在，只剩下“做事情”本身的状态，在心理学上被称之为[心流（Flow）](https://en.wikipedia.org/wiki/Flow_(psychology))。人们虽然很早就发现了这种现象，但是直到1975年，心理学家米哈里·齐克森米哈里（[Mihaly Csikszentmihalyi](https://en.wikipedia.org/wiki/Mih%C3%A1ly_Cs%C3%ADkszentmih%C3%A1lyi)）才将其概念化并通过科学的方式来研究。

>心流（英语：Flow），也有别名以化境(Zone)表示，亦有人翻译为神驰状态，定义是一种将个人精神力完全投注在某种活动上的感觉；心流产生时同时会有高度的兴奋及充实感。

进入心流之后会有很多特征：

* 愉悦
* 全身心投入
* 忘我，与做的事情融为一体
* 主观的时间感改变

心流被普遍认为是一种绝佳的精神体验。根据齐克森米哈里的理论，与心流对应的，还有一些其他的心理状态：

![](/images/2018/01/300px-Challenge_vs_skill.svg.png)

当自身能力很高，但是做的事情很简单的话，你做起来会比较无聊；而当能力不足，要做的事情很困难的话，你又会陷入焦虑。有意思的是，如果你技能不足，而做的事情又比较简单的话，并不会产生“心流”体验。恰恰相反，这种状态（**apathy**）是很消极的，做事情的过程中，你既没有运用任何技能，也并没有接受到任何的挑战。

### 如何进入心流状态

齐克森米哈里要进入心流状态，需要满足至少三点：

* 有清晰的目标
* 有明确且事实的反馈
* 能力和挑战的平衡（都处于比较高的状态）

比如，玩游戏的时候，目标是明确的，不论是简单的通过策略消灭对方，还是将三个同一颜色的宝石移动到同一行）；反馈也是实时的，同色宝石连在一起是发出的声音以及屏幕上闪过的炫目的光芒，敌人在被你手中武器杀死时的惨叫，你自己的血槽等等；最后，游戏不能过于简单，如果太简单，你很快会觉得无聊，又不能太难，这样你会觉得挑战太大。

不过要在工作上进入心流状态，远远比玩游戏要复杂。比如不明确的目标，冗长的反馈周期，能力与挑战的不均衡等等。

### 基于反馈的开发

2014年底，我在`ThoughtWorks`组织[3周3页面](http://icodeit.org/3-pages-in-3-weeks/)工作坊的时候，发现了一个很有意思的现象：通常公司内部的培训/工作坊都会出现这种现象：报名的人很多，前几次课会来很多人，慢慢的人数会减少，能坚持到最后的人很少，能完成作业的就更少了。而在[3周3页面](http://icodeit.org/3-pages-in-3-weeks/)中，参加的人数越来越多，而且作业的完成率非常高（接近100%）。

回想起来，我在培训的最开始就设置了一些机制，保证学员可以有一个非常容易沉浸其中的环境：

* 通过watch、livereload等机制，保证每次修改的CSS/HTML都可以在1秒钟内在浏览器上自动刷新
* 通过对比mockup和自己实现的样式的差异，来调整自己的目标
* 将这些工具做成[开箱即用](https://github.com/abruzzi/design-boilerplate)的，这样经验不足者不至于被技术细节阻塞
* 做完之后，学员们的作品直接发布到[github的pages](https://pages.github.com/)上

![](/images/2018/01/3p3w-resized.png)

事实上，这些实践恰好满足了上述的几个条件：

* 目标明确
* 快速且准确的反馈
* 技能与挑战的平衡

由于工作坊是在周内下班后（8点结束），我见到很多学员在课后（很晚的时候）还在写代码、调样式，完全沉浸其中，忘记时间。到最后，参加培训的学员们被要求通过设计原则自己实际一个Web Site，很多没有前段开发背景的同事也做出了非常有“设计感”的作品。

![](/images/2018/01/3p3w-showcase-resized.png)

### 编程语言的壁垒

使用`JavaScript`或者`Ruby`这种解释型语言的开发人员，在第一次接触之后就会深深的爱上它，并再也无法回到编译型语言中去了。想一想要用`Java`打印一行`Hello World`你得费多大劲？

解释型语言中，你很容易可以采用[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)环境，写代码会变成一个做实验的过程：函数名写错了，参数传错了，某个函数没有定义等等错误/手误，都可以在1秒钟内得到反馈，然后你再根据反馈来修正方向。

举个小例子，写一个字符串处理函数：将字符串”qiu,juntao”转换成“Qiu Juntao”，你会怎么做？你大概知道有这样一些原生的API：

* [String.indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)
* [String.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
* [大小写转换](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
* [正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)（可选）

如果用JavaScript来实现的话，你可以在`Chrome`的`DevTools`中完成大部分的工作：

![](/images/2018/01/chrome-dev-tools-resized.png)

注意这里的每次操作的反馈（特别是出错的情况），你可以在1秒钟内就知道明确的反馈，而不是等等待漫长的编译过程。DevTools里的console提供的REPL（read-eval-print-loop）可以帮助你建立流畅的编码体验。

如果用`Java`来做，你需要一大堆的准备工作，抛开`JDK`的安装，`JAVA_HOME`的设置等，你还需要编译代码，需要定义一个类，然后在类中定义main方法，然后可能要查一些API来完成函数的编写。而每一个额外的步骤都会延长反馈的时间。

### 测试驱动开发

那么在编译型语言中如何获得这种体验呢？又如何缩短反馈周期呢？答案是使用**测试驱动开发**（Test Driven Development）！

通常`TDD`会包含这样几个步骤：

1. 根据用户故事做任务分解
1. 根据分解后的`Task`设计测试
1. 编写测试
1. 编写可以通过测试的实现
1. 重构

![](/images/2018/01/tasking-resized.png)

步骤3-5可能会不断重复，直到所有的Task都完成，用户故事也就完成了。如果仔细分析，这些步骤也恰好符合产生心流的条件：

* 划分任务
* 清晰每一个小任务
* 通过测试得到快速而明确的反馈

虽然对上边字符串转换的例子来说，`TDD`的方式还是比较重量级，不过反馈更明确，你可以在写完一个函数之后立即得到测试成功或者失败的反馈（编译过程并没有省略，不过我们通过测试的红和绿来不断强化反馈）。

而且这种方法的好处在于：对于更加复杂的需求来说，它仍然适用。如果开发者的技能和需求的难度都比较高的话，这种方式很容易达到心流的状态。

### 小结

要想在工作中让自己过得更舒服一些，你需要创造条件让自己进入心流状态。在这些条件中，最重要的是要建立其一套快速反馈的机制，这个机制可以是：

- 一个可以自动运行的测试套件
- 一个可以迭代的页面原型
- 一个watch所有HTML/SCSS的脚本+live-reload
- 一个和你一起写代码的同事（结对编程）

![](/images/2018/01/gulp-serve-resized.png)

另一方面，你需要不断的学习和练习，提升自己的技能，这样在遇到新的问题时才可能比较从容应对。不要忘了，**更熟练的技能**本身也是进入心流的重要条件之一。