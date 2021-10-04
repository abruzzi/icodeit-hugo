---
title: "7个你需要知道的结对礼仪"
date: 2018-12-07
slug: "2018/12/07/pair-programming"
categories: ["pair", "agile", "efficiency", "methodology"]
---

# 7个你需要知道的结对礼仪

> 结对编程远远不是两个程序员坐在一起写代码那么简单。 — 鲁迅（没有说过）

## 结对编程

结对编程可能算是比测试驱动开发更具有争议的敏捷实践了，事实上，仅有很少的团队可以很好的实施它并从中受益，对于更多的团队来说，即使在践行敏捷的团队中，也常常会分为旗帜鲜明的两个阵营。提倡者往往会强调结对编程在“传递领域知识”，“减少潜在缺陷”，“降低信息孤岛的形成”等方面的作用；而反对者则认为结对编程在很多时候都是在浪费时间：开发者在实践中很多时候都难以聚焦，容易产生分歧，另外个人的产出往往也难以度量。

![](/images/2018/12/pair.JPG)

这篇文章不打算讨论结对编程对效率的影响，也不讨论要不要进行结对编程，当然也不会涉及以何种力度来执行结对。这里的假设是团队决定采用结对编程，但是对于如何实施存在一些疑虑；或者已经在采用结对编程的团队里，发现很多时候结对编程并没有很好的发挥作用，需要一些更有实践意义的指导。

结对编程远远不是两个开发者坐在一起写代码那么简单。作为一种科学且充满趣味性（才不是）的工程实践，事实上它是有一些基本原则的，团队里的开发者需要正确的实施这些原则，结对编程才有可能为团队带来实际的受益。

假设你找到了另一个程序员，并且已经准备好一起来编码实现一个具体的业务需求。在开始着手开始结对之前，你首先需要setup环境。


## 硬件设置

工欲善其事，必先利其器。首先你和你的peer需要一个大的外接显示器和有一个可以调节高度的桌子（当然也可以用纸箱子DIY一个低配版）。这一点往往被初学者忽视，而事实上它可以直接决定结对能不能作为一个可持续的团队工程实践。如果你的颈椎长时间处于不舒服的状态，你的注意力很快会退散，精神会变得难以集中，而一个处于病态的身体是无法支撑长时间的编码工作的。

在开始之前，请将屏幕调整到舒适的高度，以不仰头不低头为度（身高不一样的两个人可以通过调整椅子的高度达到基本一致）。此外还要注意看屏幕的角度，如果你需要抻着脖子才能看清楚屏幕，那么当时间稍长一点时，你的颈椎也会非常吃力。因此，如果条件允许的话，你和你的peer可以使用双屏来进行结对。 

当然，还有一些常见的其他关于硬件准备的细节，比如：

* VGA/HDMI转接头
* 充足的电源
* 键盘/鼠标转接头
* 便签和笔

纸和笔永远是你（们）的好朋友，在实际动手写代码之前，请拿出纸笔来将要做的事情划分成更细粒度，可以验证的任务列表，贴在显示器的下边缘。最后，另外记得将手机调成震动模式，利人利己。

![](/images/2018/12/setup.JPG)

## 软件设置

硬件准备好之后就可以进行软件的配置了。软件问题远比硬件复杂，因为大部分开发者都有自己钟爱的工具集，小到curl/wget，大到Vim/Emacs，不要期望在这个问题上和peer达成一致，这是可遇而不可求，可望而不可即的。

根据我自己的经验而言，高级一些的IDE比如JetBrains出品的Intellij，WebStorm等都可以随意切换快捷键集合（keymap）。如果你和peer就快捷键的使用上无法达成一致，在轮到你输入代码的时候，你可以切换到自己熟悉的Keymap，反之亦然。

在Intellij/WebStorm里，你可以通过 `ctrl+`` 来切换各种设置，比如选择`3`就可以切换不同的Keymap，然后在下一步的窗口中按照自己的喜好进行切换预设的Keymap。某项目的王晓峰（Vim党）和张哲（Emacs党）尤其擅长此技，他们两人结对时，可以做到在抢键盘的瞬间将keymap切换到自己的挚爱而对方无察觉的地步。

![](/images/2018/12/switch-keymap.png)

这种技法事实上仅仅对于结对双方都有很高超的键盘操作能力的前提下，也唯有这种场景下，双发可以互不妥协。对于另一种场景（可能在实际中更为常见），比如结对一方键盘技巧和操作效率低下，影响结对流畅程度的场景，则需要效率低下的一方自己摒弃陋习（使用鼠标而不是键盘），快速赶上。

和别人结对之前，你需要至少熟悉一个IDE/编辑器，比如通过纯键盘的操作完成

- 按照名称查文件
- 按照内容搜索
- 定位到指定文件的指定行/指定函数
- 选中变量，表达式，语句等
- 可以快速执行测试（可以在命令行，也可以在IDE中）

熟常基本Shell技能和常用命令行工具的使用，可以完成诸如

- 文件搜索
- 网络访问
- 正则表达式的应用
- 查找替换文件中的内容

等操作，这样在结对时可以大大提高效率。这些都是稍加练习就可以掌握的技能，并没有多少技术含量在内，而且学会了可以收益很久。

## 当知识不对等时

好了，铺垫了这么多，终于到了正题部分。最理想的结对状态是，双方的技能水平相当，知识储备基本类似，可以非常流畅的进行交流，在结对过程中可以完全专注在需要解决的问题本身上，讨论时思想激烈碰撞，编码时键动如飞，不知日之将夕。这种场景下完全不需要任何技巧，随心所欲，自由发挥即可。与此对应的另一种场景是双方都没有任何储备，技能也无法胜任，这种情况我们需要在项目上完全避免。

这两种极端的情况之外，就是不对等的场景了，这也是现实中最为常见的case：很多时候，结对双方会有一个人比较有经验，而另一个人则在某方面需要catchup。比如一个老手带一个新手，或者一个擅长业务的开发和另一个该领域的新人结对等。

一般而言，需要双方有一个人来做主导，另一个人来观察，并在过程中交互，答疑解惑，共同完成任务。与传统的教与学不同的是：结对需要的是两个智慧头脑的碰撞，而不是单方面的灌输。因此观察者不是单方向的被动接受，主导者也并非完全讲述。事实上结对是一个会有激烈交互的过程。

### 主导者

对于主导者来说，千万不要太投入，而无视peer的感受。这种场景非常常见，我自己有时候也会不自觉的忽略掉peer，自顾自的写代码，很多时候把peer当成了小黄鸭。这时候你的peer会有强烈的挫败感，也很难跟上你的节奏，从而影响结对的效果。作为主导者，需要更耐心一些，不断的和自己的peer交互。

![](/images/2018/12/rubber-duck.jpeg)

另一个极端是，主导者太热心的coach，而忽视了给新人实际锻炼的机会。这时候需要主导者给peer更多的实践机会：比如在带着新人编写了一个小的TDD循环（红绿重构）之后，可以抑制住自己接着写的冲动（我知道这个非常困难），然后将键盘交给你的peer，让他模仿你刚才的做法来完成下一个。

有时候，当你看到peer正在用一个不好的做法来完成任务时，你可以即使让他停下来，并通过问问题的方式来启发他：

* 还有更好的做法吗？

如果peer仍然在迟疑的话，你可以进一步提示：

* 你觉得XXX会不会更好？

一个实际的例子是，你们在写一段JS代码来迭代一个列表，你的peer正在用for循环来操作一个数组，而你可以提议使用Array.map。有些时候，你的peer会给你一些惊喜的回答！他的回答甚至比你预想中的更加出色，你也可以通过这种方式来向他学习。


### 观察者


另一方面，作为观察者而言，结对毋庸置疑是一种特别好的学习机会，你应该抓住一切可能的机会来向你的peer学习。包括快捷键的使用，命令行工具参数的应用，良好的编程习惯等等。保持你的专注力和好奇心，比如你看到peer神器的通过快捷键删除了花括号（block）中的所有代码，或者将curl的返回值以prettify过的样式打印到控制台，或者通过命令行merge了一个PR等等。

在实践的时候，可以采取Ping-Pang的方式来互换主导者和观察者的角色。比如，A写一个测试，B来写实现，A来重构，然后换B来写测试，A来实现，B来做重构等等。开始时，可能会由一个人来主导，随着合作越来越顺畅，你们可以提高交换的频次。

## 保持专注

在选定了要两人一起解决的问题之后，你们需要一起完成任务划分。这样可以确保你们可以永远关注在单一任务上，避免任务切换带来的损耗。

在做完一项任务后，用mark笔轻轻将其从纸上划掉（或者打钩）。千万不要小看这个小动作的威力，它既可以将你们的工作进度很好的表述出来，也可以在任何时候帮助你们回到正在做的事情上（特别是在吃完午饭之后），另外这个微小的具有仪式感的动作是对大脑的一个正向反馈，促进多巴胺的分泌（代码写的这么开心，还要什么女朋友？）。

![](/images/2018/12/cross-note.png)

很多时候，我们需要暂时搁置争议，保持前行。

### 无法统一的意见

如果你遇到了一个固执己见的同事，而不凑巧的是你也是一个难以被说服的人，那么如何处理那些无法避免的争论呢？特别是那些没有对错之分的技术问题。比如那种编程语言更适合Web开发，比如如何践行TDD（比如自顶向下的`TDD`和自底向上的`TDD`）等等。

有时候，我们会非常坚持自己觉得对的东西，觉得那就是真理。挑战这个真理的不是傻就是二，但是用不了多久，我们就会发现，换个角度好像也说得通，特别是在和其他人结对，并突然意识到以前的那个完全无法接受的做法似乎还是有几分道理的。

在我刚做完的一个前端项目中，做技术选型时我自然的选了更早项目中使用的`scss module`，而团队里的另一个同事则提议使用`styled-component`。我们谁也没有说服谁，最后写代码的时候就有两种风格。直到有一天，我在代码库里看到了用`styled-component`写的很漂亮的组件，我自己尝试着把相关的`scss`重写成`styled-componet`，结果发现确实比单独的`scss`文件要更好维护一些，而且也不影响既有的测试。

我突然意识到，我所坚持的只是一个假的”真理“，先前的坚持和做技术选型时的理由就变得很可笑：那只不过是为了使用自己熟悉的技术而编造的理由而已。保持open mind是一件知易行难的事情，希望大家在争辩时能念及这个小例子，可能会少一些无谓的争辩。

对于这种难以统一意见的场景，我建议可以将其搁置，先按照某一种提议进行，知道发现明显的，难以为继的缺陷为止。往往你们会发现一条比较折中的路，或者一个人被另一个人说服。

### 棘手的任务

即使很有经验的程序员也会遇到新的领域，或者在熟悉的领域遇到新的困难。有些情况下，作为结对的两个人都对要完成的主题没有头绪。这时候非要挤在一起反而会降低速度，无助于问题的解决。

一个好用的实践是，两人分头研究，并严格控制时间。比如Time box 30分钟。不过很可能在30分钟后，你们中至少有一个人已经对要怎么做有了头绪，如果30分钟还没有头绪，则可以求助团队其他成员。

比如我在最近项目上遇到了Kerberos认证的问题，我和peer都没有接触过，在经过20分钟的独立spike之后，我发现了一篇细节很丰富的，看起来很靠谱的技术博客，而我的peer则在内部github上找到了另一个团队的可以工作的代码（虽然代码质量不是很好）。我们最终决定copy+paste，然后做重构的方式继续前进。而那篇技术博客则是一个很好的课后学习的资料。

## 张弛有度

注意力是一种非常稀缺的资源，普通人很难全神贯注在某件事情上超过30分钟。一旦超过这个时间，大脑就开始偷懒，开小差。这时候一个短暂的break可以让大脑得到很好的休息。人类的大脑有一个非常有趣的特性，就是它的后台任务处理能力 — 而且后台处理能力好像远远强大于前台。你可能会在去冲咖啡的路上，突然灵光一闪，那个困扰你多时的问题有了思路，而此时此刻的你的大脑明明在想如何用咖啡机冲一份拿铁。

如果遇到一个难以理解的bug，或者在设置测试环境是遇到了困难，休息一下很可能帮助你找到解决问题的新角度。为了避免长时间纠缠在冥思苦想中，你和你的peer可以采取比如番茄工作法之类的时间管理工具：

1. 从Todo列表中找出下一个任务
2. 设置一个不可中断的25分钟，开始工作
3. 时间到了之后，休息5分钟
4. 重复2-3，4次之后休息15分钟

这里有一个[在线工具](https://alloyteam.github.io/AlloyTimer/)可以直接使用 ，你也可以用手机的闹铃工具。

![](/images/2018/12/pomodoro.png)

## 结对轮换

如果结对的对象长期固定的话，pair本身又会变成新的信息孤岛。比如A和B长期负责订单模块，而C和D则一直在写门店管理，那么毫无疑问，一段时间后，A和B就不知道C和D在做什么了，不论是领域知识还是技术实践，都很难得到有效的知识传递。当一个团队规模变成10+之后，这还可能演化成更为严重的项目问题。

因此需要定期或者不定期的轮转，比如一周轮换一到两次，A和C来写订单，B和D来写门店管理，这样可以保证领域知识，工程实践，工具的使用等等知识都很好的在团队内部共享。

在一些场景下，团队采取前后端分离的方式进行开发。前端和后端的技术栈选择大相径庭，每一端都有不同的约定和复杂的配置，这会对结对轮换的实施造成障碍，而且短期来看还会影响开发效率。如果团队再大一些，DevOps可能会独立出一个小组来负责，这将导致结对的轮换更加困难。

在实践中，我发现让不同角色的团队成员轮换结对所带来的好处（伴随着短期阵痛的）远胜过知识的隔离带来的坏处。团队中的前端开发如果花费一些时间和DevOps一起结对，他会对系统的整个架构更加清楚；而后端开发和DevOps结对则可能让他意识到代码中的潜在缺陷和解决方法（比如会话外置，缓存策略等）。

## 尊重

作为一个最小单位的**团体**活动，你常常要站在你的peer的角度来看问题。如果你不愿意和某一特性的人结对，那么首先不要让自己成为那样的人。比如你讨厌只闷头写代码，不理会peer有没有跟上的那种结对方式；又或者你不喜欢和用鼠标完成又低效又别扭操作的人一起写代码（我在和这样的人结对的时候，都需要费很大力气抑制自己，才不会从peer的手中把鼠标抢过来扔掉），那么首先让自己不是那样的人。


除此之外，尊重还体现在很多其他细节中。当你不得不中断结对而去做其他事情时，务必让你的peer知道。而且在离开之前，你应该表示歉意，不要凭空消失，然后若干分钟后又凭空出现，没有人喜欢和一个不靠谱的人工作。比如10点30分的水果时间到了，你看到有人拿着你喜欢吃的桃子从厨房方向走了回来。你可以示意peer暂停一会，然后去厨房拿点水果，记得给你的peer也带上一些。

另一方面，当你的peer回来之后，你需要及时和他catchup，告诉他你正在做什么，已经做到了哪一步等等。快速的将他带入到上下文中。

### 控制情绪

情绪是一件非常微妙的事情，它具有很强的传染性。当你们的工作任务收到各种blocker，被各种其他事情干扰而导致进度难以推进时，一定要注意自己情绪的控制。如果你的peer一直在旁边唉声叹气，或者抱怨连连，你会变得非常沮丧，并且很难集中精力在积极解决问题上。

你可以通过积极的寻求外部帮助，或者将blocker更快的可视化出来，让团队了解，并提供可能的帮助。

### 课后练习

和你的peer完成了充实而卓有成效的一天之后，你需要总结一下自己记录的知识点，这是一个绝佳的提升自己能力的方法。通过实战，发现自己的缺点，并通过近距离观察别人如何解决该问题，最终会以很深刻的印象记录下来，这时候针对性的查漏补缺是可以取得非常好的效果。

比如你已经习惯使用grep来做搜索，结果你的peer娴熟的awk技巧使你打开眼界，你可以在课后专门学习一下这个工具的各种选项，并尝试熟练应用。或者你们在代码库中探索到webpack的一些特殊配置，它可以良好工作，但是你不是很明白背后的原理，这些都可以放在结对结束之后自己消化。花一些额外时间来更新你的技能可以让你在第二天的结对中更加得心应手，也可以更好的融入到结对编程带来的快乐中。

这些结对的基本礼仪，都是一些微小的细节，做好了可以让和你一起工作的人比较舒服，也会帮助你自己建立一个更加高效的工作环境。

## 小结

在这篇文章中，我总结了一些有关结对编程的常见的问题和解决方法。在开始进行结对之前，首先需要确保硬件设施正确setup，这样可以保证大家可以在很轻松舒适的环境中工作。在软件设置上，保证效率的前提下，可以有不同的偏好设置。当能力不对等时，恰恰是结对编程最能发挥作用的场景，不但对于观察者来说是绝好的学习过程，对于主导者而言，也可以从coach过程中看到一些不同的东西。

在结对编程过程中，你们需要始终保持专注，可以通过任务拆分的方式来帮助一直关注在单一事项上。此外，应该有定期的休息，让紧张的情绪得到缓解。为了避免大尺度上的信息孤岛，团队还需要定期的进行Pair的轮换。

总而言之，通过这些方法的使用，可以有效的促进工作效率，促进个人成长为前提，并和可以形成很好的团队氛围。