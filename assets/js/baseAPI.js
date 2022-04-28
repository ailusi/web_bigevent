//每次调用ajax时会先调用ajaxPrefilter这个函数


$.ajaxPrefilter(function(options){
options.url='http://www.liulongbin.top:3007'+options.url
})