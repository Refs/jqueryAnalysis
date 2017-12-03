(function(){

    // (21 , 94) 定义了一些列变量与函数；其中有一个函数特别的重要， Jquery = function (){};
    // (8826) 将jquery 方法挂载到window对象上，从而在外面可以使用jquery方法； window.jQuery = window.$ = jQuery;
    // （96,283） 给jquery对象，添加一些属性与方法；

    // （285,347） extend : JQ 的继承方法  目的是希望后续添加的方法 都能通过exend去挂载到jquery对象上面；这样扩展起来就会很方便，而不是上来就将方法挂载到对象上面；利用继承 更方便的去扩展；
    // (349,817) jquery.extend() : 扩展一些工具与方法；
   
        // css与html方法是通过$的实例去调用，所以被称为 jquery的实例方法；
        $().css();
        $().html();

})();


