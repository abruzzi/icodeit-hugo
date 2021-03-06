+++
title = "jQuery插件101"
date = "2013-07-20"
slug = "2013/07/write-a-jquery-plugin-step-by-step"
Categories = ["JavaScript", "Frontend"]
+++

###最终结果

这篇文章将讨论如何编写一个简单的jQuery插件的基本步骤和实践，最后完成的时候，我们会得到一个管理todo的插件（而且还是一个比较灵活，易于定制的todo插件）。事实上，这个插件可以工作在所有与管理todo类似的应用场景中，比如gmail的搜索框中的token等，豆瓣读书里的tags管理等等。

![默认设置](/images/2013/07/todo-origin.resized.png)

上例中HTML结构如下：

```
<div id="container">
    <input type="text" id="input" />
    <div id="todos" />
</div>
```

下面的JavaScript代码将会找到id为*input*的输入框，并将它**变为**一个todolist的控制器，并将新加入的内容添加到id为*todos*的容器中：

```
$("#input").todoify({
	container: "#todos"
});
```

如果需要定制item的外观，可以定义模板并自定义渲染函数：

```
$("#thing-input").todoify({
    container: "#thing-todos",
    template: "<section class='todoItem'><header><%= todo %></header><a>remove</a></section>",
    renderItem: function(item) {
        var cont = this.renderTemplate(item);

        cont.find("a").click(function(event){
            cont.remove();
        });

        return cont;
    }
});
```

![Item定制](/images/2013/07/todo-customized.resized.png)

### jQuery插件基础知识

#### 简单流程
通常使用jQuery的流程是这样的：通过选择器选择出一个jQuery对象（集合），然后为这个对象应用一些预定义的函数，如：

```
$(".artile .title").mouseover(function(){
	$(this).css({
		"background-color": "red",
		"color": "white"
	});
});
```

我们如果要定义自己的插件，预期其被调用的方式和此处的*mouseover*并无二致。这需要将我们定义的函数attach到jQuery对象的fn属性上：

```
$.fn.hltitle = function() {
	this.mouseover(function(){
		$(this).css({
			"background-color": "red",
		 	"color": "white"
		})
	})
}

$('.article .title').hltitle();
```

jQuery的一个很明显的特点是其链式操作，即每次调用完成一个函数/插件之后仍然会返回jQuery对象本身，这个需要我们在插件函数的最后一行返回*this*。这样插件的使用者会像使用其他函数/插件一样很方便的将调用连起来。

另外一个问题是注意命名冲突（$是一个合法的标示符，而且被众多的JavaScript库在使用），所以可以通过匿名执行函数来避免：

```
(function($){
	$.fn.hltitle = function() {
		//...
	}
}(jQuery));
```

#### 需要注意的问题

上面是一个最简单的插件定义，为了插件更加灵活，我们需要尽可能多的将配置项暴露给插件的用户，比如提供一些默认选项，如果用户不提供配置，则插件按照默认配置来工作，但是用户可以通过修改配置来定制插件的行为：

```
(function($){
	$.fn.hltitle = function(options) {
		var defaults = {
			"background-color": "red",
		 	"color": "white"				
		};
		
		var settings = $.extend(defaults, options);
		
		return this.mouseover(...);
	}
}(jQuery));

```

### Todoify

我们的插件是一个遵循上述原则的简单插件，基本的步骤如下：

-	将给定的input包装成一个jQuery对象
-	需要一个默认的放置todolist的容器元素
-	为input注册keypress事件（如果用户按Enter，则触发add事件，添加一个新条目到容器）

```
(function($){
    $.fn.todoify = function(options) {
        var settings = $.extend({
            container: "body",
            template: "<span class='todo-item'><%= todo %></span>",
            renderItem: function(item) {
	            return $(_.template(this.template, {todo: item}));
            }
        }, options);

        $(this).keypress(function(event){
            if(event.keyCode == 13) {
                var item = $(this).val();
                $(settings.container).append(settings.renderItem(item));
                $(this).val("").focus();
            }
        });

        return this;
    }
}(jQuery));
```

此处为了防止创建众多的DOM元素，然后依次插入到正确地节点上，我使用了underscore.js的template，不过此处并非重点，略微一提。

如果用户想要更好地定制性，比如用户想要apply自己的class，定义自己的模板，或者注册新的事件（删除一条todo），显然我们需要更多的options：

```
var settings = $.extend({
    data: [],
    template: "<div class='todo'><h3><%= todo %></h3><span>X</span></div>",
    container: "body",
    renderTemplate: function(item) {
        return $(_.template(this.template, {todo: item}));
    },
    renderItem: function(item) {
        var cont = this.renderTemplate(item);
        cont.find("span").click(function(event) {
            cont.remove();
        });
        return cont;
    }
}, options);
```

这里定义了默认的close事件需要attach到span（定义在模板中）上，如果插件的用户需要自己绘制模板，并且注册事件，那么会像文章开头的那个实例一样：

```
$("#thing-input").todoify({
    container: "#thing-todos",
    template: "<section class='todoItem'><header><%= todo %></header><a>remove</a></section>",
    renderItem: function(item) {
        var cont = this.renderTemplate(item);

        cont.find("a").click(function(event){
            cont.remove();
        });

        return cont;
    }
});
```

###进一步改进

目前，todoify还没有与后台进行任何的通信，如果可以和后台的RESTFul的API集成的话，这个插件将会有更多的使用场景。

简单来讲，只需要为插件提供更多选项，并提供回调函数即可，比如：

```
$("#input").todoify({
	restful: 'http://app/todos',
	onadd: function(item){
		//...
	},
	ondelete: function(item){
		//...
	}
})
```

然后加入一些ajax的调用即可。
