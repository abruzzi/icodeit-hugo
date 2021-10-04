---
title: "前端性能调优心法"
date: 2021-06-16
slug: "2021/06/frontend-performance-tuning-tips"
categories: ["composition", "performance", "design"]
---

## 前言

性能问题是软件开发中的常见问题，我们在几乎每个项目在某个时期（往往是在后期快要交付的时候，或者已经上线以后收到用户反馈）都或多或少会遇到。这篇文章想要从流程方面和具体的技术细节上对软件性能优化上遇到的问题做一些总结和分类，以方便在后续类似的场景下可以提供给开发者一个参考。

严格意义上，这篇文章并没有太多的新内容，甚至有一些具体的技术细节我在[另一篇文章](https://javascript.plainenglish.io/did-someone-say-composition-c7843d898b2)中已经讨论过，这里主要还是提供一些常见的关于性能优化思路的总结。

## 在修改之前

> 性能优化之法，曰立，曰测，曰理，曰拆，曰分，曰剥，曰拖，曰缓。

我们讨论性能提升，往往需要首先建立一套测量机制。因为仅凭直觉来猜测可能的性能瓶颈非常低效，而且往往直觉认为有性能问题的地方未必真有问题。一旦测量机制建立，则犹如我们代码有了单元测试/集成测试的守护，总的来说会向着正确的方向演进。

### 立字诀

重中之重的是，定义好指标。即`DoD`（Definition of Done），我们需要回答的问题是：什么是好的性能？达到何种标准就算是提升，而达不到就算是失败？这一点从项目的确立角度非常关键。

如果说希望某个页面的性能较之以前来说，加载时间提高20%为成功，则一切的后续开发可以做到有的放矢，而不至于无疾而终。

### 测字诀

一旦我们定义好了**何为提升**。接下来就需要建立相应的测量机制，并设置基线。这一步相当于将上一步定义好的标准实例化到build pipeline中，使得具体目标可视化起来，从而每次的修改都能看到和目标的差距。

比如从请求发出到页面渲染完成（比如检测到某个**标的**在页面上的存在与否），总共耗时3秒，然后我们将3秒设置为基线，并围绕这个基线设置测试的上限。和其他测试一样，如果后续的代码修改使得页面渲染时间大于基线值，则`build`失败。与之对应的还可以有诸如bundle的尺寸（压缩后的静态资源大小）首次渲染时间等等指标。

有了具体的目标，我们就可以设置相应的测试机制。比如通过运行`yslow`或者其他`lighthouse`来进行。

### 理字诀

当我们定义了性能优化成功的含义，也有了相应的反馈机制，**如何做**才会成为最重要的主题。对于这个问题，常用的工具就是分析和分类。

首先需要的分析“慢”的类型，是纯性能问题，还是架构问题，或者是软件设计上的问题。纯性能的问题往往较为具体，也最容易解决，比如使用了性能较低的包作为依赖，则只需要替换为性能更好的库即可；又或者使用`debounce`/`throttle`来减少对函数的频繁调用等等。

与纯粹的性能问题相对应的另一大类问题，都可以归结到设计问题（大到软件架构，小到模块间的耦合/依赖等问题）。这类问题通常需要引入的修改比较大，但是收益也会很高，而且长期来看，对于代码的可维护性和缺陷率也会带来好的回报。

因此，这一步的目标是识别出哪些问题可以通过简单修改就可以达成，而另外的一些则需要大的改动。事实是，有可能对于我们之前定义好的基线，只需要解决纯粹的性能问题就可以达成，那我们也无需花费大量的工作在更大的修改上。

## 总纲

> 或曰，性能优化之诀窍，唯**推拖**二字也。推者，不是我的事儿我绝不干，谁爱干谁干。拖者，能明天做的事儿，今天绝不去碰。

如果纯粹的最佳实践无法满足要求，我们则需要花费更多的时间来**重构代码的设计**来满足性能需求。

我们将通过一些具体的例子来仔细讨论。总的来说，我们需要识别代码中的耦合问题，并在合理的方向上进行抽象，并完成拆分，使得每个独立的模块/组件都尽可能的**高内聚，低耦合**。

### 拆字诀

比如在[文中讨论](https://javascript.plainenglish.io/did-someone-say-composition-c7843d898b2)的Avatar和Tooltip的例子，头像组件Avartar的核心功能并不包含Tooltip，而且两者的耦合程度其实很低，可以通过拆分的方式将其隔离。

修改后的Avatar不再将Tooltip做为依赖：

```js
import Avatar from "@atlaskit/avatar";  
import Tooltip from "@material-ui/core/Tooltip";

const MyAvatar = (props) => (  
  <Tooltip title="Juntao Qiu" placement="top" classes={...}>  
    <Avatar  
      name="Juntao Qiu"  
      url="https://avatars.githubusercontent.com/u/122324"  
    />  
  </Tooltip>  
);
```

### 分字诀

在另外一些情况下，一个组件和其依赖间的耦合较为紧密，但是又不具备**不可替代性**。比如在[文中讨论](https://javascript.plainenglish.io/did-someone-say-composition-c7843d898b2)的`InlineEdit`和`InlineDialog`的场景。

这时候可以通过[render props](https://reactjs.org/docs/render-props.html)来进行控制反转，使得组件不再依赖于某个具体实现，而是一个接口。这样所有实现了该接口的组件都可以即插即用，又可以节省默认依赖的部分开销（定义在`package.json`中的）。

注意这种场景和“拆字诀”里的场景非常类似，不过区别是这里拆分出去的组件和当前组件间有一个隐式的协定：即需要接受`render`传递过去的所有参数。

```js
const MyEdit = () => {  
  return (  
    <InlineEdit  
      editView={(fieldProps, isInvalid, error) => (  
        <Popover open={isInvalid}>  
          <Typography>{error}</Typography>  
          <Textfield {...fieldProps} />  
        </Popover>  
      )}  
      validate={(value) => {  
        return false;  
      }}  
    />  
  );  
};
```

比如上面的例子中，`editView`并不是完全自由定义的，它需要或者接受或者忽略`isInvalid`和`error`这样的参数。

### 剥字诀

在一些场景中，与其提供一个大而全的组件，我们可以将该组件适度的附加功能剥离，并形成不同的组件，通过不同的entry-points导出。这样用户可以按需安装。一个典型的例子是`lodash`的早起版本，用户如果需要使用`partition`，仍然需要导入整个包：

```js
import _ from 'lodash';

const result = _.partition([1, 2, 3, 4], n => n % 2)
```

通过不同的entry-point，你可以仅仅导入你需要的函数：

```js
import partition from 'lodash/partition';

const result = partition([1, 2, 3, 4], n => n % 2)
```

类似的，比如你的button组件，你可以提供标准button，加载中的button，或者高级button等不同类型，以便用户按需使用。

### 拖字诀

以React为例，我们既可以使用原生的`React.lazy`也可以使用诸如`loadable`之类的库来实现按需加载。即不到最后一刻（需要渲染DOM的时候）绝不加载。这在很多场景下，特别是提升页面初始页的时候非常有用。比如首页上的User Profile里隐藏着一个巨大的`DropdownMenu`，我们完全可以当用户第一次使用时再加载。

```js
const UserProfile = React.lazy(() => import('./UserProfile'));
```

并提供一个placeholder在加载时：

```js
function HomePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
```

### 缓字诀

我们这里介绍的最后一种方法是缓存，将耗时的，且不会频繁发生变化的计算结果保存起来，以提高后续的访问速度。这个模式既可以是代码层级，将数据存放在内存中或者LocalStorage/SessionStorage中。另一方面，这条原则从架构层面也是适用的，比如我们引入静态资源存储在CDN上，动态资源存储于缓存服务器等。

还是以React为例，我们可以使用：

- 使用`useMemo`缓存数据
- 使用`useCallback`缓存事件响应函数
- 使用`memo`对静态组件（特别是叶子节点）进行缓存

比如对于一个叶子节点`Toggle`

```js
const Toggle = ({defaultChecked}) => {
	const [checked, setChecked] = useState(defaultChecked);
	
	const styles = getToggleStyles('light');
	
	const onClick = () => {
		setChecked(checked => !checked)
	}
	
	return <label css={styles}>
		//...
	</label>
}

export default Toggle;
```

使用API级别的缓存之后，写起来可能是这样的：

```js
const Toggle = ({defaultChecked}) => {
	const [checked, setChecked] = useState(defaultChecked);
	
	const styles = useMemo(getToggleStyles('light'));
	
	const onClick = useCallback(() => {
		setChecked(checked => !checked)
	}, [])
	
	return <label css={styles}>
		//...
	</label>
}

export default memo(Toggle);
```

另外应该注意的是，使用额外的API如`useMemo`或者`useCallback`本身也是有消耗的，在实际场景里需要结合上面提到的**测**字诀来确保实际数字上的改善，而不是对迷信API。

## 小结

本文对性能优化中常见的一些方法和模式做了一些总结。在开始实施之前，我们需要确定对性能优化成功与否的定义。然后我们需要设立基线以及与之匹配的测试，这样我们在任何时候都可以确知我们的优化有没有效果，或者与预期之间的差距，从而时刻保证目标清晰。接下来需要对性能问题的现象进行初步的分析和分类，比如是架构上的缺陷，或者是微观代码层面没有采用最佳实践等。

接下来，我们讨论了几类常见的优化方法。比如根据耦合度的拆分，根据复杂/分化程度的拆分，使用接口来实现依赖倒置，以及缓存的使用等。这些具体的做法在不同的技术栈上可能有不同的具体实践（比如`Angular`中可能有lazy的对照物，或者可以在`vue`中采用类似的技术来实现`memo`等）,但是这些思路是比较通用的，可以应用在类似的场景。