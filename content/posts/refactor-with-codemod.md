---
title: "自动化重构 - jscodeshift"
date: 2020-12-11
slug: "2020/12/refactor-with-jscodeshift"
categories: ["jscodeshift", "refactor", "tooling", "agile"]
---

## 自动化重构(jscodeshift)

在这篇文章里我想要通过一些小例子来介绍使用`jscodeshift`来进行自动化重构的技术。具体来说，我想要介绍在一个组件库的开发和维护过程中，如何使用`jscodeshift`来自动修改公开的API接口，从而尽可能小的产生对组件用户的影响。

如果你们团队开发的*组件*被其消费者（组织内部或者外部）使用了，而这些代码又不在你的控制之内，那么这里讨论的*技术和模式*可能对你很有帮助。而如果你的日常工作更多的是*使用*组件库来开发应用程序，我希望这里的知识和技巧仍然对你有所启发，毕竟在软件系统中，我们往往都既是某些库的消费者，又同时是另外一些库的生产者。

### 从一个简单场景出发

设想这样一个场景，你发布了一个酷炫的组件库（fancylib），其中有一个按钮（Button）组件。这个Button的一个属性是当点击后处于加载中（loading）状态时现实一个表示*加载中*的小图标。

![](/images/2020/12/loading.png)(图片来源：https://xd.adobe.com/ideas/process/ui-design/designing-interactive-buttons-states/)

在代码实现中，这个*加载中*状态被定义为了名为`isInLoadingStatus`公开`prop`。用户可以通过设置其值来控制`Button`的状态：

```jsx
import Button from '@fancylib/button';

const app = () => (
    <Button isInLoadingStatus>Click me</Button>
)
```

一个实习生在某一天`code review`的时候提出了一个问题：在组件库中的其他地方，所有的`boolean`状态都是用一个单词来表示的，比如`checked`, `disabled`等。如果按照这个惯例，这里应该把`isInLoadingStatus`简化为`loading`。好主意！

```jsx
import Button from '@fancylib/button';

const app = () => (
    <Button loading>Click me</Button>
)
```

假如所有用到`Button`的地方都在你的控制之内，字符串替换大约是一个快速且80%有效的方案。不过稍微分析一下，你就会发现简单的`Shift+F6`会遇到很多问题。

#### 复杂情况

比如用户对其做了二次包装以适配更符合自己用户的使用习惯，这使得简单的全局字符串替换变成了不可能:：

```jsx
import Button as FancyButton from '@fancylib/button';

const MyEvenFancierButton = (props: FancyButtonProps) => (
    const theme = {
        backgroundColor: "orangered",
        color: "white"
    };
    <FancyButton {...props} theme={theme}>Click me</FancyButton>
);
```

除了这些问题之外，由于这是一个非常受欢迎的组件库，`Button`在很多（包括内部和外部的）产品中都有使用，你没有办法访问所有的用户代码，更没有办法让所有人都用手工的查找替换来做更新，你需要另寻出路。

你需要一个工具 -- 一个可以读懂代码意图的工具 -- 来帮助你做修改，而且整个过程最好可以自动化，比如通过执行一个脚本来完成。

#### 使用jscodeshift

`jscodeshift`就是这样一个工具（工具集）。简单来说，`jscodeshift`的工作方式就是将源代码分析成一棵树（抽象语法树），然后提供`API`来修改这棵树，最后再把树生成为代码。

![](/images/2020/12/transform.png)

也就是说，她可以*读懂*你的代码，并提供指令（API）来根据你的意愿修改相应的代码。

### 实现

接下来，我们可以通过实现一个可以完成上述场景的自动重构的脚本来对`jscodeshift`的使用做一个简单介绍。简单来说，`jscodeshift`的工作流程是：首先你需要定义一个转换脚本（transform），这个脚本需要符合一定的规范以便`jscodeshift`调用；然后`jscodeshift`的命令行工具会启动`runner`，并将转换脚本***应用***到某个文件或者某个文件夹中的所有文件中：

```shell
jscodeshift -t myTransform src
```

#### 定义一个transform

也就是说，我们所有的逻辑都会定义在转换脚本中。`transform`脚本需要导出一个固定格式的函数：

```tsx
import { Transform } from "jscodeshift";

const transform: Transform = (file, api, options) => {
  //...
};

export default transform;
```

`file`为解析后的文件对象，`api`是`jscodeshift`的API对象，可以通过它来查找，修改文件对象，`options`是一个可选的，用来传递其他参数（比如格式化最终输出格式等）的对象。在函数体中，我们可以使用`jscodeshift`提供的API来操纵抽象语法树（Abstract Syntax Tree）来实现对代码的修改。这个过程和通过DOM API来操作浏览器中的页面元素非常类似：按照属性查找元素，对查找结果进行增删改等操作，只不过这里的操作对象是语法树（比如变量定义，函数体，条件语句等等）。

在详细讨论如何使用`jscodeshift`的API来修改代码之前，我们来略微看一下抽象语法树的概念。这将是我们脚本需要操作的主要对象。

#### 抽象语法树AST

抽象语法树，是编译器将源码解析（parse）之后形成的一课树形结构。简单来说，我们的代码被解析成为`Token`，`Token`再根据语法规则形成子树，子树最终根据文法归并成一颗树。我们可以通过[AST Explorer](https://astexplorer.net/)工具来实时查看代码对应的语法树。

举个例子，我们的代码片段：

```jsx
import Button from '@fancylib/button';

const app = () => (
    <Button isInLoadingStatus>Click me</Button>
)
```

经过解析（`jscodeshift`默认使用`babel`来解析，你可以选择其他的解析器）之后，会形成右侧的一颗树，比如`isInLoadingStatus`被识别成`JSXIdentifier`类型，而变量`app`定义则被识别为`VariableDeclarator`等。所有符合语法的元素都会被抽取成Token，并体现为树上的一个节点。

![](/images/2020/12/ast-explorer.png)

有了这些基本概念之后，我们就可以开始编写一个简单的`transform`了。这里我们可以通过[AST Explorer](https://astexplorer.net/)提供的在线IDE中的`Transform`功能来实时调试（此处选择`jscodeshift`作为转换器）。

然后我们定义这样一个转换函数：

```jsx
// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXIdentifier)
    .forEach(path => {
    	if(path.node.name === "isInLoadingStatus") {
          j(path).replaceWith(
            j.identifier('loading')
          )
        }
    })
    .toSource();
}
```

比如上述代码中，我们查找所有的`j.JSXIdentifier`，并迭代每一个找到的节点，如果它的值是`isInLoadingStatus`的话，就将其替换为`loading`。可以观察到右下侧的调试器窗口中的转换结果：

![](/images/2020/12/transform-button.png)

#### 测试驱动开发

当然了，作为一个严肃的程序员，我们不应该通过一个在线IDE来进行开发。幸运的是`jscodeshift`可以和`jest`完美配合，同时我发现编写自动化脚本是一个非常适合测试驱动开发的场景：

- 输入输出都非常明确
- 各种不同的边界场景很容易想象/编写成用例
- 每一个步骤都可以划分的比较小

`jscodeshift`提供了一个小工具`defineInlineTest`，通过它你可以很方便的定义测试用例：

```jsx
import { defineInlineTest } from 'jscodeshift/dist/testUtils';
import transformer from './transformer';

describe('transfomer', () => {
	defineInlineTest(
    { default: transformer, parser: 'tsx' }, 
    {},
    `
    import Button from '@fancylib/button';
  
    export default () => (
      <Button isInLoadingStatus>Click me</Button>
    );
    `,
    `
    import Button from '@fancylib/button';
  
    export default () => (
      <Button loading>Click me</Button>
    );
    `,
    'change isInLoadingStatus to loading'
  );
});
```

当然，如果你不习惯字符串模板的话，它同时还提供了基于文件形式的测试定义，这样你可以将测试的输入（转化前）和输出（转化后）外置到文件中，并在其中构建较为复杂的使用场景。

比如我们希望这个`transform`不要误伤我们代码中使用的其他`Button`，比如我们使用了另外一个组件库，而巧合的是那个库中`Button`也有一个`isInLoadingStatus`。

那么对应的测试用例会是：

```jsx
	defineInlineTest(
    { default: transformer, parser: 'tsx' }, 
    {},
    `
    import Button from '@facebook/button';
  
    export default () => (
      <Button isInLoadingStatus>Click me</Button>
    );
    `,
    `
    import Button from '@facebook/button';
  
    export default () => (
      <Button isInLoadingStatus>Click me</Button>
    );
    `,
    'should not change isInLoadingStatus to loading from other package'
  );
```

对应的我们需要在代码中加入相应的逻辑：

```js
// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const specifiers = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "@fancylib/button")
    .find(j.ImportDefaultSpecifier);

  if (specifiers.length === 0) {
    return;
  }
  
  //...
}
```

即，我们先查找所有的`import`语句，如果没有找到从`@fancylib/button`导入的Button就跳过后续的操作。你应该已经注意到了，我们这里又很多的诸如`j.ImportDeclaration`和`j.ImportDefaultSpecifier`之类的Token定义，你可以从AST Explorer的树结构中找到类似的名称，然后用`jscodeshift`的API来查找并访问改节点。

这个过程或多或少有点像我们通过DOM的API来选择HTML节点一样：

```js
document.querySelectorAll('a')
    .filter(anchor => anchor.classList.includes('button'))
    .forEach(anchor => anchor.style["text-decoration"] = "underline")
```

*如果你觉得这里要素太多，这是很正常的。尝试着多写几个就会发现规律。*

如果把所有的实现细节都列举在一篇文章中，我觉得文章会非常枯燥（可能写成一个系列教程等），因此这里我不再贴代码，相关的源码可以[在这里找到](https://github.com/abruzzi/codemod-demo)。

#### 可能的陷阱

使用脚本来自动化重构的想法当然非常有诱惑了，特别是对于疲于为已经公布的API打补丁的人们来说，简直太过于美好。不过公平起见，我还是得略微说一些它的一些drawbacks。

首先，`jscodeshift` 的API略显晦涩，有一定的学习成本。开发过程中可能会有很多调试的工作。其次，它并不定覆盖*100%*的使用场景，比如对于复杂的`spreading`操作，需要调试和分析的工作量不容小觑，也就是说你仍然需要人工校对一些edge cases。最后，需要一些脚本来支持组件的消费团队使用，比如自动化补丁工具等，如果有多个`transform`，如何一次patch等问题。

### 小结

在这篇文章中，我们从一个简化了的实际例子出发，描述了为何`jscodeshift`在某些场景下可以提供的帮助，比如降低大型修改可能带来的影响（而如果影响不可避免，那么如何使其变得不那么痛苦）。随后我们描述了`jscodeshift`中的一些基本概念和基本的工作方式，并结合之前讨论的例子实现了部分的自动化重构。

### 其他参考

- [React发布的一些codemod](https://github.com/reactjs/react-codemod)
- [AST浏览器](https://astexplorer.net/)
- [与文中描述相关的代码](https://github.com/abruzzi/codemod-demo)
- [一篇非常详细的jscodeshift教程](https://skovy.dev/jscodeshift-custom-transform/)