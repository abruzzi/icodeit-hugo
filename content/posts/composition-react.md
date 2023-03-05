---
title: "组件设计之组合原则"
date: 2021-05-01
slug: "2021/05/composition-in-react"
categories: ["composition", "refactor", "performance", "design"]
description: "表面上看起来这个优化工作包括两大部分：性能优化和结构重整。不过经过这几个月对十多个组件的重构之后，我们发现这两部分工作在很大程度上是同一件事的两个方面：好的设计往往可以带来更好的性能，反之亦然."
---

## 前言

在过去的几个月里，我和客户团队在对一个组件库[Atlaskit](https://atlassian.design/components)进行**优化**。表面上看起来这个优化工作包括两大部分：性能优化和结构重整。不过经过这几个月对十多个组件的重构之后，我们发现这两部分工作在很大程度上是同一件事的两个方面：好的设计往往可以带来更好的性能，反之亦然。

这是一个非常有趣的发现，我们在讨论性能优化的时候，一个经常被忽略的因素恰恰是软件本身的设计。我们会关注文件大小，是否会有多重渲染，甚至一些细节如CSS selector的优先级等等，但是很少为了性能而审视代码的设计。另一方面，如果一个组件写的不符合`S.O.L.I.D`原则，我们会认为它的可扩展性不够好，或者由于文件体量过大，且职责不清而变得难以维护，但是往往不会认为糟糕的设计会对性能造成影响（也可能是由于性能总是在实现已经完成之后才被注意到）。

为了更好的说明这个问题，以及如何在实践中修改我们的设计，使得代码更可能具有比较优秀的性能，我们可以一起讨论几个典型的例子。

### 头像组件Avatar

在[Atlaskit](https://atlassian.design/components)比较早的一个版本中，头像[Avatar](https://atlassian.design/components/avatar/examples)组件有一个很*方便*的功能：如果给Avatar传入了name属性，则当鼠标悬停到头像时，头像**下方**会显示一个提示信息（Tooltip），内容为对应的name。

![avatar](/images/2021/05/avatar.png)


在实现中，`Avatar`使用了另一个组件`Tooltip`来完成这个功能：

```jsx
import Tooltip from "@atlaskit/tooltip";

const Avatar = (props) => {
  if (props.name) {
    return (
      <Tooltip content={props.name}>
        <Circle>
          <img src={props.url} />
        </Circle>
      </Tooltip>
    );
  }

  return (
    <Circle>
      <img src={props.url} />
    </Circle>
  );
};
```

这个功能本身并没有问题，不过当用户提出更多的需求后，我们就开始失去了对`Avatar`的控制。比如用户A希望鼠标悬停的时候，Tooltip可以显示在头像的上方。而用户B则希望可以定制Tooltip的背景色/字体/字号等等。

当然，我们可以开放一些新的参数给Avatar来实现这些需求，比如：

```jsx
<Avatar
  tooltipPosition="top"
  tooltipBackgroundColor="blue"
  tooltipColor="whitesmoke"
/>;
```

或者更进一步，开放一个*选项*对象：

```jsx
<Avatar
  tooltipProps={{
    position: "top",
    backgroundColor: "blue",
    color: "whitesmoke",
  }}
/>;
```

然后在实现中我们将其透传给`Tooltip`组件。不过很快我们会发现这样的方式会带来一些问题：

- 由于Avatar依赖于Tooltip，打包后文件的尺寸会增加
- 如果用户需要以新的方式定制`Tooltip`，Avatar的接口也需要相应的更新
- 由于这个依赖，当Tooltip的API变化时，Avatar需要重新打包

而如果我们审视Avatar组件的话，会发现Tooltip对其**核心功能**（显示用户头像）来说，更像是起到了辅助作用，而并非不可或缺。比如，假设不使用Tooltip组件，我们可以把Avatar简化为：

```jsx
const Avatar = (props) => (
  <Circle>
    <img src={props.url} title={props.name || ""} />
  </Circle>
);
```

那么除了用户体验的不一致外，并不影响使用。这时候我们就应该考虑是否可以将Tooltip和Avatar两个组件彻底分开。并将*是否使用Tooltip*交给最终的使用者来决定。也就是说，Avatar通过更加*可组合*的方式，将Tooltip从依赖中删除，最终的代码就变成了：

```jsx
import Avatar from "@atlaskit/avatar";
import Tooltip from "@atlaskit/tooltip";

const MyAvatar = (props) => (
  <Tooltip
    content="Juntao Qiu"
    position="top"
    css={{ color: "whitesmoke", backgroundColor: "blue" }}
  >
    <Avatar
      name="Juntao Qiu"
      url="https://avatars.githubusercontent.com/u/122324"
    />
  </Tooltip>
);

```

初略看起来这段代码好像和最初的代码没有太大差异，不过注意这里的代码片段是Avatar的消费者写的，也就是说，Avatar组件本身不再知道（也不需要知道）Tooltip的存在。如果需要，上面的代码还可以修改为：

```jsx
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

也就是说，对于消费者来说Tooltip不再是一个绑定在Avatar中的黑盒。这种更加**可组合**的方式有这样一些好处：

- 对于单个库来说，体积更小
- 对于消费者来说，更容易按需定制（比如可以选择默认不引入Tooltip）
- 不再绑定到某一个Tooltip的具体实现上，可以替换成其他库（比如上述material-ui中的Tooltip）

事实上，这种场景在我们的整改中遇到了很多。比如接下来我们要看的另一个类似的例子：内联编辑器`inline-edit`中的*校验错误弹框*(invalid dialog)。

### 内联编辑器（Inline Edit）

内联编辑器（[inline edit](https://atlassian.design/patterns/inline-edit)）是另一个在很多产品中都在使用的组件，通过它你可以在页面中对内容进行实时编辑并保存。从根本上来说，它相当于只有一个字段的表单。在以前的版本中，该组件提供了这样一个功能：如果提供了`validate`函数，那么用户每一次输入都会触发`validate`函数，如果`validate`返回false, 则在编辑器的右侧会有一个错误消息弹框出现。

![inline edit](/images/2021/05/inline-edit.png)

而实现的逻辑大约是这样的：

```jsx
import InlineDialog from "@atlaskit/inline-dialog";

const InlineEdit = (props) => {
  const { validate, editView } = props;
  return (
    <Field>
      {({ fieldProps, error }) => (
        <div>
          {editView(fieldProps)}
          {validate && (
            <InlineDialog
              isOpen={fieldProps.isInvalid}
              placement="right"
              content={<span>{error}</span>}
            />
          )}
        </div>
      )}
    </Field>
  );
};
```

注意此处的`editView`是一个会返回一个`ReactNode`的函数，用户可以自定义此处的`editView`。和Avatar的例子相似，这里对`InlineDialog`组件的使用事实上阻断了其使用其他组件的可能性。

如果我们通过类似对Avatar改造的方式重构`InlineEdit`的话，会发现该方式在此处行不通：和Avatar于Tooltip间松散的关系不同，`InlineEdit`和`InlineDialog`的有紧密的关联关系：仅当InlineEdit处于`invalid`时，`InlineDialog`才需要显示，默认情况则不显示。

也就是说，我们无法简单的将其重构为：

```jsx
import InlineDialog from "@atlaskit/inline-dialog";

const MyEdit = () => {
  return (
	  <InlineDialog content={} isOpen={} placement="top">
      <InlineEdit
      	editView={(fieldProps) => <Textfield {...fieldProps} />}
        validate={(value) => {
          return false;
        }}
      />
    </InlineDialog>
  );
};
```

因为作为父节点，`InlineDialog`无法获知其子节点的状态（当然可以通过context来传递状态，不过那样又会失去组件的通用性）。虽然关联关系无法忽略，但是我们还是可以将具体的`InlineDialog`消除掉，换成一个针对*如果出错了怎么办*的抽象的操作。

#### 方案1

事实上，我们在此处关注的是：如果定义了校验函数， 而且如果校验失败，则触发一个*行为*。这个行为既可以是在控制台上打印一个错误语句，也可以是使用浏览器的alert，也可以是任意其他用户定义的组件。

我们姑且称这个行为定义为一个叫做`invalidView`的函数，这个函数接受`isInvalid`（是否校验失败）状态，以及一个`error`（错误消息）字符串。她的签名是这样的：

```tsx
invalidView: (isInvalid: boolean, error: string) => React.ReactNode;
```

这样我们可以在`InlineEdit`中消除对`InlineDialog`的直接使用：

```jsx
const InlineEdit = (props) => {
  const { validate, editView, invalidView } = props;

  return (
    <Field>
      {({ fieldProps, error }) => (
        <div>
          {editView(fieldProps)}
          {validate && invalidView(isInvalid, error)}
        </div>
      )}
    </Field>
  );
};
```

最终的消费者可以选择使用何种组件来实现错误处理：

```jsx
import InlineDialog from "@atlaskit/inline-dialog"; //注意InlineDialog为最终消费者引入

const MyEdit = () => {
  return (
    <InlineEdit
	    editView={(fieldProps) => <Textfield {...fieldProps} />}
      validate={(value) => {
        return false;
      }}
      invalidView={(isInvalid, error) => (
        <InlineDialog isOpen={isInvalid} content={error} placement="top" />
      )}
    />
  );
};
```

由于`invalidView`理论上可以是任何组件，那么关于校验失败弹框（或者其他UI）就有无限的可能性。

#### 方案2

除此之外，我们还可以通过其他方式来消除对`InlineDialog`的直接引用。在上述`InlineEdit`代码中我们可以看到`editView`函数本身就是设计非常通用的视图函数：

```
editView: (fieldProps: FieldProps) => React.ReactNode;
```

如果我们可以将其略加扩展：将`isInvalid`和`error`传递给函数`editView`：

```jsx
const InlineEdit = (props) => {
  const { validate, editView } = props;

  return (
    <Field>
      {({ fieldProps, isInvalid, error }) => (
        <div>
          {editView(fieldProps, isInvalid, error)}
        </div>
      )}
    </Field>
  );
};
```

这样用户在传入`editView`时，只需要包装一个`InlineDialog`（或者其他UI组件）即可：

```jsx
import InlineDialog from "@atlaskit/inline-dialog";

const MyEdit = () => {
  return (
    <InlineEdit
      editView={(fieldProps, isInvalid, error) => (
        <InlineDialog isOpen={isInvalid} content={error} placement="top">
          <Textfield {...fieldProps} />
        </InlineDialog>
      )}
      validate={(value) => {
        return false;
      }}
    />
  );
};
```

当然，此处的InlineDialog完全可以替换为material ui中的`Popover`:

```jsx
import InlineDialog from "@atlaskit/inline-dialog";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

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

或者用户可以用其他方式来消费此处的错误消息：

```jsx
const MyEdit = () => {
  return (
    <InlineEdit
      editView={(fieldProps, isInvalid, error) => {
        if (isInvalid) {
          console.log(error);
        }

        return (<Textfield {...fieldProps} />);
      }}
      validate={(value) => {
        return false;
      }}
    />
  );
};
```

不论是方案1还是方案2，我们所做的都是尽量让组件尽可能不感知错误处理/相应，而把这个决定交还给组件的消费者。这样做的好处就是让组件对错误处理的方式更加开放（而不是通过引入一个具体实现而关闭其他选项），而客观上由于我们不再引入一个额外的组件，组件本身的尺寸会减小，而随着代码的简化，逻辑本身出错的几率也会随之降低。

### 总结

通过上面的两个例子，我们大约可以得出这样的结论：在代码中，*一旦选择了某种具体（一个抽象的具体实现），你就不可避免的关闭了使用其他替代品的可能性。*比如在Avatar中使用`@atlaskit/tooltip`，那么最终的消费者就不能使用其他的Tooltip组件，而`InlineEdit`使用了`@atlaskit/inline-dialog`也关闭了使用`Popover`的可能性。

事实上，一旦我们识别出问题所在，解决方案其实非常简单。对于可以完全将*辅助性功能*的剥离（如Tooltip之于Avatar）的情况，我们只需要将其移出本组件即可。而对于这些*要移除的*组件于本组件有关联关系的情况，我们则需要修改代码使其***依赖于抽象***，而不是具体的实现。这样才可以最大程度的降低依赖，提高灵活性。



