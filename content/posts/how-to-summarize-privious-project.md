+++
title = "如何总结你的上一个项目"
date = "2016-01-05"
slug = "2016/01/how-to-summarize-privious-project"
Categories = [" ThoughtWorks", " Life"]
+++
# 下项目之后

通常来说，下项目总是一件比较高兴的事（大部分团队还会一起吃个饭庆祝一下）。这里面既有终于摆脱了厌烦了的`技术栈`的解脱感，也有对新项目/新技术的向往，可能还有些在旧项目中做的不太满意的事情，可以在新项目重头再来的期望。

可能有点老生常谈了，不过这里我想说说下项目后如何做总结的事儿。对上一个项目的总结，其重要程度可能要远远超过你的想象。我是在2014年初，在一个客户现场的一个会议室和一位同事谈我的Annual Review的时候，才意识到这个问题的。

Annual Review会回顾我们过去一年的项目经历，有哪些方面的进步，同时也会展望未来的计划。但是这其中有几个问题：第一个问题是以年为单位的Review粒度太粗，有些经历已经淡忘，也有人可能一年会换好几个项目；第二个问题是对于大多数人来说，展望未来是一件比较容易的事儿，每个人或多或少都会有一些计划（比如学会前端的某些技术，尝试一些DevOps方面的工作，或者了解一下大数据等等）；但是对于回顾过去，我们其实并不擅长；最后一个问题是即使做了回顾，回顾的层次非常浅，作用并不大。

说到回顾过去，更多时候我们关注的是从项目中学到了什么样的新技术，这种浅层次的回忆和记流水帐是容易的，但是对于我们的成长并不会有太大的收益。真正会为帮助我们在将来的项目中做决策，甚至会影响我们学习效率，解决问题能力的是：`深度回顾`。

## 深度回顾练习

深度回顾可以帮助我们梳理知识，将实际的案例归纳总结为实际可用的知识。要获得这种能力，需要做一些针对性的练习。根据我自己的经验，这些练习大约可以归为3类，难度依次增加。

### 项目上的直接经验

这个练习比较简单，就是问问自己：“**我在项目里学到了什么？**”

要回答这个问题是很容易的，项目中用到的技术如模板引擎，前端框架，自动化测试套件，build工具等等，总结这些内容的过程，对于我们的PS来说都是“自动”发生的，几乎不需要付出额外的efforts。这些回顾、总结可以帮助我们成为一个“熟手”，即当下一次遇到相同或者类似的场景时，我们可以很容易直接应用这些经验。

更进一步，再问问自己在项目中的其他收获。比如客户关系处理的经历，团队建设的经验，甚至是写英文邮件的技巧等等方面，看看做的有没有问题，有没有提升的可能？

人类最牛逼的技能是：可以审视自己的行为。也就是站在旁观者的角度来看待自己的行为，随波逐流式的在各种琐事中沉浮事实上无法得到提升的。可以经常性的将自己置身事外，以一个旁观者的角度来审视自己做过的事情。并从中找出做得好的地方和不足的地方，然后自己给过去的自己一些建议，并记录下来。这些刻意的练习会帮助你养成回顾，从经验中学习的习惯，而这个习惯正是一个人区别于另一个人的绝对“捷径”。

### 练习讲故事

这个练习是，假想你遇到了一个同一个办公室的同事，他对你刚做完的这个项目很感兴趣，你来给他描述一下这个项目。描述的内容包括但不限于这些方面：

-  项目的背景介绍
-  该项目以何种方式，为那些用户，带来了什么样的价值？（business model是什么）
-  该项目的实际用户数量是什么级别？
-  项目的部署，运维是如何操作的？
-  项目的监控是怎样做的？
-  当遇到系统故障，项目组是如何反应的？

能把一件事情描述清楚是一件非常了不起的能力。我见过很多的程序员，写起代码来好不含糊，但是却很难将一件简单的事情讲清楚。我们当然要提防那些夸夸其谈，华而不实的“嘴子”，但是也至少得要求自己做到清晰，准确的将自己经历过的事情描述清楚。

描述项目背景需要至少需要交代这样一些内容：客户是谁，最终的消费者是谁，项目以何种方式运作（离岸交付，本地，onsite，咨询，培训等），我们**帮助客户为消费者带来了什么样的价值**。客户的商业模式是什么，在我们周围有哪些类似的项目。

![business canvas](/images/2016/01/bmcanvas-basic-model-resized.jpg)

即使在技术方面，也有很多被Dev忽略掉的信息，比如项目在产品环境中如何部署，数据中心建在何处，客户如何运维、监控等。实际的发布周期如何，发布流程如何，客户的内部论坛上都会有很多的这样的信息，但是很少有人关注。从一个项目roll off的时候，这些信息即使做不到了若指掌，至少也能描述清楚，否则难免有些“入宝山而空回”的遗憾。

### 回顾项目中的挑战

从简单的CRUD系统，到复杂的分布式计算，从企业内部的管理系统，到支持高并发、要求实时处理的交易平台，每个项目都会遇到一些挑战。除了技术上的挑战之外，还有陈旧而无文档的代码库，复杂的业务场景，不配和的客户接口人等等。挑战无处不在，那么作为项目中的一员，你是如何应对这些挑战的呢？最后又是如何解决的？

现实世界是一个充满了trade off的世界，我们需要做种种权衡，代码测试覆盖率和交付压力，性能和客户能负担的机器实例数量，框架A和框架B的优劣等等。我们在采取这个方案的时候，只能舍弃其他方案，由于谁也无法在事先准确预料采取某个方案一定是对的，那么在一个失败的方案背后，其实也是一个很好的教训，至少可以为未来的决策提供帮助。

-  遇到的最大的挑战是什么？
-  这个挑战是如何被解决的？
-  如果有机会重做，你会如何考虑？

### 其他练习

这里列出了一些我常用的，辅助性的练习。它们可以帮助你更好的梳理项目上学到的技能、知识，并且转换成你自己的知识。这些练习未必一定要等到项目结束之后才做，事实上它们都可以应用在日常的工作中。

-  记笔记
-  写博客
-  在办公室内演讲
-  去社区贡献话题

很多人都会记笔记，但只有一小部分的人在记录之后会持续翻阅。很多人会使用Evernote/印象笔记之类的工具将一些临时的想法，问题的思路，知识点的细节等记录下来，但是仅仅记录是不够的，笔记需要不断的检索、整理、提炼、修正、总结和归纳。在不断的加工之后，这些笔记可能会得到沉淀，并升华形成一些更有意义的内容（比如个人博客，或者可以发表到InfoQ/IBM DeveloperWorks平台上的文章等）。

除了记录笔记之外，写博客也是一种很好的总结形式。通过将素材不断充实、整理、完善，最终形成一个可供别人直接消费的文章，不但可以锻炼到总结能力，还可以很好的提升表达能力，而且可以帮助你将已有的知识体系化。如果你的博客写成了系列，也很容易通过Gitbook等将其发布为一本电子书，从而影响更多人（说不定还可以赚点咖啡钱）。

写博客/电子书，终究是书面形式的。事实上一个人可以很容易的通过文字将自己的实际情况隐藏起来。举个极端的例子：如果有足够的动机（比如公司的KPI要求），即使不熟悉某种语言/工具，仅仅通过Google，一个人也可以通过这种“作弊”的方式写出一篇“专家级”的文章。但是对于演讲这种面对面的形式，则基本上无法作弊，从而也更具有挑战性。另一方面，对于一个新的知识、技能，自己掌握是一回事儿，要讲出来让别人也能听懂，并从中收益，则完全是另外一回事儿。作为咨询师，语言表达（包括书面和演讲）能力的重要性勿庸赘言。整理知识，并归纳为演讲，会帮助你将体系化后的知识更好的表达出来。

在办公室里讲session有一定的挑战，但受众毕竟是“自己人”，压力相对会小一些（比如在ThoughtWorks，我们非常鼓励员工为其他人讲session，具体可以参看[我的这篇文章](http://icodeit.org/2015/01/how-we-do-training-in-thoughtworks/)）。要在社区中演讲则要面临更大的挑战，通过将话题不断锤炼，不断归纳，最终形成可以在社区分享的话题，则不但可以提高内容的质量，也可以更好的锻炼表达能力和临场应变能力。

![xian community](/images/2016/01/xian-resized.jpg)

不过归根结底，这些活动的重要输入还是对之前项目中的知识、经历的深度回顾。

## 总结

从项目上下来之后，需要深入思考并总结之前的经验，这种深入思考会帮助你建立比较完整的知识体系，也可以让你在下一项目中更加得心应手，举一反三。如果只是蜻蜓点水般的“经历”了若干个项目，而不进行深入的总结和思考，相当于把相同的项目用不同的技术栈做了很多遍一样，那和我们平时所痛恨的重复代码又有什么不同呢？
