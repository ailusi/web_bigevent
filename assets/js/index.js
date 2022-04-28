$(function () {
    //调用函数获取基本信息
    getUserInfo()
    let layer = layui.layer


    $('#logout').click(function (e) {
        e.preventDefault();
        layer.confirm('确认退出登录？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    });
})

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        /* headers: {
            Authorization: localStorage.getItem('token')
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        //无论成功还是失败都调用
        /* complete: function (res) {
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //强制情况token
                localStorage.removeItem('token')
                // 强制跳转登录页面
                location.href='/login.html'
            }
        } */
    })
    function renderAvatar(user) {
        let name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //渲染头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {

            $('.layui-nav-img').hide()
            let first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
}