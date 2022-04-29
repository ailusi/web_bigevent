$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        samePwd: function (val) {
            if (val === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (val) {
            if (val !== $('[name=newPwd]').val()) {
                return '两次密码不相同'
            }
        }
    })

   $('.layui-form').submit(function (e) { 
       e.preventDefault();
       $.ajax({
           type: "POST",
           url: "/my/updatepwd",
           data: $(this).serialize(),
           success: function (res) {
               if(res.status!==0){
                   return layer.msg('修改密码错误')
               }
               layer.msg('修改密码成功')
               //转成原生js操作dom 
               $('.layui-form')[0].reset()
           }
       });
   });
})