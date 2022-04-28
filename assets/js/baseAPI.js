//每次调用ajax时会先调用ajaxPrefilter这个函数


$.ajaxPrefilter(function(options){
options.url='http://www.liulongbin.top:3007'+options.url
// 权限接口
if(options.url.indexOf('/my/')!==-1){
    options.headers={
         Authorization: localStorage.getItem('token')||''
        }
}

// 全局统一挂载complete回调函数
options.complete=function (res) {
    // console.log(res);
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //强制情况token
        localStorage.removeItem('token')
        // 强制跳转登录页面
        location.href='/login.html'
    }
} 
})

