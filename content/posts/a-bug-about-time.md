+++
title = "一个神奇的Bug"
date = "2014-09-04"
slug = "2014/09/a-bug-about-time"
Categories = ["JavaScript", "Bug"]
+++
### 一个神奇的Bug

目前项目是一个非常传统的Web应用，其中有个页面需要用户填写自己的个人信息，包括姓名和出生日期。非常简单的一个小片段，UI看起来是这个样子的：

![image](/images/2014/09/personal-resized.png)

没有使用现成的`datepicker`，某个开发人员只是简单的自己收集了一下年，月，日信息，然后在JavaScript中根据填写的值来`new`了一个Date对象。

然后某天我在做测试的时候，顺手填写了一个日期`1986年5月4日`，然后奇怪的事情发生了：

![image](/images/2014/09/invalid-date-resized.png)

**WTF?**，这日期怎么会是非法的呢？于是我又尝试了`1986年5月3日`和`1986年5月5日`，一切正常！好奇之下，我找到对应的代码：

```js
var dobDay = parseInt($("#personal\\.dobDay").val(), 10);
var dobMonth = parseInt($("#personal\\.dobMonth").val(), 10);
var dobYear = parseInt($("#personal\\.dobYear").val(), 10);

// Note month is not zero based.
var dob = null;
if (dobDay > 0 && dobMonth > 0 && dobYear > 0) {
    dob = new Date(dobYear, dobMonth - 1, dobDay, 0, 0, 0, 0);
}

if (dob === null || dob.getDate() !== dobDay) {
    valid = false;
    $("#dob-error").html(this.formMessages.invalidDate);
}
```

从界面上获取用户输入的年，月，日信息，然后根据这三个数字创建一个JavaScript对象。但是奇怪的是，这里有一条判断`dob.getDate() !== dobDay`。

### JavaScript的日期类

JavaScript中的日期类比较奇葩，你可以通过将年月日传入`new Date()`来构造出一个新的日期类型，奇葩之处在于，年和日都是从1开始计数，但是月份是从0开始计数的，比如`new Date(2014, 1, 2)`表示2014年**2月**2日。

那么，我们可以在Chrome的Console中查看一下神奇的`1986年5月4日`

```js
> new Date(1986, 4, 4)
Sat May 03 1986 23:00:00 GMT+0800 (CST)
```

WTF? 我好好的5月4日怎么变成5月3日了呢？加上时分秒之后，逐步缩小排查范围：

```js
> new Date(1986, 4, 4, 0, 59, 59, 0)
Sat May 03 1986 23:59:59 GMT+0800 (CST)

> new Date(1986, 4, 4, 0, 59, 59, 1000)
Sun May 04 1986 01:00:00 GMT+0900 (CDT)
```

这时候发现，当秒针通过`1986年5月3日的23点59分59秒`之后，时间就变成了`1986年5月4日的1点0分0秒`了！这个奇葩至极的问题是由于传说中的**夏令时**所致！

### 夏令时

其实常年和澳洲客户打交道，对日光节约时间(Daylight saving time)已经不陌生，不过澳洲在南半球冬夏正好和中国相反，因此完全没有将其当成日常的一部分。

维基上的解释比较专业：

> 夏时制或夏令时间（英语：Summer time），又称日光节约时制、日光节约时间（英语：Daylight saving time），是一种为节约能源而人为规定地方时间的制度，在这一制度实行期间所采用的统一时间称为“夏令时间”。一般在天亮早的夏季人为将时间提前一小时，可以使人早起早睡，减少照明量，以充分利用光照资源，从而节约照明用电。各个采纳夏时制的国家具体规定不同。

即，在夏天的某天（天亮的比较早），将时钟调快一个小时，以便大家起床更早，然后可以节省一些照明用电，然后在冬天的时候（天亮的比较晚）又调回去

![image](/images/2014/09/dst.png)


根据百度百科上的描述：

> 1986年至1991年，中华人民共和国在全国范围实行了六年夏令时，每年从4月中旬的第一个星期日2时整（北京时间）到9月中旬第一个星期日的凌晨2时整（北京夏令时）。除1986年因是实行夏令时的第一年，从5月4日开始到9月14日结束外，其它年份均按规定的时段施行。夏令时实施期间，将时间调快一小时。1992年4月5日后不再实行。

`1986年的5月4日`这个特别的日期终于显现出了其特殊之处了。

有了这个认识，我将系统时间设置为了澳洲标准时间，然后测试:

```js
> new Date(2014, 9, 5, 2, 59, 59, 0)
Sun Oct 05 2014 01:59:59 GMT+1000 (EST)

> new Date(2014, 9, 5, 2, 59, 59, 1000)
Sun Oct 05 2014 03:00:00 GMT+1100 (EST)
```

如果观察足够细致的话会发现GMT后边的这个数字的变化，GMT是(Greenwish Mean Time)格林尼治标准时间的缩写，它最初是国际公认的时间基准线，地理上位于其东方的各个时区会加上一个偏移量，比如中国就是GMT+8，而澳洲就是GMT+10，而一旦进入夏令时，由于时钟拨快了一个小时，因此就会变成GMT+9/GMT+11。

```js
> new Date(1986, 4, 4, 0, 59, 59, 0)
Sat May 03 1986 23:59:59 GMT+0800 (CST)

> new Date(1986, 4, 4, 0, 59, 59, 1000)
Sun May 04 1986 01:00:00 GMT+0900 (CDT)
```

比如今年的巴西：

```js
> new Date(2014, 9, 19)
Sat Oct 18 2014 23:00:00 GMT-0300 (BRT)
```

### 其他

大部分实行夏令时的国家都会将这个调整放到凌晨两点，而不是零点，其中的一个原因应该就是避免出现这种状况。但是由于巴西还是将这个调整放到了凌晨，那么这个日期还是会出现`非法日期`这样的错误：

![image](/images/2014/09/invalid-date-brasil-resized.png)


### 解决方法


最简单的解决方法就是存储最简单，而且无歧义的年月日字符处，比如'1986-05-04'，而不是通过保存成一个JavaScript的Date对象的方式。

或者也可以使用一个Datepicker控件来获取日期字符串，然后保存：

![image](/images/2014/09/date-picker-resized.png)
