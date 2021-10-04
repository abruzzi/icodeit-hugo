---
title: "抽象的不同层次"
date: 2020-07-09
slug: "2020/07/levels-of-abstraction"
categories: ["abstraction", "learning", "coding", "methodology"]
---

## 一个关于抽象的故事 

**抽象能力**应该是程序员所需要具备的、再如何强调都不为过的、最重要的能力了。通过`抽象`，我们可以从纷纭错乱的、独立的、看似互不干涉的大量问题中解脱出来，找到一个方案，然后一举解决`一类`问题。

由于抽象是提取了众多具体事物的某种特征并进行了简化的结果，抽象的概念有时候反而会阻碍我们的思考（大概人的大脑更喜欢具体的事物吧）。这时候我们与需要`具体`的实例来帮助理解。也就是说，在思维活动中，不论是代码编写，还是方案设计时需要不断的从实例中提取概念并形成抽象，又需要不时的将抽象具体化成实例来验证理论。[Bret Victor](https://en.wikipedia.org/wiki/Bret_Victor)曾将这个过程比作**抽象的梯子**是非常有见地的 -- 你需要不断的爬上爬下，从高处看一看概览，然后回到地上做一些实际而具体的动作。

另一个有趣的事实是，抽象可以有多个层次，当我们终于脱离了众多细节，建立起更高层的概念时，这些高级（high-level）的概念又变成了新的细节，而我们又可以基于这些细节作出新的抽象。就好比我们现在使用`JavaScript`或者`Python`来写程序的时候，基本上不需要考虑诸如寄存器的编码含义，机器指令长度等等细节，也无需关注内存的分配和释放等等细节，而只需关注业务功能即可。

这么说起来太过于抽象，我们来看一个具体的例子吧。

### 背景介绍

在这篇文章中，我希望通过对*一个模拟项目的自动化测试*（使用[cypress](https://www.cypress.io/)）的重构来描述一些代码编写/重构时的模式。其中涉及到的重构方法比较常规，并没有高深的技巧，不过我觉得通过详细解析一个从`可以工作的代码`演进为`较为整洁`且`便于理解/修改`的测试用例，整个过程还是比较有趣的，希望你也可以有所收获。

所谓模拟项目，是对我从2019年1月到10月所经历的一个项目的模拟。纯粹从业务来说，该项目的业务规则/逻辑并不是十分复杂，不过技术细节上有很多值得反思的地方。我们的自动化测试也是经历了N个版本的迭代，最后我也成功将这篇文章中描述的模式应用到了该项目中，效果也是比较令人满意的。

这里的模拟应用`Questionnaire`是这样一个服务：通过类似调查问卷的方式来输入用户技能，角色，技术水平，项目偏好等等，根据后台的规则引擎来返回一些最适合用户的`offer`列表。后台的计算逻辑我们这里刻意将其淡化，这里只关注信息的采集部分。

应该注意的是，这里的调查问卷是动态的，比如如果对问题`Q1`选择了答案A，则下一个问题会变成`Q303`，如果选B的话则需要回答问题`Q1024`等。也就是说，问卷的路线有可能是多条的，而且每一条都是同等重要的（至少在测试里需要完整走通一遍）。

![](/images/2020/07/ui.png)

从界面上来看，我将整个问卷简化成了3步，实际场景里则可能是10+步，而且每一步中需要回答的问题长短不等，有些问题*展现/隐藏*还会依赖于**前面**某一步/某几步用户的答案等。用户只有完成了当前所在的步骤的所有必选项之后，才可以进入下一步（Next按钮才会可用）。

### 抽象101 - 函数

从功能测试编写的角度来看，将每个步骤视为一个独立的单元是一个*合理*的做法。每一个步骤需要做的事情也非常类似：

1. 验证该步骤的**标题**是正确的
2. 填写该步骤的所有**必选项**
3. 点击**下一步**按钮

![](/images/2020/07/english-section-example.png)

在写一个`section`的测试时，直观的通过`cypress`提供的API的结果大致为（假设这里的所有`data-test`标记我们已经在应用代码中打好了桩）：

```js
it('Verify the basic information section', () => {
  cy.get('[data-test="step-title"]').contains('Basic information');
  
  cy.get('[data-test="email-address"] input').type('juntao.qiu@gmail.com');
  cy.get('[data-test="assignment"] input[value="assigned"]').check();
  
  cy.get('button[data-test="next-button"]').click();
});
```

第二个`section`的流程大同小异，都是先用`selector`找到页面元素，如果可以找到的话，通过`cypress`的API来模拟用户的实际操作：

```js
it('Verify the details section', () => {
  cy.get('[data-test="step-title"]').contains('More details');

  cy.get('[data-test="ps-role"]').click();
  cy.get('[data-value="dev"]').click();

  cy.get('[data-test="developer"] input[value="frontend"]').check();
  cy.get('[data-test="rating"] [for="rating-4"]').click();
  
  cy.get('button[data-test="next-button"]').click();
});
```

如果**逐字对比**的话，每行代码几乎都不一样，但是如果仔细看又会发现很多`重复`。消除这些重复显然可以让代码干净一些，可读性也可以得到提高。一个立即可以想到的重构方法是**抽取函数**，将*验证标题*和*点击下一步*抽取如下：

```js
const checkStepTitle = (title) => {
  cy.get("[data-test="step-title"]").contains(title);
}

const goToNextStep = () => {
  cy.get("button[data-test="next-button"]").click();
}
```

这样相应的测试就可以简化成：

```js
it('Verify the basic information section', () => {
  checkStepTitle("Basic information");
  
  cy.get('[data-test="email-address"] input').type('juntao.qiu@gmail.com');
  cy.get('[data-test="assignment"] input[value="assigned"]').check();
  
  goToNextStep();  
});

it("Verify the details section", () => {
  checkStepTitle("More details");
  
  cy.get('[data-test="ps-role"]').click();
  cy.get('[data-value="dev"]').click();

  cy.get('[data-test="developer"] input[value="frontend"]').check();
  cy.get('[data-test="rating"] [for="rating-4"]').click();
  
  goToNextStep();
});
```

这两段代码实际上也有很多重复，如果将中间的细节模糊掉，我们可以看出这两段代码非常类似。

![](/images/2020/07/test-cases-snippet-case.png)

如果将中间的`cypress`的*具体操作*合并到一个函数中：

```js
const fillOutBasic = () => {
  cy.get('[data-test="email-address"] input').type('juntao.qiu@gmail.com');
  cy.get('[data-test="assignment"] input[value="assigned"]').check();
}
```

然后再定义一个*模版函数*来完成这样几个动作：

1. 验证步骤的**标题**
1. 执行一系列或长或短的**操作**（填写表单）
1. 点击**下一步**按钮

```js
const verifyStep = (title, verifier) => {
  checkStepTitle(title);
  verifier();
  goToNextStep();
}
```

这样一来，我们的测试代码则可以近一步简化为:

```js
it("Verify the basic information section", () => {
  verifyStep("Basic information", fillOutBasic);
});
```

相应的第二个测试用例则可以变为：

```js
it("Verify the details section", () => {
  verifyStep("More details", fillOutDetails);
});
```

### 抽象102 - 更多的代码简化

由于第二个section中的流程可以有多个分支：对于`Developer`来说，需要回答**3**个问题，而对于`QA/BA`则只需要回答一个问题。我们需要多个*测试用例*来覆盖每个分支：

```js
const fillOutDetailsForDev = () => {
  cy.get('[data-test="ps-role"]').click();
  cy.get('[data-value="dev"]').click();

  cy.get('[data-test="developer"] input[value="frontend"]').check();
  cy.get('[data-test="rating"] [for="rating-4"]').click();
}

const fillOutDetailsForQA = () => {
  cy.get('[data-test="ps-role"]').click();
  cy.get('[data-value="qa"]').click();
}

const fillOutDetailsForBA = () => {
  cy.get('[data-test="ps-role"]').click();
  cy.get('[data-value="ba"]').click();
}
```

显然这会引入很多类似的代码，而且大量的`cy.get`这样的代码读起来也非常不直观。如果我们能将诸如`点击`/`选中`DOM元素这类底层的实现（噪音）消除掉的话，则代码的整洁程度又可以得到新的提升。

假如我们有这样的一组`API`：

```js
const select = (selector, value) => {
  cy.get(`[data-test="${selector}"]`).click();
  cy.get(`[data-value="${value}"]`).click();
}

const checkbox = (selector, value) => {
  cy.get(`[data-test="${selector}"] input[value="${value}"]`).check();
}
```

则`fillOutDetailsForDev`函数可以修改为：

```js
const fillOutDetailsForDev = () => {
  select("ps-role", "dev");
  checkbox("developer", "frontend");
  rating("rating", "4");
}
```

而这时候`fillOutDetailsForQA`就会得到简化：

```js
const fillOutDetailsForQA = () => {
  select("ps-role", "qa");
}
```

虽然从代码量上没有太大差异，但是我们已经将*业务逻辑/测试逻辑*和底层`cypress`的DOM操作彻底分离开了。甚至后面如果我们对前端组件进行了更新/更换，那么至少我们的*测试逻辑*部分是不需要做任何修改的，只需要修改诸如`select`/`checkbox`这些工具函数的实现。

### 具象101 - 内联（inline）

这时候我们发现，如果将诸如`fillOutDetailsForDev`及`fillOutDetailsForQA`这样的 `命名函数`内联回去可能会有更大的灵活性：毕竟表单中的必选项随着时间会不断变化，*问题*可能会增加或者减少，使用匿名函数可能更适合我们的场景：

```js
it("Verify the details section for developer", () => {
  verifyStep("More details", () => {
    select("ps-role", "dev");
    checkbox("developer", "frontend");
    rating("rating", "4");    
  });
});

it("Verify the details section for QA", () => {
  verifyStep("More details", () => {
    select("ps-role", "qa");
  });
});
```

这样的代码比最开始强依赖于`cypress`底层API的要好一些了，每一步的操作更加倾向于表明我们**想要做**什么，而不再关注**如何**做到。

这时候我们再来仔细看一看，对于一个`User Journey`的完整测试的代码（这里只有3个步骤，读者可以自行脑补10个步骤的场景）：

```js
it("Verify the details section for developer", () => {
  verifyStep("Basic information", () => {
    input("email-address", "juntao.qiu@gmail.com");
    checkbox("assignment", "assigned");
  });
  
  verifyStep("More details", () => {
    select("ps-role", "dev");
    checkbox("developer", "frontend");
    rating("rating", "4");    
  });
  
  verifyStep("Project preferences", () => {
    checkbox("expectancy", "frontend");
  });
});
```

如果你和我一样，看到这三行*"一模一样"*的代码就有一种将其消掉的冲动的话，不如试一试通过数据于代码的分离来消除重复。

### 抽象201 - 代码与数据

在大部分`Functional Programming`语言中，数据和代码的界限事实上非常模糊，通过`eval`/`apply`这样的函数我们甚至可以将两者转换。即使无法做到真正`FP`强调的`代码即数据`，我们至少可以将容易变化（诸如`selector`，问题的下一个关联问题，新增加一个步骤，调整步骤的顺序等等）的部分抽离为数据，而将其和相对稳定的代码分离开来。

在上面的这个场景`Verify the details section for developer`中，我们如果离远了看一眼的话，大约可以将上述的代码**改写**成：

```js
steps.forEach(step => {
  verifyStep(step.title, step.verifier)
});
```

而`steps`可以定义为：

```js
const steps = [
  {
    title: 'Basic information',
    verifier: () => { /*input, select, checkbox*/ }
  },
  {
    title: 'Basic information',
    verifier: () => { /*input, select, checkbox*/ }
  },
];
```

通过这种方式，我们就初步将逻辑外置到一个静态的`配置`中了。当然，此处的`verifier`还依旧是函数，还不够彻底。如果可以更进一步，将诸如`checkbox("expectancy", "frontend")`这样的代码也改成配置的形式，我们就可以彻底的将代码和数据（配置）分开：好处就是修改一个`User Journey`时不在需要修改代码。

#### 一个具体的User Journey

假设我们需要测试一个具体的`User Journey`，即根据这样一些输入：

1. 用户输入了邮箱地址
1. 用户选择当前在beach上
1. 用户选择自己是一名水平中上的前端开发
1. 用户表示想要在下一个项目上尝试`SRE`角色

通过这些信息，我们的应用需要计算出目前系统可以`offer`的项目清单，并以列表形式展现。对于这个`User Journey`的一个直观的定义可以是这样的：

```json
const steps = [
  {
    "title": "Basic information",
    "fields": [
      "input:email-address:abruzzi.dev@gmail.com",
      "checkbox:assignment:assigned",
    ]
  },
  {
    "title": "More details",
    "fields": [
      "select:ps-role:dev",
      "checkbox:developer:frontend",
      "rating:rating:4",
    ]
  },
  {
    "title": "Project preferences",
    "fields": [
      "checkbox:expectancy:frontend",
    ]
  }
];
```

如果我们有一个可以将`fields`中的表达式翻译成操作指令的映射函数，我们就可以**执行**这段配置：

```js
const executeCypressCommand = (field) => {
  const [type, selector, value] = field.split(':');
  switch (type) {
    case 'input': return input(selector, value);
    case 'checkbox': return checkbox(selector, value);
    case 'select': return select(selector, value);
    case 'rating': return rating(selector, value);
    default: return null;
  }
}
```

这样：

```json
"fields": [
  "input:email-address:abruzzi.dev@gmail.com",
  "checkbox:assignment:assigned",
]
```

就被执行为：

```js
input('email-address', 'abruzzi.dev@gmail.com');
checkbox('assignment', 'assigned');
```

而在实际运行时，`input`和`checkbox`又会被转换成底层的`cypress`指令：

```js
cy.get('[data-test="email-address"] input').type('abruzzi.dev@gmail.com');
cy.get('[data-test="assignment"] input[value="assigned"]').check();
```

通过这种模式，我们定义一个新的`User Journey`就变成了对`json`文件的编辑。这个`json`被加载之后，经过解释器的翻译，形成`cypress`指令并最终在浏览器中执行：

![](/images/2020/07/output.gif)

有了这个翻译器之后，对于表单中添加的新的问题（必填项）就会变得非常容易，也很容易做到和`UI`代码的一致。

当然，如果将测试用例**外置**于测试运行时之外看起来太过于激进，那么仅仅使用我们抽象出来的**工具函数**自身也可以提高代码的可读性和减少对底层DOM操作的依赖：

```js
verifySection('Basic information', () => {
  input('email-address', 'abruzzi.dev@gmail.com');
	checkbox('assignment', 'assigned');
});

verifySection('More details', () => {
  select('ps-role', 'qa');
});
```

### 抽象202 - 用例

这样，我们从最开始的`cy.get(*)`就过渡到了一组经过高度抽象的，专为本`domain`工作的API，这些API在很大程度上和编写测试的人所使用的语言保持了契合。

这时候如果我们来审视测试用例的话：

```js
it('explore journey for developers', () => {
  runJourney(developerJourney)
});

it('explore journey for qas', () => {
  runJourney(qaJourney);
});
```

则会发现他们在某种程度上依旧是重复代码，还记得上面关于`steps`的那次重构吗？只需要类似这样的一个`forEach`就可以依次执行每个`User Journey`。

```js
journeys.forEach((journey) => {
  it(journey.title, () => {
    runJourney(journey);
  });
});
```

这样无论有多少个`User Journey`，我们都无需再修改测试代码了。对于`Journey`的加载，只需要使用ES6的`import/export`即可：

```js
import {journey as qaJourney} from "./qa";
import {journey as baJourney} from "./ba";
import {journey as devJourney} from "./developer";
import {journey as devBeachJourney} from "./developer-on-beach";

const journeys = [
  qaJourney,
  baJourney,
  devJourney,
  devBeachJourney,
];

export default journeys;
```

而每个`journey`文件则仅仅是一个静态的`JSON`，如果我们重构出来的这部分框架代码足够稳定的话，对于`journey`的修改（增删改）我们基本上不用涉及任何代码的修改了。

### 小结

本文通过对一个功能`测试suite`的重构，介绍了一些`如何做抽象`的方法/模式，最终使得测试代码中会*频繁变化*的部分被提取到了一个相对独立的`json`文件中，从而使得*潜在的修改*变得更加容易和集中。

最简单的抽象是将代码中重复出现的部分**抽取为函数**。而近一步的方法是将逻辑上内联的代码块抽取为函数，并通过**高阶函数**的方式完成抽象并复用。当出现多条类似相同结构的语句时，则可以考虑使用**数据+`each/map`**的方式将*代码*和*数据*分离开。

当然正如[Bret Victor](https://en.wikipedia.org/wiki/Bret_Victor)的比喻那样，这个过程可能是迂回的，迭代式的。我们很难再最开始的的时候就清楚代码最终的形态，中间甚至会有从抽象到具象（inline）的迂回，不过这些`back and forth`既是无法避免的，也是不可缺少的。很多时候，重构需要经过多个方向的抽象/具象的尝试和多轮的循环往复，才能使代码处于一个比较理想的状态。需要注意的是，这个所谓的`理想状态`也不会永远处于理想状态，在下一次打破平衡的变化出现之后，我们可能需要再一次应用这些技巧来重新构造抽象的层次及维度，来适应新的变化。

