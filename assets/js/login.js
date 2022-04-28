window.addEventListener("load", function () {
    let link_login = document.querySelector('#link_login')
    let link_reg = document.querySelector('#link_reg')
    let loginbox = document.querySelector('.login-box')
    let regbox = document.querySelector('.reg-box')
    link_reg.addEventListener('click', function () {
        loginbox.style.display = 'none'
        regbox.style.display = 'block'
    })
    link_login.addEventListener('click', function () {
        loginbox.style.display = 'block'
        regbox.style.display = 'none'
    })

})
$(function () {
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui获取对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        password: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],

        repassword: function (value) {
            let pwd = $('.reg-box [name=userpassword]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }



    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', (e) => {
        e.preventDefault()
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=userpassword]').val() }
        $.post("/api/reguser", data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录')
                $('#link_login').click()
            }
        );
    })

    //监听登入表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $('#form_login').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登入成功');
                //将登入成功的token保持在localStorage
                localStorage.setItem('token', res.token)
                //跳转页面时间
                setTimeout(function () { window.location.href = '/index.html'; }, 1000)
            }
        });

    });
})


