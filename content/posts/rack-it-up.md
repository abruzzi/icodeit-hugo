+++
title = "Rack It Up"
date = "2013-08-02"
slug = "2013/08/rack-it-up"
Categories = ["ruby", "lightweight", "web development", "rack"]
+++
### Rack it up (proc)

一个最简单的rack应用程序可以是：一个简单的ruby对象，包含了一个call方法。这个call方法接受一个参数，并返回一个有三个元素的数组即可：

```
def call(env)
	[200, {}, ["content"]]
end
```

其中参数env将被rack用作HTTP请求对象来传递进来，而函数的返回值与HTTP响应对应：分别为状态码，HTTP头信息以及响应内容。
