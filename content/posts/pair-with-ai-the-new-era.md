---
title: "欢迎来到自动化编程的新时代：和ChatGPT结对编程"
date: 2023-03-11T08:08:22+11:00
description: "作为一种人工智能模型，ChatGPT是一个高效的开发工具，可以极大地提高开发人员的效率。作为一名经验丰富的开发人员，我对它的能力有着复杂的情感体验——一方面，我感到惊讶和略微担忧，但另一方面，我认识到一个新时代正在兴起，我很高兴能成为其中的一份子。无论如何，我们需要考虑如何利用这些新技术来获取新的优势。"
---

# 欢迎来到自动化编程的新时代：和ChatGPT结对编程

作为测试驱动开发的实践者，我的工作流程包括从用户的角度编写测试，然后实现代码以满足这些测试。当代码达到难以更改的点时，我会进行重构。这种方法几乎是本能的，并成为了我的日常工作流程的一部分。

偶尔，我会与其他开发结对工作。我编写测试，他们实现功能。然后，如果需要，我们一起重构代码。每个任务后，我们轮流进行，所以他们编写测试，我让测试通过，以此类推。这是一种愉快而启发性的体验，通常我们两个人都可以从会话中学到很多东西。

然而，我发现有两种情况下搭档工作不太有效。第一种情况是当另一个人持有防御态度，不愿接受反馈或建议时。这种态度可能导致搭档工作失败。第二种情况是当我们都不知道如何处理特定的任务时。我们可能需要尝试和测试各种想法，这可能会让另一个人摸不着头脑或感到乏味。

总的来说，我发现与其他开发人员搭档工作是一种积极的体验。我不仅有机会分享自己关于编写更好代码的专业知识，而且也能从他们身上学到很多。

我以前从未与人工智能结对过，所以我决定尝试在一些情况下与ChatGPT一起结对，以了解这种体验与其他开发人员的体验有何不同。

## 联系人组件

我们要实现一个**联系人**小组件可以想象成下面的样子。虽然看起来相当简单，但一个开发者可能需要花费大约半小时到一小时的时间来编写测试和代码以及样式的调整。这个只是初步计划，我还会加入更复杂的任务来评估人工智能如何提供帮助。

![contact-mockup](/images/2023/03/ai/contact-mockup.png)

在会话中，我将尝试让ChatGPT与我一起进行测试驱动开发。如果它的回答开始漫游（drifting），我将使用一些更加具体的提示（prompt）来引导它。

## **头像组件**

我先用**`react-testing-library`**编写的一个简单的单元测试开始，然后让ChatGPT来实现。这正是我与其他开发人员开始配对编程会话的方式。

```jsx
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders", () => {
    render(<Avatar size="small" shape="circle" src="https://img.url" />);
    const img = screen.getByAltText("avatar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://img.url");
  });
});
```

然后ChatGPT在几秒钟内就给我一个响应代码。这一步非常快，我是说如果手敲代码可能需要几分钟或更长时间才能得到正确的代码。

```jsx
import React from "react";

const Avatar = ({ size, shape, src }) => {
  return (
    <img
      src={src}
      alt="avatar"
      style={{
        width: size, height: size, borderRadius:
          shape === "circle" ? "50%" : "none"
      }}
    />
  );
};

export default Avatar;
```
这段代码说不上完美，但至少可以工作。我通过提示，让它将CSS提取到单独的文件中，并引入TypeScript等功能。经过几次来回的交流，我得到了最终的结果：

```jsx
import React from "react";
import styles from "./Avatar.module.css";

type AvatarProps = {
  size?: "small" | "medium" | "large";
  shape?: "square" | "circle" | "rounded";
  src: string;
};

const Avatar = ({ size = "medium", shape = "circle", src }: AvatarProps) => (
  <img
    src={src}
    alt="avatar"
    className={`${styles.avatar} ${styles[size]} ${styles[shape]}`}
  />
);

export default Avatar;
```

这已经是相当不错的代码了。我是说，真正的开发者也就这水平了吧，对吧？

## **可访问性**

然后我决定稍微改进当前的实现-我要求ChatGPT为可访问性目的生成tooltip。当然，我们在TDD，要先写测试。这次它来写测试，我实现。

```jsx
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders with title", () => {
    const testTitle = "Test Title";
    render(<Avatar size="small" shape="circle" src="https://img.url" title={testTitle} />);
    const img = screen.getByAltText("avatar");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://img.url");
    expect(img).toHaveAttribute("title", testTitle);
  });
});
```

我使用了 **`title`** 来生成提示信息，并在 CSS 部分进行了一些重构。下面是代码。

```jsx
import React from "react";
import from "./Avatar.css";

type AvatarProps = {
  size?: "small" | "medium" | "large";
  shape?: "square" | "circle" | "rounded";
  title?: string;
  src: string;
};

const Avatar = ({ size = "medium", shape = "circle", src, title }: AvatarProps) => (
  <img
    src={src}
    alt="avatar"
    className={`avatar ${size} ${shape}`}
    title={title}
  />
);

export default Avatar;
```

而且还得到了ChatGPT的褒奖。


![avatars](/images/2023/03/ai/ai-praise.png)

接下来我来模拟一个需求的变更：经过商议我们觉得原生的title不是很漂亮，团队决定使用material-ui中的tooltip。

## **用 material-ui/tooltip 替换 title**

我要求 ChatGPT 使用 material-ui 来作为工具提示，它马上生成了一段代码。

```jsx
import React from "react";
import { Tooltip } from "@mui/material";
import "./Avatar.css";

type AvatarProps = {
  size?: "small" | "medium" | "large";
  shape?: "square" | "circle" | "rounded";
  src: string;
  tooltip?: string;
};

const Avatar = ({ size = "medium", shape = "circle", src, tooltip }: AvatarProps) => (
  <Tooltip title={tooltip ?? ""}>
    <img
      src={src}
      alt="avatar"
      className={`avatar ${size} ${shape}`}
    />
  </Tooltip>
);

export default Avatar;
```

以及相应的测试代码.

```jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("renders an image with the correct src and alt attributes", () => {
    const src = "https://example.com/avatar.png";
    const alt = "avatar";
    render(<Avatar src={src} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", src);
    expect(img).toHaveAttribute("alt", alt);
  });
});
```

然后我写了几行代码来使用不同的参数来展示 Avatar，我对当前的结果非常满意。所有不同的形状都能按预期工作，正如你所看到的，工具提示也能正确显示。

![avatars](/images/2023/03/ai/avatars.png)

接着，我想测试 ChatGPT 是否可以像我们开发者一样，在 Contact 组件中使用我们刚刚构建的 Avatar 组件。

## 实现联系人组件

于是，我给 ChatGPT 提供了以下提示：

> 我想构建一个 Contact 组件。它使用上面的 Avatar 组件，并具有两个额外的字段：name 和 title。请为我编写相应的测试和代码。

对于测试，它准备了 props 并将其传递到 render 中，其他一切看起来都很好（这里貌似它忘了引入`screen`对象，不过提示后它很快就纠正了）。

```jsx
import React from "react";
import { render } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact", () => {
  const props = {
    avatarUrl: "https://example.com/avatar.jpg",
    name: "John Doe",
    title: "Software Engineer"
  };

  it("renders the contact component with the correct props", () => {
    const { getByAltText, getByText } = render(<Contact {...props} />);
    expect(getByAltText("avatar")).toHaveAttribute("src", props.avatarUrl);
    expect(getByText(props.name)).toBeInTheDocument();
    expect(getByText(props.title)).toBeInTheDocument();
  });
});
```

在实现中，它使用了我们上面一起实现的Avatar：

```jsx
import React from "react";
import Avatar from "./Avatar";

const Contact = ({ avatarUrl, name, title }) => {
  return (
    <div className="contact">
      <Avatar src={avatarUrl} tooltip={name} />
      <div className="details">
        <div className="name">{name}</div>
        <div className="title">{title}</div>
      </div>
    </div>
  );
};

export default Contact;
```

联系人看起来非常不错，我还要求它以更好的方式进行布局：

> 我希望头像在左侧，详细信息在右侧。名称位于标题顶部。

它很好地理解了我的意图，并按照我们的设计进行了布局。

![contact-draft](/images/2023/03/ai/contact-draft.png)

在我展示给产品经理之前，还需要进行一些最终的UI微调。字体有点粗糙，还需要进行一些间距调整。

## **最终的UI微调**

> 你能选择两种字体并将它们搭配在一起，使联系人看起来更漂亮吗？例如，名称应该是粗体的。

```css
/* Font family for the name */
.name {
    font-family: "Roboto", sans-serif;
    font-weight: bold;
}

/* Font family for the title */
.title {
    font-family: "Open Sans", sans-serif;
}
```

我进行了一些最终的微调，得到了以下这个联系人组件：

![contact-final](/images/2023/03/ai/contact-final.png)

我认为，我们的工作成果相当令人满意。代码编写得很好，测试覆盖面全面，CSS易于理解。在我们的交流过程中，我还使用ChatGPT探索了一些额外的任务，例如网络和模拟，这些都被证明非常有效。然而，由于文章已经相当长了，我认为深入探讨这些主题需要另外一篇文章来进行。

## 总结

我让ChatGPT总结了我们的编程走一个小节，以下是我得到的结果：

>
>	我们从讨论组件需求开始，包括需要头像、名称和标题。
>
>	然后，我们使用React Testing Library编写了一个组件测试，这有助于我们定义组件的行为和功能。
>	
>	在编写测试后，我们共同使用TypeScript和我们之前创建的Avatar组件编写了相应的Contact组件代码。
>	
>	我们还添加了一些样式以使组件看起来更具视觉吸引力，包括边距、填充和浅灰色边框。
>	
>	最后，我们讨论了如何选择字体来设置组件的样式，并将"Roboto"和"Open Sans"字体族配对在一起，使名称粗体，标题细微。*
>	
>	总体而言，我们的对话展示了在编程项目中工作时，清晰的沟通、协作和问题解决技能的重要性。通过像我这样的工具，ChatGPT，作为资源，您可以简化流程并提高代码质量。
>

作为一种人工智能模型，ChatGPT是一个高效的开发工具，可以极大地提高开发人员的效率。作为一名经验丰富的开发人员，我对它的能力有着复杂的情感体验——一方面，我感到惊讶和略微担忧，但另一方面，我认识到一个新时代正在兴起，我很高兴能成为其中的一份子。无论如何，我们需要考虑如何利用这些新技术来获取新的优势。

---

<iframe src="https://juntao.substack.com/embed" width="100%" height="320" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>

