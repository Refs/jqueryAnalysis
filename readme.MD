# jqueryAnalysis

## jquer的简化框架的分析

*  (21 , 94) 定义了一些列变量与函数；其中有一个函数特别的重要， Jquery = function (){};

* （96,283） 给jquery对象，添加一些属性与方法；

* （285,347） extend : JQ 的继承方法  目的是希望后续添加的方法 都能通过exend去挂载到jquery对象上面；这样扩展起来就会很方便，而不是上来就将方法挂载到对象上面；利用继承 更方便的去扩展；
*  (349,817) jquery.extend() : 扩展一些工具与方法；

```js   
    // 在jquery中实际上提供了两种代码的处理方式；
    // 通过$的实例去调用，所以被称为 jquery的实例方法；
     $().css();
     $().html();

    // 在jquery类函数直接扩展的方法，就是直接去扩展一些静态的方法，我们成直接在jquery对象函数上直接扩展的静态方法，成为jquery的工具方法；
    $.trim();
    $.proxy();

    // 静态方法与实例方法的关系：1、静态方法是jq中最底层的东西，而实例方法是相对高层的方法；  所以很多时候，实例方法的定义中调用的都是工具方法
```

* (877, 2856) Sizzle : 复杂选择器的实现；这一部分可以单独的独立出来，可以单独的在官方网站上面去下载，即使我们不使用jq，也可以使用其上面定义到的一系列的定时器；

* (2880, 3042) Callbacks: 回调对象 ：对函数统一管理； 回调对象用来实现函数的统一管理； 开发的过程中遇到函数比较多的情况；需要有一套方式对函数做统一的管理；

```js
    function fn1 (){ alert(1)};
    function fn2 (){ alert(3)};

    var cb = $.Callbacks();
    cd.add(fn1)
    cd.add(fn2)

    cb.fire();
    cb.remove(fn2); //1,2

    cb.fire(); //1
```


* (3043, 3183) Deferred: 延迟对象 ： 对异步的统一管理 , 在jquery当中 很多操作都是异步的，如定时器、ajax、异步创建script标签，若缺乏对异步的统一管理则代码写得越多就会越复杂；而延迟对象就是用来专门针对异步的；

```js
//  定时器的执行都是异步的，即定时器代码的执行不会影响到其后面代码的执行；即若是按照下面的这种写法，只有先弹出2 然后一秒以后才会弹出1；而按照我们的一个正常的思维先写的应该先执行，而后写的后执行；这样写代码 首先易读 后期维护也比较方便； 在没有延迟对象的情况下 若想想弹1而后弹出2 就得在回调函数中进行反复的嵌套；很麻烦
    setTimeout(function(){
        alert(1);
    },1000)
    alert(2);

// 利用延迟对象的一种写法：

    var dfd = $.Deferred();
    setTimeout(function(){
        alert(1);
        dfd.resolve();
    })
    // 其实这一步还是会先于上面执行，但是由于其只是一个函数，所以其不会去执行，而是会将函数 存到dfd对象里面；当dfd触发resolve的时候 函数就会执行；
    //其实延迟对象的实现也是利用回调来实现，先去存储 然后当代码触发之后，再去调用存储的函数；
    dfd.done(function(){
        alert(2);
    })
// 其实我们添加延迟对象的目的是 能让代码在书写的过程中 保持一定的书写顺序；

```

* (3184, 3295) support : 功能检测 如之前，根据浏览器的不同区执行不同的操作；需要获取浏览器的信息，知道其到底是哪个版本，在之前是可以通过几行代理的代码可以判别的；而现在随着网络的发展，浏览器更新的速度是非常快的；所以说 仅仅是依靠判断浏览器版本，对我们维护起来是非常不利的，所以说如果我们从功能的角度去判别浏览器就比较靠谱了；

```js
    // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
    support.checkOn = input.value !== "";
    // 对于老版本的webkit浏览器 input 默认的value值为空，现代浏览器默认是'on'，所以我们就可以据此来判别设备是否为新版本的浏览器；而不是去根据版本来去判断浏览器的新旧； 这一块还是比较有用的；

```

* (3308, 3652) data() : 数据缓存 我们通常会利用一些方法 去对大量的数据进行操作，如 获取、删除、设置

```js
    //增加数据
    $('#div').data('name', 'hello');

    //获取数据
    $('#div').data('name'); 
    // 其实真正的数据在jquery中，并没有真正的扩展到元素身上，若我们直接将一个数据扩展到元素身上，其实也是可以的，但是若我们扩展的不是一个基本类型而是一个对象类型的话，就会出现内存泄漏的问题；所以在jquery中数据的缓存的挂载机制也是很神奇的；
```

* (3653, 3797) queue() : 队列管理  在jquery中最常用到入队与出队的是在实现一些运动效果中，  

```js
    // 如果不使用队列 其实现的就是一种链式运动 即先改变left值 而后改变top值 最后改变width 。 animate用到了定时器管理，而定时器是异步的，而我们如何能保证下面三个运动的先后的执行顺序，这里就要用到queue队列管理；  实现思路是将三个运动都存储到队列里面，当一个运动完成之后就调用dequeue出队的方法，如果不调用出队的方法，后面的运动代码也不会执行；
    $('#div').animate({left : 100});
    $('#div').animate({top : 100});
    $('#div').animate({width : 100});

    // 队列的最大用处是其可以将不可控的异步执行顺序，同步化； 用到的地方很多；

```

* (3803, 4299) attr() prop() val() addClass()等 ： 对元素的属性的操作；

* (4300, 5128) on() trigger() : 事件操作的相关方法； 事件的添加、删除、主动触发、事件委托的方法；

* (5140, 6057) DOM操作 ：添加、删除、获取、包装、DOM的筛选

* (6058, 6620) css() : 样式操作 ，之所以一个方法就写了那么多，就是因为要做浏览器的判断以及兼容性的处理，还有包括css的写法，单位等等 

* (6621, 7854) 提交数据和ajax() : ajax() load() getJson() 

* (7855, 8584) animate() : 运动的方法，除了animate方法，还有其它封装好的方法如 fadein fadeout hide show 等方法；

* (8804, 8821) JQ支持模块化的的支持

* (8585, 8792) offset() : 位置与尺寸的方法，

*  (8826) jquery对外提供的接口， 将jquery 方法挂载到window对象上，从而在外面可以使用jquery方法； window.jQuery = window.$ = jQuery;


## 注释索引

在注释中遇到类似 #13335 意思就是 在官网上有更详细的注释， 登陆到下面的网站，然后在搜索框中直接输入 索引，就会弹出详细的结果页面；
https://bugs.jquery.com/ticket/13335


##  第一部分(21 , 94)代码解析

### 最外层的自执行函数

```js 
(function( window, undefined ) {
    
})( window );

```


* 自执行的函数中，为什么要将window传进来

若不将window当作实参传进来，而在最后提供接口的时候，直接将jquery挂载到window对象上面也是可以的；之所以要这样做，原因在于： window位于js dom对象的最顶端，所以在其上面去查找某一个对象或属性会比较的慢，根据变量作用域链的原理，变量都是离定义最近的位置范围去开始查找，如果找不到其才会一层一层向上去查； 而此处若将window传进来，则其一旦需要去查找window的定义时，找到参数window后就不会向上去查找了，即window的查找速度会变快，这是第一个优点； 第二点就是window传进来之后，其的一个压缩版本就会很有用了，比如在压缩版本的时候，我们如果不去传参，则我们在压缩版本的时候是压缩不了的，也就是不能像百度的源码一样将window--变成---w ；假如我们去传参则window我们就可以随便的去写了，如将形参定位w , 则等到window传进来之后，w就能代表window, 类似于百度的源码，都是被压缩后的，所以很难去看懂；关于这一点去看一看百度的源码或者看一眼压缩版本的jquer就知道了；

* 形参为什么要去传undefined

首先应明白，undefined是属于我们window下面的一个属性，所以说其既不是保留字也不是关键字，所以undefined在外面是可以被修改的，而jquery为了防止 其他人会对undefined进行修改，所以其采用了一种传参的方式； 这样自执行函数的内部如果找undefined肯定回去找参数undefined而不会去找外面的undefined这样的就解决了undefined被修改的影响；

```js
var undefined = 10;
alert(undefined); //10 ie9 以下；

```


### 逐个解释首部定义的变量；

* rootJQuery: jquery的根目录变量，等同于jquery(document), 但是jquery函数是在后面定义的，所以此处其仅仅是声明了一下，而并没有去赋值；而是在jquery定义后面去赋值；之所以会将$(document)赋值给一个变量，其实是有两点的考虑
    + 若将jquery(document)这个整体赋值给一个变量，则变量就可以变成一个压缩版本，如果直接在下面代码中使用jquery(document) 则其就没有办法进行压缩；
    + 第二点 看如下的代码；

```js
rootjQuery = jQuery(document);//866 row


// 如果按下面下我们根本就不知道10代表的是什么意思；也很难去理解，对代码的维护不是很方便；
a = a + 10;

// 如果将数字10赋值给一个变量；大家就会看的很明白，所以多定义一个变量，对代码后期的维护，很方便；
 var ispeed = 10;
 a = a + ispeed ;
```

* readyList : 与dom的加载有关系；

* core_strundefined 

```js
    core_strundefined = typeof undefined,
    // 其实typeof undefined 等于字符串形式的 'undefined' 也就是说 core_strundefined存储的就是 'undefined' ;

    // 在js中有两种方式去判别一个变量是否是undefined

    window.a == undefined;

    typeof window.a == 'undefined';
    // 一般的情况下 上面两种形式都是可以的，但在少数的情况下 上面的形式判断不出来； 所以就去采用下面的typeof 的形式，及判断是否为一个字符串 undefined;  所以这里就将undefine字符串放到了一个变量里方便使用；

```

* location document docElem 

```js
// 之所以这样做的原因与上面同理；
	location = window.location,
	document = window.document,
	docElem = document.documentElement, //documentElement实际上就是html标签；

```

* _jQuery _$ 与jquery仿冲突有关，在解决冲突问题上回用到这两个变量

```js

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,
  
```

* Jquery的构造函数

函数内部要返回的一定是一个对象，只有返回的是一个对象，后面才能去接对象所拥有的方法，

```js
jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

```

```js
// 面向对象的普通书写方式：
function Aaa = function(){
}
Aaa.prototype.init = function(){
} //一般写一个初始化的方法，让程序调用的时候就去执行;
Aaa.prototype.css = function(){
}

var a1 = new Aaa(); //创建对象
a1.init();//先去调用一下初始化方法
a1.css();//可以通过a1对象去调用其它的方法


// jquery的做法：
function jQuery(){
    return new jQuery.prototype.init();
}
jQuery.prototype.init = function(){
};
jQuery.prototype.css = function(){
};

// jQuery并不是直接用对象去调用css方法，而是先去执行一个函数，函数执行先是会调用init方法，而后返回一个对象，然后返回的对象去调用css方法；
//这样做的好处首先不用去写初始化的步骤了，而且返回的对象直接可以拥有对象的方法；
// jQuery().css();

// 但现在有一个问题：返回的对象是通过new Jquery.prototype.init() 说明jQuery.prototype.init是构造函数，而我们的css方法是添加在构造函数jQuery()的prototype上面的；而返回的新对象怎么就能找到jQuey原型上定义的css方法？ 

jQuery.fn = jQuery.prototype;//96行
// 将构造函数jQuery的原型jQuery.prototype，赋值给初始化构造函数的原型jQuery.prototype.init.prototype; 原型本身就是一个对象，将一个对象赋值给另外一个对象，这就形成了一个对象的引用关系，因为前后处于同一个引用上面，所以在前面修改或调用与在后面修改与调用没有什么区别；
// 所以在jQuery.prototype上定义的任何的方法。都可以在返回的new jQuery.prototype.init()对象上使用； 
jQuery.fn.init.prototype. = jQuery.fn; //283行

// 就可以形成如下的调用方式
jQuery().css();

```

* 其余的变量解释

```js

// Used for matching numbers 用来匹配数字，包括正负、小说点，后面会在css方法中使用到，因为css方法涉及到为元素设置具体的值；
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace 用来匹配单词 \S 指的是空格，单词都是用空格分开的；
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <) 防止xss木马通过输入框哈希值注入
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, 

    // Match a standalone tag 
    // 用来匹配一对独立的空标签 类似 <p></p>
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	

```

```js
    // Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
    // ms 实际上是ie浏览器的前缀 类似前缀还有webkit 
    // css中的属性标签 类似 margin-left ，在js中要转化为驼峰的形式即：

    -webkit-margin-left --->  webkitMarginLeft
    -o-margin-left  ---> oMarginLeft
    // 而采用ie前缀 -ms-的=属性需要将其转化为：
    -ms-margin-left ---> MsMarginLeft //首字母大写，与其它的处理方式不一样，而正则rmsPrefix 就是用来处理这个问题的；


    rdashAlpha = /-([\da-z])/gi, // 找到css属性中的横杠，然后将其转化为大写；除了转化字母数字也是可以支持的； 
```

```js

    // Used by jQuery.camelCase as callback to replace()
    // 转驼峰写法的回调函数；
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

    // The ready event handler and self cleanup method
    // dom加载成功之后，会调用的回调函数；
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

```


## 第二部分：给JQ对象添加一些方法和属性

```js
jQuery.fn = jQuery.prototype = {
    jquery : 版本

    constructor : 修正指向的问题

    init() : 初始化与参数管理

    selector : 存储选择字符串

    length : this对象的长度

    toArray() : 转数组

    get() : 转原生集合

    pushStack() : JQ对象的入栈

    each() : 遍历集合

    ready() : DOM加载的接口

    slice() : 集合的截取

    first() : 集合的第一项

    last() : 集合的最后一项

    eq() : 集合的指定项

    map() : 返回新集合

    end() : 返回集合前一状态

    push() : (内部使用)

    sort() : (内部使用)
     
    splice() : (内部使用)
}

```

### constructor : 修正指向的问题

```js
// constructor 就是面向对象中，创建出来的那个对象下面所拥有的一个属性，而这个属性就指向创建所属对象的构造函数；
constructor: jQuery,


// 在js当中一个构造函数创建完成之后，就会自动在构造函数的原型上面创建一个constructor属性，属性指向构造函数；
function Aaa(){};
Aaa.prototype.constructor = Aaa; //既然是自动生成的，那么jq中为什么还要去手动的去指向一下喃？

// 构造函数的原型是一个对象，向对象原型上面添加方法一般有两种写法：

function Aaa (){
}
// 写法一： 
Aaa.prototype.name = 'hello';
Aaa.prototype.age = 23;
alert(Aaa.prototype.constructor) //Aaa 指向正确，因为上面的写法是向原型上进行添加处理，所以原型上的属性不会受到影响；

// 写法二
Aaa.prototype = {
    name: 'hello',
    age : 23
}
alert(Aaa.prototype.constructor)  //Object 即在这种情况下，constructor的指向出现了问题；因为上面的写法是利用一个对象将原型覆盖掉的写法，所以Aaa.prototype.constructor就会被新对象中的constructor给覆盖掉，而这会对下面的使用产生影响，所以需要将指向修正过来：

Aaa.prototype = {
    constructor: Aaa,
    name: 'hello',
    age : 23
}
alert(Aaa.prototype.constructor)  //Aaa  指向正确，而jquery在为原型添加方法的时候，恰恰就是使用，第二种方式，所以也对constructor指针进行了修正；
```

### init() : 初始化与参数管理

```js
// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
    },
// 从上面的代码中可以看出，init()方法是在jQuery的中去执行，是真正的构造函数，执行的时候会接收jQuery构造函数传来的两个参数selector 与context  第三个rootjQuery是刚开始定义的变量jQuery(document) ;

init: function( selector, context, rootjQuery ) {

// selector是选择器 context是执行上下文（限制条件）
$('li') 选择是所有的li;
$('li','ul') 选的是ul下的li;即第二个参数可以指定一个范围

// jquery()中可以接受的类型有很多，所以init会对不同类型做不同的处理

    //1、HANDLE: $(""), $(null), $(undefined), $(false)
    $(""), $(null), $(undefined), $(false)

    //2、 Handle HTML strings
    $('#div') $('.box') $('div') $('#div div.box' ) 

    $('<div>') $('<div>1</div><div>1</div>')//字符串的情况下 除了可以选择，还可以创建dom节点；

    //3、 HANDLE: $(DOMElement)

    $(this) $(document) //对dom对象进行处理

    //4、 HANDLE: $(function)

     $(function(){})

    //5、 HANDLE: array json

    $([]) $({})

```

####  预备知识：对$('div').css('background','red')的理解：

```js
// 若我们是利用原生进行操所，首先需要获取到三个li, 然后利用for循环将其背景颜色变成红色；

// $('div')就相当于
var aLi = document.getElementByTagname('li');

// .css('background','red')就相当于
for(var i=0;i<aLi.length; i++){
    aLi[i].style.background = 'red';
}

// 实际上jquery里面真实做的，就是上面两个步骤，但是有一个细节:var aLi = document.getElementByTagname('li');获取的是一个变量，而变量在面向对象之中是一个局部的，即aLi变量在$()方法中是一个局部的，所以在css方法中就不能找到aLi这个变量；

// 其实在面向对象中，真正能够共享的或能够找到的其实只有对象的属性或对象的方法，都得基于this! 在执行不同的方法时去调用this,通过this对象的属性去找到具体的值，直接通过局部的变量是找不到具体的值的；jquery中采用如下的处理方式：

// 既然this是共享的，而this本身就是一个对象，执行过$('li')后，就将获取到的dom对象 放到this的属性上面去；除此以外还有一个length值用来记dom对象的数量；也就是$('li')真正做的就是下面的处理

this = {
    ...
    0 : 'li',
    1 : 'li',
    2 : 'li',
    length : 3
    ...
}

//  通常情况下json 是不能狗进行for循环的，而只能执行for in; 但是上面这个json 被故意设置的可以循环，首先其属性是通过下标（0、1、2）的形式出现的，而且里面还有一个length属性；所以在css方法中其是可以循环的；也就是说在jquery中的css方法中真正运作的是下面这个结构；

for (var i=0; i<this.length;i++){
    this[i].style.background = 'red';
}

// 对length的理解：
// jquery默认在jQuery.prototype 上定义了length 属性，其默认的值就是0，放几个dom的元素则，length的值就会变成几；根据这个原理:

$('li') -- > this = {
    0: 'li',
    1: 'li',
    2: 'li'
} 

$('li')[2].style.background = 'red'; //$('li')[2] 是第三个
	
```

#### 处理字符串

```js
// 用来判别selector是否是标签

if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
    // $('<div>') $('<div>1</div><div>1</div>') 创建标签
    match = [ null, selector, null ];

    //1、 match = [null, '<div>', null]  <----$('<div>')
    //2、 match = [null, '<div>1</div><div>1</div>', null]  <----$('<div>1</div><div>1</div>')
} else {

    // $('#div') $('.box') $('div') $('#div div.box' ) 
    // $('<div>hello') == $('<div>') 特殊情况需要单独的处理；
    match = rquickExpr.exec( selector );

    // rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    //3、 match = null;  <---$('.box') $('div') $('#div div.box' ) 
    //4、 match = ['#div1',null,'div1'];  <---$('#div1')
    //5、 match = ['<li>hello','<li>',null];  <---$('<li>hello')
}

```

```js

//  1、 match 不为空，就排除了 上面第三条
//  2、 match 数组的第二个元素不为空，就排除了第4条， 
//  3、 match 数组的第二个元素为空，context上下文为空，这就会走$("#div1")的情况，因为id是最顶级的，我们不能从一个元素下面去获取id; 只要是id 就没有上下文；
    if ( match && (match[1] || !context) ) {
        // 经上面分析，能进入到此的就两种情况：$('<div>') $('#div1')

        // HANDLE: $(html) -> $(array) 
        if ( match[1] ) {
            // match[1]不为空就是创建标签的情况，

            // 对于创建标签为什么要指明执行上下文，可以去看下面的注释1；
            context = context instanceof jQuery ? context[0] : context;

            // scripts is true for back-compat
            //  jQuery.parseHTML主要是将一个html字符串，去转化为一个节点数组,并将这个节点数组返回， 注释2；
            //  此处调用jQuery.merge()方法的目的 见注释3；
            //  整个这一块就是将获取到的dom节点，添加到this可索引的属性上面，并且去改变length的人值；
            jQuery.merge( this, jQuery.parseHTML(
                match[1],
                context && context.nodeType ? context.ownerDocument || context : document,
                true
            ) );

            // HANDLE: $(html, props)  //见注释4
            // 主要是针对 $('<li>',{title: 'abs'})的情况;
            if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {

                // 利用for in 去循环属性json集合；
                for ( match in context ) {
                    // Properties of context are called as methods if possible
                    // 类似 html()方法，this 对象上面本身就有，可以直接拿来用
                    if ( jQuery.isFunction( this[ match ] ) ) {
                        this[ match ]( context[ match ] );

                    // ...and otherwise set as attributes
                    // 对于没有的方法，如设置title 则需要先设置，而后去赋值；
                    } else {
                        this.attr( match, context[ match ] );
                    }
                }
            }
            return this;

        // HANDLE: $(#id) 选择id的情况
        } else {
                elem = document.getElementById( match[2] );

                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                // 用于解决Blackberry 4.6 的bug clone节点时，节点不存在，但是页面上依旧可以找到的bug;
                if ( elem && elem.parentNode ) {
                    // Inject the element directly into the jQuery object
                    // 原理与前面讨论的一样，面向对象的情况下，方法之间只有this是可以共享的，所以就将获取到的值 都存储到this对象的属性中；
                    this.length = 1;
                    this[0] = elem;
                }

                this.context = document;
                this.selector = selector;
                return this;
        }
    // HANDLE: $(expr, $(...)) --$('.box') $('div') $('#div div.box' ) 
    // context.jquery 判断context是否为jquery对象；
    // 如果context不存在  就会走 rootjQuery.find(selector)方法，即利用sizzle

         } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

    // HANDLE: $(expr, context) 当存在上下文且上下文不是一个jquery对象就会走下面的逻辑, 下面的逻辑也是先将context ---> rootjQuery 然后再去find(selector)
    // 因为只有$对象才能去使用find方法，所以此处对dom对象做出处理；
    // (which is just equivalent to: $(context).find(expr)

        } else {
        return this.constructor( context ).find( selector );

    // 其实上面的逻辑很简单 this.constructor 指向的就是jQuery 
    // 	constructor: jQuery, 100行
    //  而context执行上下文，上面分析就两个document 与contentWindow.document;
    
    // this.constructor( context ).find( selector ); == jQuery(document).find(selector);


    // HANDLE: $(DOMElement) ---> $(document) $(this)
    // selector.nodeType 判断selector是否具有nodeType属性，若其是一个节点其肯定会有nodeType属性；
    // 其实就是想办法将所找到的dom元素，都存储到this上面，让其形成带下标与length的形式；
    } else if ( selector.nodeType ) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;

    // HANDLE: $(function) 处理函数的形式,$(function(){})
    // 主要是处理文档加载，在里面所写的函数就相当于window.onload= function(){};
    // 在jQuery中有两种处理文档加载的方法：
    // 1、$(function(){}); 
    // 2、$(document).ready(function(){});
    // 通过下面的代码我们可以看出第一种其实是第二种的额简写，两种走的都是ready方法；
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
        return rootjQuery.ready( selector );
    }

    // 主要是处理类似 $($('#div'))的情况，即selector是一个jQuery对象，其实这样写是完全没有意义的，但是这样去写也不会去报错；
    // 处理的思路是将$($('#div')) ====> $('#div')的形式
    // 通过判断对象有无selector属性来判别是否为一个jQuery对象；
    if ( selector.selector !== undefined ) {
        this.selector = selector.selector;
        this.context = selector.context;
    }

    // 针对$([]) 、 $({})的情况进行处理；见注释5 $.makeArray()方法的用法
    // 利用$.makeArray()方法，将[]与{}并到this对象中去：
    return jQuery.makeArray( selector, this );
    
```

>  注释1：创建元素为什么要去指定执行上下文

```js
// 平时我们去创建一个标签
$('<li>')  == document.createElement('li');

// 而指明第二个参数的意义 并非是实现如下的效果
$('<li>','ul') == oUl.createElement('li');
// 上面的做法是不对的，其实第二个参数，能指定的值只能存在一种情况，document
// 第二个参数的意思是在指定不同的环境下去找到根节点
$('<li>', document) 

// 如果不指定context默认是document节点,即指向当前页面的根节点
$('<li>') == $('<li>',document)

// 有了这个选项，我们可以去指定iframe页面的根节点 即在指定的iframe中去创建节点
$('<li>',contentWindow.document) 


// 之所以要对context的类型做判别是因为我们指定的context有可能是一个jQuery对象
// context instanceof jQuery ? context[0] : context;

// 如果是原生dom对象就直接返回，如果是jQuery对象就转为原生对象
$('<li>',$(document))
```

> 注释2：jQuery.parseHTML()是使用

```js
$(function(){
    // 此出<\/script> 要将</script>中的斜杠转义
    var str = '<li>1</li><li>2</li><l i>3</li><script>alert(3)<\/script>'

    // parseHTML主要是用作将html字符串，转化为dom节点数组；可以接受三个参数
    // 1、要转化的字符串，
    // 2、指定一下context 根节点document
    // 3、boolean default:false specify to script elements , when false script elements can't apeend to point elements,  when true script can be added to point location;
    var arr = jQuery.parseHTML(str,document,true);

    $.each(arr,function(i){
        $('ul').append(arr[i]);
    })
})
```

>  注释3： 调用jQuery.merge() 的目的

```js
// 当我们在调用$('<li>')的方法时，最终要达到如下的效果；而我们上面利用jQuery.parseHTML()只能将字符串转化为一个数组，而并非是一个json; 此时我们要去做的就是将节点数组，合并到this指向的json 中;
$('<li>1</li><li>2</li><li>3</li>')
===>
this = {
    0 : 'li',
    1 : 'li',
    2 : 'li',
    length : 2
} //这是我们操作的目的；

// 但平时我们使用是$.merge()一般是用来去合并两个数组，但在jquery中 $.merge()可以用来将一个数组去合并到一个特殊格式的json 对象中；

var json1 = {
    0: 'a',
    1: 'a',
    length: 2
}
var arr = ['c','d'];
console.log($.merge(json1, arr));
//{
//     0: 'a',
//     1: 'a',
//     2: 'c',
//     3: 'd',
//     length : 4
// }

```

>  注释4：rsingleTag.test( match[1] ) && jQuery.isPlainObject( context )

```js
// 主要就是针对如下的这种情况：即在创建标签的时候，为标签添加一定的属性，这个操作不是很常用；
jQuery('li',{
    titile : 'adb',
    html: '1234',
    css: {
        background: 'red',
        height: '10'
    }
})

rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/ 
// 用来判别是否是纯粹的单标签 $('<li>')或$('<li></li>') 标签中间没有任何的东西
jQuery.isPlainObject() 
//用来判断是否是一个纯粹的对象，即该对象是通过"{}"或"new Object"创建的

```

> 注释5：$.makeArray()方法的使用；用来将一个节点集合转化为数组，从而可以去使用数组的方法；

```js
$(function(){
    // aDiv是一个节点集合，虽然有数组的下标，但是并不是真正的数组，即可以使用数组的下标但是不可以去使用数组的方法，
    // 即我们直接调用aDiv.push()方法肯定会报错；
    var aDiv = document.getElementsByTagName('div');
    
    // 此时我们可以利用$.makeArray()方法来将节点集合转化为一个数组，从而可以去使用数组的方法；
    $.makeArray(aDiv).push() ; //此时去调用数组的push方法，就不会报错；
})
```

```js
// 与jQuery.merge()方法类似，当方法接受两个参数时，其表示源码内部的特殊使用，当jQuery.makeArray()接收两个参数时，不仅可以将对象转化的数组，还可以将其转化为我们想要的json形式；
$(function(){
    var aDiv = document.getElementsByTagName('div');

    // 当接受两个参数时，第二个参数可以是一个json ,json中有一个length属性，属性的默认值为0；
    console.log($.makeArray(aDiv,{length : 0}))
    // 可以打印出如下的结果：
    // {
    //     0: div,
    //     1: div,
    //     2: div,
    //     length: 3
    // }
})

```

### toArray()转原生数组方法；

其实这个方法与$.makeArray()方法类似只不过后者是jQuery 的工具方法，可以给jquery对象，也可以给原生的js来使用，而toArray()是对象方法，只能给jquery对象实例来使用，

```js
// toArray()方法的使用
console.log($('div')) -- > {0:div, 1:div, length:2, ...} 返回的this json对象
console.log($('div').toArray()) ---> [div,div,div] 打印的是一个原生的数组，即可以使用原生的数组方法，而不能去使用jquery的方法；
```

```js
// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],
    core_slice = core_deletedIds.slice,
    slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
    },
    pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},
	toArray: function() {
		return core_slice.call( this );
    },
    
```

### get()转原生集合的方法

作用是将jquery对象转化成为原生的集合
```js
//若get()不传参，则其返回的是 dom原生对象的集合，不写下标就代表整体
for (var i=0; i<$('div').get().length; i++){
    // 若指定下标，就是选中集合中的某一项
    $('div').get(i).innerHTML = '';
}
```
```js
// 有num就代表指定下标的情况；之所以sum could be negative,that is because we can sort from last, when sum be '-1' , it be the last one;
get: function( num ) {
    return num == null ?

        // Return a 'clean' array
        this.toArray() :

        // Return just the object
        ( num < 0 ? this[ this.length + num ] : this[ num ] );
},

```



### pushStack() : JQ对象的入栈处理

* 基本使用

```js
// <div>div</div>
// <span>span</span>

// 因为栈顶是span ,所以最后只有span的颜色会改变；
$('div').pushStack($('span')).css('background','red');//only span turn red;

// 若想改变 底层对象的颜色，可以利用end()方法，去回溯栈的下一层，如下面的虱子，就可以使div的颜色变成黄色；
$('div').pushStack($('span')).end().css('background','yellow')

// 而end() 就是通过栈顶对象的prevObject属性找到，挂载的底层对象，将栈底的对象返回，然后对对象进行操作；
end: function() {
    // 我们可以多次调用，直至回溯到最顶端，然后就是一个空对象；
    // this.constructor(null) = jquery(null);
    return this.prevObject || this.constructor(null);
},
```

* 源码解析
```js
// Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack: function( elems ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    // 之前的对象其要去存储一下，存储的就是this,this其实就是先进栈的那个对象,上例中指的就是$('div')
    // 等于是在新入栈的jQuery对象上新开辟一个属性prevObject ,用来挂载被自己压下去的对象；
    // 而这个对象，可以利用end()方法来回溯到；
    ret.prevObject = this;
    // assign old object context to the new one, because context isn't changed, just assign;
    ret.context = this.context;

    // Return the newly-formed element set
    return ret;
},

``` 

* 内部使用，其实pushStack外面基本上不怎么会使用，基本上是在内部去使用，用来处理一系列的情况;

```js
//html:  div*4 + span
// jquery中的slice()方法，与数组中的slice()有点类似，就是用来截取
$('div').slice(1,3).css('background','red');//只有2.3两个div变红；

// 注意此处栈的结构，栈顶是截取的两个div，而栈底是全部的四个div；
// 调用slice()方法之前，栈顶是4个div,而调用slice()方法之后，slice将截取的两个div压到栈，并将原栈顶的4个div压在后面；

$('div').slice(1,3).end().css('color','blue') // 4个div的文本都是可以变成蓝色的；即end()回溯的是4个div;

// slice 源码：
slice: function() {
    // 其实在slice中真正操作的也是入栈操作；
    return this.pushStack( core_slice.apply( this, arguments ) );
},

```

### each() : 遍历集合--加强版的for循环

```js
each: function( callback, args ) {
    // 主要是通过调用jquery的工具方法 $.each()；来实现的
    return jQuery.each( this, callback, args );
},

```

###  ready() : DOM加载的接口

```js

ready: function( fn ) {
    // Add the callback
    // 主要是调用了一个内部方法，添加了一个回调；
    jQuery.ready.promise().done( fn );

    return this;
},

```

### first():集合的第一项 | last():集合的最后一项 |  eq():集合的指定项

```js
// first() | last() 最终调用的还是eq();
first: function() {
    return this.eq( 0 );
},

last: function() {
    return this.eq( -1 );
},

eq: function( i ) {
    var len = this.length,
        j = +i + ( i < 0 ? len : 0 );
    // 原理与slice()方法类似，指定那个对象，就将哪一个对象取出来压入栈顶；如果指定的num超出范围，就将一个空 压到栈顶
    return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
},


```

###  map() : 返回新集合 这个用法与源码都不是很了解；

```js


```

```js
// 对集合进行二次处理，最终调用的还是pushStack,而具体的实现还是依靠调用工具方法 进行二次处理，与each()方法类似； 
map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
        return callback.call( elem, i, elem );
    }));
},

```

###  push():(内部使用)|sort():(内部使用)|splice() : (内部使用)

```js

// For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push: core_push,
sort: [].sort,
splice: [].splice

// 将数组的方法，挂载在jQuery对象上面，所以此时jQuery对象就有了数组的方法；不建议在外面使用，因为更像是数组的方法；

```


##  第二部分（285,347）extend:JQ的继承方法 解析：

```js
// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

```


* extend继承的简写方式

```js
jQuery.extend = jQuery.fn.extend =  function(){
    
    定义一些变量

     if(){} 看是不是神copy的情况

     if(){} 看参数是否正确

     if(){} 看是不是插件的情况

     for(){ 可能有多个对象情况

        if(){} 防止循环引用

        if(){} 深copy

        else if(){} 浅copy
     }

}

```

```js
// jQuery.extend 是将 extend方法 扩展到jQuery对象下面，而jQuery是一个函数，将一个方法扩展到函数下面，这种写法，叫做扩展静态方法；
// jQuery.fn.extend = jQuery.prototype.extend 事件extend方法扩展到 函数的原型上面，这种就是扩展实例方法，这两种扩展方式使用的是同一套的代码；
jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        // 存有多个对象的情况下，后面的对象都需要想第一个对象身上去扩展，即arguments[0]为扩展的一个目标；所以此处命名为target;
		target = arguments[0] || {},
		i = 1,
        length = arguments.length,
        // 是否执行深copy
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
        deep = target;
        // 执行深copy时 目标扩展对象不在是第一个对象；
        target = arguments[1] || {};
        // skip the boolean and the target
        // 因为参数改了，i的顺序肯定要发生改变；
		i = 2;
	}

    // Handle case when target is a string or something (possible in deep copy)
    // 即当目标不是一个对象，或是一个函数的时候，就将target转化为一个空对象；
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
        // 无非就是$ 与 $.prototype
		target = this;
		--i;
	}
    // handle case when there are serval arguments 从第二个对象开始，会有n多个对象，而这些对象，都要拓展到第一个对象上面；具体的做法是利用循环；
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop 防止循环引用，见注释2；
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    // 如果options对象对应name属性的值是一个数组或者是一个对象；
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
                        //添加对象要见name属性与属性值添加到目标对象上面去；
                        //src 存在 即目标本身就有这样一个name属性；
                        // var a = {age : 30};
                        // var b = {name : 'lisy'}
                        // $.extend(true,a,b)
                        // console.log(a)  {age:30, name: 'lisy'}
                        // 之所以不会影响就是因为走的是src, 若直接走的{}, 则age就会不存在；
						// clone = {};
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

                    // Never move original objects, clone them；
                    // 此处用到了，递归 知道copy不是一个arry或者object 就递归返回；
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
                    // 深copy与浅copy的主要区别就是，若被添加对象的属性值是一个对象，将这个对象的添加到目标对象对应的属性值上面之后，两者会不会相互引用，就相互之间是否会有影响;\
                    
                    // 若是一个基本对象赋值，就是一个简单的赋值，其没有对象之间的引用关系；

                    // 若被添加的对象对应的属性值是一个对象，将对象直接赋值到目标对象对应的的属性值上面，这就会存在一种引用关系；就会互相去影响;所以说我们在进行深copy的时候，利用递归一层一层，向下去找，直到copy是一个基本类型，递归就会停止，递归就会返回；这样目标对象的 与 操作对象的属性值，之间就没有了引用的关系；
 
                    // 目标对象的name 属性， 与被添加的对象的name属性copy 是一个引用关系，即在浅拷贝到情况下，两者引用的是同一个，修改一个会影响到另外一个；
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

// jquery 采用的copy继承 ； js采用 类式继承 / 原型继承； 


```

> 注释1 ： $.extend() $.fn.extend()的使用区别：

```js
// 1、当参数中只写一个对象自变量的时候，是JQ的扩展插件的方式；

// 1.1、 扩展工具方法
$.extend({ 
    aaa : function(){
        alert(1);
    },
    bbb : function(){
        alert(2);
    }
})
// 方法调用
$.aaa();
$.bbb()

// 1.2、 扩展实例方法
$.fn.extend({ 
    aaa : function(){
        alert(1);
    },
    bbb : function(){
        alert(2);
    }
})
// 方法调用
$().aaa();
$().bbb()


// 2、为什么可以使用同一套函数来实现不同的操作？ this的指向不同
// 对象调用extend() 则this指向的是$ 方法被添加到 $上面，所以最后是用$ 来调用添加的方法；
$.extend(); --> this->$  -> this.aaa  -> $.aaa() 

// 对象的原型调用extend()方法，则this指向的是对象的原型$.prototype ,最后新的方法是被添加到对象的原型上面，所以需要对象的实例去调用新添加的方法；
$.fn.extend(); -->  this->$.prototype  -> this.prototype.aaa -$().aaa()

// 结论： 不同的调用方式，this的指向是不同的，所以可以利用同一套方法（代码），来实现不同的功能；

// 3、当写了多个对象的时候，后面的对象都是要扩展到第一个对象上面；

// 4、当传递的 第一个参数为true时执行深copy操作，默认为false 即浅copy ;具体可以去参照文档； 
```


> 注释2 ： 循环引用

```js
// 在JavaScript中，当一个DOM对象包含了一个JavaScript对象的引用(比如一个事件的function), 同时那个JavaScript的对象又包含了一个这个DOM对象的引用，这样就造成了一个循环引用的结构。例如

var s = document.createElement(‘span’);
document.body.appendChild(s);
s.onclick=function (){
    // js对象中包含了，对dom对象的引用；
    s.style.backgroundColor = ‘red’;
    alert(n);
};
```

```js

var a = {};

$.extend(a, {name : a}) ;

options = arguments[i] =  {name :a};
copy = options[name] = a

target = a

// 即添加的对象 和 被添加的对象引用同一个对象；等于是自己去添加自己；


```

## 第三部分：利用extend() 扩展一些工具方法

工具方法，不仅可以给jquery源码来用(很多实例方法调用的都是工具方法，工具方法相对来说位于底层)，也可以给原生js来使用;

```js
jQuery.extend({
    expando() : 生成唯一的JQ字符串（内部）

    noConflict() : 防止冲突

    isReady : DOM是否加载完（内部）

    readyWait : 等待多少文件的计数器（内部）

    holdReady() : 推迟DOM触发

    ready() : 准备DOM触发

    isFunction() : 判断是否为函数

    isArray() : 是否为数组

    isWindow() : 是否为window 

    isNumberic() : 是否为数字

    type() : 判断数据类型

    isPlainObject() : 是否为对象自变量
    
    isEmptyObject() : 是否为空的对象

    error() : 抛出异常

    parseHTML() : 解析节点

    parseJSON() : 解析JSON

    parseXML() : 解析XML

    noop() : 空函数

    globalEval() : 全局解析js

    camelCase() : 转驼峰

    nodeName() : 是否为指定节点名（内部）

    each() : 遍历集合

    trim() : 去前后空格

    makeArray() : 类数组转真数组

    inArray() : 数组版的indexOf

    merge() : 合并数组

    grep() : 过滤新数组

    map() : 映射新数组

    guid() : 唯一标识符（内部）

    proxy() : 改this的指向

    now() : 当前时间

    swap() : css交换（内部)

}) ;
jQuery.ready.promise = function(){}; 检测DoM的异步操作（内部—）
function isArraylike(){} 类似数组的判断（内部）
 
```

### expando() : 生成唯一的JQ字符串（内部）

```js
// Unique for each copy of jQuery on the page
expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),
// 因为每次生成的字符串，都是不同的且是唯一的，所以其就具备了我们的唯一性; 这对后面做映射关系有很大的帮助，因为可以通过这唯一的字符串，而去找到相应的值； 数据缓存data() 事件操纵on() 异步请求ajax()都有用到这个字符串; 
// 结论： 这个唯一的字符串主要就是去作为一个映射关系来使用；

```

### noConflict() : 防止冲突

在jQuery中我们平时对外面提供的接口其实就有两个$ 与 jQuery ，而这两个并非是jquery独有的，列入其它的库也可能会用到$， 这有可能就会起冲突，所以jquery就提供了这个方法，用来去解决这冲突；


```js
// 使用原理：

// 这样就会将noConflict()方法返回的接口jQuery引用到miaov上面，这样miaov就可以调用对象上面的方法; 就是依靠这个原理来去解决冲突；
var miaov = $.noConflict();
var $ = 123;

// dom 加载完成之后执行;
miaov(function(){
    alert(123);
})

```

```js
// 中间的两句 if主要是针对，var $ = 3;这样一句话 出现在jquery库 引用的上面的情况，即 

<script> 
var $ = 3;
var jQuery = 123;
</script>
<script src="./jquery2.0.3.js"></script>
<script>

// Map over the $ in case of overwrite，row 41
_$ = window.$ = 3;
// jquery 加载的时候，会将$的值放到私有的 _$ 上面；

// 调jquery的库，window.$ 就是对外的接口，肯定是与jQuery相等的；
if ( window.$ === jQuery ) {
    window.$ = _$;
    // 其实在走完上面这句代码的时候，jQery已经放弃$,而$ 还是刚开始时的3
}

</script>

```

```js

noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
        window.$ = _$;
    }
    // 参数deep是用来放弃jQuery 这个对外的接口的；原理与放弃$的过程类似；都是先依靠私有变量_jquery缓存一下
    if ( deep && window.jQuery === jQuery ) {
        window.jQuery = _jQuery;
    }
    // 将对外提供的接口返回，即不管在外面是谁接受了这个接口，其都可以去调用jquery的方法；
    return jQuery;
},
```

### isReady : DOM是否加载完（内部）

```js
```

### readyWait : 等待多少文件的计数器（内部）

```js
```

### holdReady() : 推迟DOM触发

* 基本的使用：主要是用来推迟DOM的触发

```js

$.holdReady(true); //如果此处推迟dom 触发，123就不会弹出来

$.holdReady(false); //解除推迟触发； 

$(function(){
    alert(123)
}); 

```

* 具体使用场景

```js
// $.getScript() 异步的动态的去加载js 

$.getScript('a.js',function(){

})
// a.js 中一行代码 alert(1)
$(function(){
    alert(2);
})

//  由于$.getScript()是异步加载的，其其加载并不会影响到后续代码的执行，有可能alert(2)都已经弹出来的，而a.js还没有加载完毕；这样就会出现一个问题，因为很多时候我们在引用插件或引用外部文件的时候，都想等文件加载完，而后再去触发dom 所绑定的函数；比如alert(2)所在的函数内部是需要引用a.js里面的东西的；

// 怎么样能做到，先等文件加载完，而后等待dom加载？ 此时就需要用得到holdReady()方法

$.holdReady(true);//先给其hold住了
$.getScript('a.js',funciton(){
    $.holdReady(false); //等文件加载完成之后，在回调函数中去取消延迟；
})
$(function(){
    // 而后去等待dom加载；
})

// 总结：其实holdReady()就是用来做这件事情的；
```

* 源码

```js
// A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait: 1,
// Hold (or release) the ready event
holdReady: function( hold ) {
    if ( hold ) {
        // 如果传入的为true 就让变量进行++ 操作 
        // 主要是针对，hold多个的情况 每hlod true一次就加1次；见注释
        jQuery.readyWait++;
    } else {
        // 进到这里就是hold(false) 即 没进到这里一次就会释放一次；
        jQuery.ready( true );

        // $.ready()源码之中：
        // Abort if there are pending holds or we're already ready

        // 对$.readyWait 进行--操作，如果结果为0 ，就说明可以不用等了，就接着向下操作，直至DOM触发； 而若$.readyWait ---操作不等于0；级$.readyWait >1 就直接return掉； 就是接着等；
		// if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
		// 	return;
        // }
        // Remember that the DOM is ready
		// jQuery.isReady = true;

        // If a normal DOM Ready event fired, decrement, and wait if need be
        // 依旧是对等待的次数去做判别，看是否需要去继续等待；
		// if ( wait !== true && --jQuery.readyWait > 0 ) {
		// 	return;
		// }
    }
},

```

> 注释 .readyWait计数器的意义


```js
$.holdReady(true);
$.getScript('b.js',funciton(){
    $.holdReady(false);
})
$.holdReady(true);
$.getScript('b.js',funciton(){
    $.holdReady(false);
})
$.holdReady(true);
$.getScript('c.js',funciton(){
    $.holdReady(false);
})
 
// hold了三次，就说明readyWait 累加了三回，释放的时候就要释放三回，即readyWait一次次递减，才能最终让dom触发；
```

### ready() : 准备DOM触发

```js
```

> 注释1： isReady() readyWait holdReady() ready()四个方法都是与dom加载有关系的，jQuery.ready.promise同样与dom加载有关系；

* 两种执行dom加载等待的异同；

```js
// 等待dom加载完毕后执行
$(function(){
})
// 等页面所有东西 都加载完成之后去执行；
window.onload = function(){}


<img src=""> 有tag img 也有 src 所指定的图片 ，而页面的加载顺序是先将节点img加载，而后才会加载图片；window.onload会等节点与文件都加载完毕后，才会执行function ；而jquery是只要dom加载完其就会去执行，而不会去等文件加载，所以说其加载的速度，要高于window.onload; 而这一点jquery 是利用原生当中 dom加载完成的事件 DOMContendLoaded 来实现的；

执行$(function(){})  会返回 return rootjQuery.ready( selector ) 最终调用的是$(document).ready(function(){})

```

* $(function(){})执行过程与原理

```js
$(function(){}) 调用的是 $(document).ready(function(){}) 185 行

$(document).ready(function(){}) 实际上调用的 $().ready()的实例方法； 
 
// 从done(fn) 可以看出 jQuery.ready.promise()实际上是一个延迟对象，done(fn)是将fn先存储到延迟对象当中，等条件满足之后，就会触发fn;
$().ready() 主要是通过 jQuery.ready.promise().done( fn );

//1、 readList 刚开始定义的就是一个空对象，即第一次是可以进来的，后面的就不可以进来了，后面的进不来没关系，函数同样会进到done()里面
if ( !readyList ) {
    // 2、创建一个延迟对象；
    readyList = jQuery.Deferred();

    //3、 针对有的时候 我们在调用 $(function(){})方法的时候，dom其实就已经加载完毕了，所以我们就没有必要去重新检测了，而dom 加载完成的标志其实就是 document.readyState === "complete" , 这种情况我们直接去调用方法就好了；
    if ( document.readyState === "complete" ) {
        // 条件满足就会走$.ready()这个工具方法
        //4、之所以要放一个延迟定时器（省略第二个参数），是为了解决ie的一个bug, 即当dom加载还有一点的时候，ie会提前去触发，所以此处加了一个延迟；这是一个hack的写法；
        setTimeout( jQuery.ready );
    } else {

        //5、 正常的检测，而起检测的时候，为什么既要去检测DOMContendKoaded 又要去检测load ,前面已经提到DOMContendKoaded 要高于load 那我们只去检测一个不就行了么？ 
        // 之所以这样做，是因为有些浏览器其有一个特点，就是会去缓存这个load ;其缓存这个事件之后，就会先去触发这个事件， 即这种情况下，load事件要快于DOMContentLoaded事件；所以为了保证第一时间加载，所以最好两个都写，谁先写好就走哪一个，不管谁先走好，都是去调用completed函数
        document.addEventListener( "DOMContentLoaded", completed, false );
        window.addEventListener( "load", completed, false );
        //else就会走completed;方法
    }
} 
// 之所以promise() 就是延迟对象的状态有两种--完成与没完成，而这种状态在外部是可以被修改的，但是 promise有一个特点，就是状态不能被修改；
return readyList.promise( obj );

// 5. 不管是走DOMContentLoaded 还是去走load 最终都会去调用completed ， 而不管谁走进completed里面，都会将绑定的两个事件取消掉；
completed = function() {
    document.removeEventListener( "DOMContentLoaded", completed, false );
    window.removeEventListener( "load", completed, false );
    // 6. 无论谁触发，$.ready()都只会触发一次；第二个事件就会被取消掉
    jQuery.ready();
};


// completed源码中主要走的依旧是 $.ready()方法； 93行

// 即jQuery.ready.promise无论走哪一个if流程，最终调用的依旧是 $.ready()方法；

// $.ready()方法,z主要执行的下一句代码，ready.promise将函数绑到延迟对象上面，$.ready执行延迟对象上的函数；

// Handle when the DOM is ready $.ready()
ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
        return;
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
        return;
    }

    // If there are functions bound, to execute
    // 7、 只要走到这一步，我们原先在缓存对象上，异步存储的fn 就会被触发
    // 而我们平时是利用 readList.resolve()去做触发
    // resolveWith() 是可以进行传参处理的  
    // resolveWith( document, [ jQuery ] ) 中 document this的指向 []里面存放的的就是参数列表；jQuery就是列表中的一个元素；
    // $(function( arg ){  实验
    //     console.log(this); //document
    //     console.log(arg) ; //jQuery
    // })

    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    // 8、与事件进行主动触发有关系，除了上面的几种写法之外，我们也可以去利用如下的写法
    // $(document).on('ready',function(){
    // })  这样等待dom加载后执行函数的方式，就有了三种：
    // $(function(){})
    // $(document).ready(function(){})
    // $(document).on('ready',function(){})
    // 判断有没有主动触发的方法，有的话直接去调用，主动触发
    if ( jQuery.fn.trigger ) {
        jQuery( document ).trigger("ready").off("ready");
    }
},

// 忍受得了 被忽视， 主要还是因为自己太孤独了，




// 就是这么一个过程，根本上是通过原生DOMContendLoaded 实现的；
```

### isFunction() : 判断是否为函数

主要是看判断类型在jquery中是如何实现的；

```js
// See test/unit/core.js for details concerning isFunction.
// Since version 1.3, DOM methods and functions like alert
// aren't supported. They return false on IE (#2968).
// 对于dom方法与原生方法，判断是不一样的，在第版本ie中 都会返回object而不会返回一个function; 

isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
},
```

### isArray() : 是否为数组

```js
isArray: Array.isArray,//因为ECMA5的版本中，原生的js已经支持这个方法了.jquery选择用Array.isArray速度就会很快；若是做兼容的话，依旧用$.type()方法；
```

### isWindow() : 是否为window 

```js
isWindow: function( obj ) {
    // obj != null obj不为空 或 不为undefined(等于空)
    // 因为null与undefined是不可能有属性，基本类型没有对应的包装对象，字符串与数组都有对应的包装对象，都可以添加相应的属性与方法；但是null与undefined不行，直接写null.window 浏览器就会报错，而为了避免浏览器报错，就在前面做了一个判断；所以就将 obj != null 写在了前面；

    // window.window的意义，
    // window在js中有两个意义，一是去充当全局的对象，二是当作浏览器窗口
    // window.open() //就是打开窗口的意思；
    // window.window //全局对象下面的窗口
    // window = window.window 只有window可以这样去比较；这就成为了iswindow的判别方式；
    return obj != null && obj === obj.window;
},
```

### isNumberic() : 是否为数字

```js
// 之所以不用原生的typeof 是因为原生的js在某些情况下其会出错；
console.log(typeof 123) //true
console.log(typeof NaN) //true 但NaN实际上并不是数字类型的

console.log($.isNumberic(NaN)) //false 这就判别出来了
```

```js
isNumeric: function( obj ) {
    // !isNaN( parseFloat(obj)  主要就是用来规避NaN的
    // parseFloat(NaN) ==> NaN 
    // isNaN(NaN)  ==> true
    // !isNaN(NaN) == > false 

    // parseFloat(123) ==> 123 
    // isNaN(NaN)  ==> false
    // !isNaN(NaN) == > true 

    // isFinite( obj )判断传入的数字是否是一个有限的数字类型；因为计算机的计算能力是有限的，如果超出了计算机的计算范围，就会出问题；若超出范围就会返回false;
    // console.log(isFinite(Number.MAX_VALUE + Number.MAX_VALUE ))  //false
    // Number.MAX_VALUE 这台计算机能计算的最大范围

    return !isNaN( parseFloat(obj) ) && isFinite( obj );
    // obj 能转成数字，且是一个有限的数字，而后才能去处理 返回为true;
},

```

### type() : 判断数据类型

```js
// 相对与原生，可以判别的更为细致，核心就在于core_toString.call(obj)

// [[Class]] -> type pairs
class2type = {},

core_toString = class2type.toString,

core_toString.call(obj)

alert( {}.toString.call([]) == '[object Array]' ) //true 即我们可以单独利用{}.toString.call()进行判别 这和jquery中的操作是一样的；
alert({}.toString.call(new Date)) == '[object date] ' //true

class2type[ core_toString.call(obj) ] //这是一个对象找相应属性的一种方式；

// Populate the class2type map
// 通过挂载属性的方式，返回的对应属性的value ，就是下面这句话的作用； 
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase(); //844 row
});

即 ： class2type[ "[object " + Array + "]" ]  = 'array' 

// 总结，我们看过一些说除了原生 typeof 还有 constructor instanceof 都可以对类型进行判断；但这些都会有bug ;最靠谱的就是利用 {}.toString.call()进行判断；

```

```js
type: function( obj ) {
    // 只有obj 为null 或 undefined的情况，与null比较才会返回为true
    if ( obj == null ) {
        // 我们不能直接将obj 弹出，因为$.type 方法返回的都是字符串；利用String 将null与undefined转为对应的字符串类型；
        return String( obj );
    }
    // Support: Safari <= 5.1 (functionish RegExp) 在老版本的safari 中利用type去判别正则对象，其会返回一个function; 正常的情况下 返回的应该是一个function
    //  若 typeof obj === "object" || typeof obj === "function" 都不通过，则obj只能是一个基本类型，则直接利用原生的typeof即可以进行判别； 
    return typeof obj === "object" || typeof obj === "function" ?
         class2type[ core_toString.call(obj) ] || "object" :
        typeof obj;
},
```

### isPlainObject() : 是否为对象自变量

```js
var obj = {};
var obj = {name : 'hello'}
var obj = new Object();

alert($.isPlainObject(obj))//true
// 主要就是为了区分以上的三种情况；
```

```js
isPlainObject: function( obj ) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]" 基本的数据类型；
    // - DOM nodes 如果将一个dom 节点放到$.type()会返回一个object
    // - window
    if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "construct or" property of certain host objects, ie. |window.location|

    // 类似于window.location 满足上面的三个条件，但其又确实不是对象自变量；所以就需要对其作进一步的判别；
    // core_hasOwn = class2type.hasOwnProperty,
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try {
        // arr ---原形链--- Array.prototype  --- 原形链---- Object.prototype
        // 而Object.prototype 挂载有一个唯一的 isPrototypeOf 属性方法，即只有 对象自变量下面才有isPrototypeOf 属性方法，其它的类型的对象都是通过原型链去找到这个对象，可以根据这一点来进行判断；
        // core_hasOwn = class2type.hasOwnProperty, 判别对象下面的属性是否是自身下面的；Object.prototype自身下面有isPrototypeOf属性会返回为真，其它都是通过原形链上找的，就会返回为假；
        if ( obj.constructor &&
                !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }
    } catch ( e ) {
        // 之所以此处会有一个容错机制是为了解决低版本火狐的bug 见源码上面的注释；
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
},

```


### isEmptyObject() : 是否为空的对象

```js
isEmptyObject: function( obj ) {
    var name;
    // for in有一个特点，对象的身上若没有属于自身的属性与方法，而只有系统自带，就会遍历不到；若有自身的属性与方法，就可以遍历到；
    for ( name in obj ) {
        return false;
    }
    return true;
},
```

### error() : 抛出异常

```js
error: function( msg ) {
    // 与原生一样，去抛出自定义的错误；
    throw new Error( msg );
    // 平时我们抛错的主要目的是，自己去查看代码，开发者自己给自己留的便签，出错的时候能很容易定位
},
```

### parseHTML() : 解析节点

```js
// 将一个字符串，转化为节点；关于其使用我们在上面 讨论$('<li>')情况，就已经提及到了；

var str = '<li></li><li></li><script><\/script>'
console.log($.parseHTML(str)); //[li,li]
console.log($.parseHTML(str,document,true)) //[li,li,script] 第三个参数指明能否添加script标签

```

```js
parseHTML: function( data, context, keepScripts ) {
    // 因为就是对字符串进行操作的，若不是字符串，直接为空就是了；
    if ( !data || typeof data !== "string" ) {
        return null;
    }
    // 若没指定执行上下文，则第二个参数就是keepScripts
    if ( typeof context === "boolean" ) {
        keepScripts = context;
        context = false;
    }
    // 将context指向默认的document 其实context只能是document无非是其有可能是iframe页面的document
    context = context || document;  
    // rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/ 
    // 用来判别是否是纯粹的单标签 $('<li>')或$('<li></li>') 标签中间没有任何的东西
    var parsed = rsingleTag.exec( data ),
        scripts = !keepScripts && [];

    // Single tag
    if ( parsed ) {
        return [ context.createElement( parsed[1] ) ];
    }

    // 多标签的情况，jQuery.buildFragment( )通过文档字符串的形式，创建多个dom对象，其会返回一个值，这个值下面的childNodes 就是我们想要的；
    parsed = jQuery.buildFragment( [ data ], context, scripts );

    if ( scripts ) {
        jQuery( scripts ).remove();
    }

    return jQuery.merge( [], parsed.childNodes );
},


```

### parseJSON() : 解析JSON

```js
// 字符串形式必须是严格的json形式；
var str = '{"name" : "hello"}';

alert($.parseJSON(str).name); //hello
```

```js
// ecma直接提供的方法，ie8及以下不支持；
// JSON.parse 与 eval都可以做json字符串解析.但JSON.parse相对比较安全一点，因为其只可以解析严格模式下的json字符串；
parseJSON: JSON.parse,
```

### parseXML() : 解析XML 这个没细听；21课

```js
// Cross-browser xml parsing
parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
        return null;
    } 

    // Support: IE9
    try {
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
    } catch ( e ) {
        xml = undefined;
    }

    if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
        jQuery.error( "Invalid XML: " + data );
    }
    return xml;
},

```

### noop() : 空函数

```js
// 就是一个空函数，其实我们在做插件或组件开发的时候，经常会写一些默认的参数；而默认的参数有可能就是一个空的函数，所以直接去调用noop就行了；
noop: function() {},
```

### globalEval() : 全局解析js

主要作用:在函数内部将一个局部变量变成一个可以进行全局访问的变量 

```js
function test(){
    var newVar = true；
    $.globalEval("var newVar2 = true");//在函数内部将一个局部变量变成一个可以进行全局访问的变量
}
test();
alert(newVar); //undefined 因为 newVar是一个局部变量，在全局状态下无法访问；
alert(newVar2); //true 可以在全局状态下访问到

```

```js
// code 就是一串代码；必须是字符串的形式；
globalEval: function( code ) {
    // 之所以将eval存储到indirect中，见注释；
    var script,
            indirect = eval;

    code = jQuery.trim( code );

    if ( code ) {
        // If the code includes a valid, prologue position
        // strict mode pragma, execute code by injecting a
        // script tag into the document.
        // 判别当前解析的字符串是否包含严格模式，如果是严格模式则进入处理流程，否则直接利用eval进行解析；indirect(code) = eval(code )
        // 之所以进行if判断是因为 在严格模式下是不支持eval解析的；
        if ( code.indexOf("use strict") === 1 ) {
            // 在严格模式下通过创建script标签的方式，使其变成全局的；
            script = document.createElement("script");
            script.text = code;
            document.head.appendChild( script ).parentNode.removeChild( script );
        } else {
        // Otherwise, avoid the DOM node creation, insertion
        // and removal by using an indirect global eval
            indirect( code );
        }
    }
},
```

>  eval 与 window.eval的区别；

```js
function test(){
    eval ('var a = 1');
    window.eval('var b = 2');

    var val = eval;
    val('var c = 3')
}
test();

alert(a); //undefined
alert(b); // 2
alert(c); //3

// 之所以会出现上面的情况，是因为eval既是js当中的一个关键字，也是window下面的一个属性；如果我们直接来用其只会用作一个关键字来处理，即这个关键字只会在局部的范围内其作用，而window.eval是 会当作window对象的一个属性进行处理，内部的代码字符串是可以被全局解析到的；
// var val = eval  === var val = window.eval是一个属性值，而非一个关键字，所以val() 中的code字符串也是可以全局解析到的；

// 而在jquery当中 处理方式也是很类似，即没有直接用eval进行解析，而是先将eval赋值给indirect;而后再解析，这样的解析就是全局的；

```


### camelCase() : 转驼峰

主要就是将css中的样式，转化为js中能接受的形式， 因为在js中是不可以接受'-'的；

```js
// Convert dashed to camelCase; used by the css and data modules
// Microsoft forgot to hump their vendor prefix (#9572) 这一点上面已经解释过了；
// -ms-transform  --- msTransform  ie浏览器的处理情况与其它浏览器不同，ie接受前缀首字母小写，其余驼峰的写法；若前缀收字母是大写的就会去报错；
// -moz-transform  ---- MozTransform 
// -weblit-transform  ---- WebkitTransform //除ie之外的浏览器都接受，前缀首字母大写的形式；所以-ms需要单独去做处理； 

camelCase: function( string ) {
    // rmsPrefix = /^-ms-/,
    // 利用string.replace( rmsPrefix, "ms-" ) 将 -ms-trabsform  转化为 ms-transform ;这样后面再转驼峰的时候，就不会动ms;

    // rdashAlpha = /-([\da-z])/gi, 用来匹配 - 或 -3d的字符串

    // 回调函数fcamelCase 回调函数的第一项为正则匹配的整字符串体，第二个参数为匹配 的子项；
    // Used by jQuery.camelCase as callback to replace()
	// fcamelCase = function( all, letter ) {
	// 	return letter.toUpperCase();
	// },
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
},

```

### nodeName() : 是否为指定节点名（内部）

判断标签名 是否指定的dom节点的标签名

```js
$(function(){
    console.log($.nodeName(document.documentElement, 'html'))
    //true 因为html确实是节点document.documentElements的表签名；
    console.log($.nodeName(document.body, 'body')) //true
})

```

```js

nodeName: function( elem, name ) {
    // 之所以要转小写 是因为在不同的浏览器下 nodeName获取的有可能是大写也有可能是小写；此处统一下；
    // alert(document.body.nodeName) //BODY firefox
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
},
```

### each() : 遍历集合

each()是针对jquery对象的，而for 与 while都是针对原生js的； 在jquery中可以使用each(); each()是加强版的for，可以针对数组、类数组（arguments | getVytagName | childNodes）、json集合 做遍历

```js
var json = {name: 'lilei', age: 12 }

// 利用回调去调，还是很方便的
$.each(json,function(key,value){
    // key值就是对象属性名，数组中指的就是索引下标；
    // value就是属性对应的值，或者是索引对应的值
})

```

```js
// args is for internal usage only
each: function( obj, callback, args ) {
    var value,
        i = 0,
        // 对于数组与类数组我们是可以找到length的，但是对于json我们就找不到了，即通过json我们就可区分这两种不同的集合形式；然后去做分别处理；
        length = obj.length, 
        // isArray返回为true就是数组的操作，返回false就是json的操作；且不但针对数组与类数组而且还针对this 即jquery对象，虽然jquery对象是一个json 但这个对象比较特殊，因为key值是下标，而且有length属性；
        // 即在isArray方法中，数组 类数组 与 this都会返回为true ;
        isArray = isArraylike( obj );

    // args存在则是在内部使用的，否则就是外部使用；
    if ( args ) {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                // 与外部使用的唯一区别是，回调函数中传的是不定参，即参数的个数是不确定的；而外部使用的情形下，传参是确定的 i obj[i]
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }  
            }
        } else {
            for ( i in obj ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        }

    // A special, fast, case for the most common use of each
    // args不存在，不是在内部使用；
    } else {
        if ( isArray ) {
            // 数组 类数组 this
            for ( ; i < length; i++ ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            // 对于json 使用for in 遍历，因为没有索引与length
            for ( i in obj ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                // 即在遍历的过程中是可以打断的；
                // $.each(json,function(i,value){
                //     alert(value);
                //     return false;
                // })
                // value 就是函数的返回值，当函数的返回值为false是，就会终止循环，利用这个原理可以在回调函数中做if判断，但满足某个条件的时候，使函数returnfalse 从而终止循环；
                if ( value === false ) {
                    break;
                }
            }
        }
    }

    return obj;
},

```

### trim() : 去前后空格

若一个字符串，前后有空格就可以调用该方法，将字符串前后空格去掉；

```js
var str = ' hello ';
console.log( '(' + str + ')') // '( hello )'
console.log('(' + $.trim(str) + ')')  //(hello)

// 利用原生
console.log('(' + str.trim() + ')') //(hello)
```

```js
trim: function( text ) {
    return text == null ? "" : core_trim.call( text );
    // 若提供的text不为空，则直接利用原生的ecma trim方法；
},

// core_trim = core_version.trim,

```

### makeArray() : 类数组转真数组

将类数组 转化为真数组，不只针对类数组，还可以转json 转字符串；

```js
// results is for internal usage only
makeArray: function( arr, results ) {
    var ret = results || [];

    if ( arr != null ) {
        // 此处只所以将arr放到object中，是因为在我们的内部方法中，isArray只能去判断对象，即只要利用Object()方法转化过，有长度的即是真；
        if ( isArraylike( Object(arr) ) ) {
            jQuery.merge( ret,
                typeof arr === "string" ?
                [ arr ] : arr
            );
        } else {
            core_push.call( ret, arr );
        }
    }

    return ret;
}, 

```

### inArray() : 数组版的indexOf

```js
var arr = ['a', 'b', 'c', 'd'];
console.log($.inArray('b',arr));//1 即方法可以放回指定元素在数组中的索引位置；
console.log($.inArray('w',arr));//-1  若指定元素不存在，则会返回-1;

// 用法类似于原生的indexOf 只不过原生的是针对字符串的，而$.inArray是针对数组的；

```

```js
inArray: function( elem, arr, i ) {
    return arr == null ? -1 : core_indexOf.call( arr, elem, i );
},

```

### merge() : 合并数组

对外就是只针对数组，对内就是为了合并我们特殊形式的json;

```js
merge: function( first, second ) {
    var l = second.length,
        i = first.length,
        j = 0;
    // 即有可能第二个参数，并非是数组或类数组，而只是一个纯json,而json对象是没有length属性的
    // if : $.merge(['a','b'],['c','d'])
    // else: $.merge(['a','b'],{0:'c','1','b'}) 即第二个参数可以是一个没有length的json,但其属性必须是下标的形式
    // 第一个元素可以不是数组，但也必须是带属性下标且有length属性才可以；
    if ( typeof l === "number" ) {
        for ( ; j < l; j++ ) {
            first[ i++ ] = second[ j ];
        }
    } else {
        // second是json的情况；若属性是下标0,1,2的形式；即second[0] 不为undefined 
        while ( second[j] !== undefined ) {
            // 属性是下标0,1,2的形式；
            first[ i++ ] = second[ j++ ];
        }
    }

    // 手动更改length的属性；
    first.length = i;

    return first;
},
```

### grep() : 过滤新数组

```js
grep: function( elems, callback, inv ) {
    var retVal,
        ret = [],
        i = 0,
        length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
        retVal = !!callback( elems[ i ], i );
        if ( inv !== retVal ) {
            ret.push( elems[ i ] );
        }
    }

    return ret;
},


```

### map() : 映射新数组

```js
// arg is for internal usage only
map: function( elems, callback, arg ) {
    var value,
        i = 0,
        length = elems.length,
        isArray = isArraylike( elems ),
        ret = [];

    // Go through the array, translating each of the items to their
    if ( isArray ) {
        for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }

    // Go through every key on the object,
    } else {
        for ( i in elems ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret[ ret.length ] = value;
            }
        }
    }

    // Flatten any nested arrays
    return core_concat.apply( [], ret );
},

```

### guid() : 唯一标识符（内部）

```js
// A global GUID counter for objects
guid: 1,
```

### proxy() : 改this的指向

```js
// Bind a function to a context, optionally partially applying any
// arguments.
proxy: function( fn, context ) {
    var tmp, args, proxy;

    if ( typeof context === "string" ) {
        tmp = fn[ context ];
        context = fn;
        fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
        return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
        return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
},

```


### access() : 多功能值操作（内部）

```js
// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
        length = elems.length,
        bulk = key == null;

    // Sets many values
    if ( jQuery.type( key ) === "object" ) {
        chainable = true;
        for ( i in key ) {
            jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
        }

    // Sets one value
    } else if ( value !== undefined ) {
        chainable = true;

        if ( !jQuery.isFunction( value ) ) {
            raw = true;
        }

        if ( bulk ) {
            // Bulk operations run against the entire set
            if ( raw ) {
                fn.call( elems, value );
                fn = null;

            // ...except when executing function values
            } else {
                bulk = fn;
                fn = function( elem, key, value ) {
                    return bulk.call( jQuery( elem ), value );
                };
            }
        }

        if ( fn ) {
            for ( ; i < length; i++ ) {
                fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
            }
        }
    }

    return chainable ?
        elems :

        // Gets
        bulk ?
            fn.call( elems ) :
            length ? fn( elems[0], key ) : emptyGet;
},
```

### now() : 当前时间

```js
now: Date.now,
```

### swap() : css交换（内部)

```js
// A method for quickly swapping in/out CSS properties to get correct calculations.
// Note: this method belongs to the css module but it's needed here for the support module.
// If support gets modularized, this method should be moved back to the css module.
swap: function( elem, options, callback, args ) {
    var ret, name,
        old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
        old[ name ] = elem.style[ name ];
        elem.style[ name ] = options[ name ];
    }

    ret = callback.apply( elem, args || [] );

    // Revert the old values
    for ( name in options ) {
        elem.style[ name ] = old[ name ];
    }

    return ret;
}
```